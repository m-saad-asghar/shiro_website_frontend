import { PublicAxios } from "./AxiosHandler";
import { AUTH_ERROR_MESSAGES } from "./AuthServices";

// OTP data type
export interface OTPData {
  email: string;
  otp: string;
}

export interface OTPResponse {
  status: boolean;
  data?: any;
  error?: string;
  message?: string;
}

class OTPServices {
  /**
   * Unified error handler for OTP
   */
  private static handleError(error: any): string {
    if (error.code === "NETWORK_ERROR") {
      return AUTH_ERROR_MESSAGES.network;
    }

    if (error.code === "ECONNABORTED") {
      return AUTH_ERROR_MESSAGES.timeout;
    }

    const status = error.response?.status;
    const errorMessage = error.response?.data?.error;

    // Custom error messages for OTP
    if (errorMessage) {
      if (errorMessage.includes("expired")) {
        return "انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد.";
      }
      if (
        errorMessage.includes("invalid") ||
        errorMessage.includes("incorrect")
      ) {
        return "رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.";
      }
      if (errorMessage.includes("attempts")) {
        return "تم تجاوز عدد المحاولات المسموحة. يرجى طلب رمز جديد.";
      }
      return errorMessage;
    }

    // Error messages by status code
    return (
      AUTH_ERROR_MESSAGES[status as keyof typeof AUTH_ERROR_MESSAGES] ||
      AUTH_ERROR_MESSAGES.unknown
    );
  }

  /**
   * Verify email OTP
   */
  static async verifyEmailOTP(body: OTPData): Promise<OTPResponse> {
    try {
      // Validate data locally
      if (!body.email || !body.otp) {
        throw new Error("البريد الإلكتروني ورمز التحقق مطلوبان");
      }

      if (body.otp.length !== 6) {
        throw new Error("رمز التحقق يجب أن يكون مكون من 6 أرقام");
      }

      if (!/^\d{6}$/.test(body.otp)) {
        throw new Error("رمز التحقق يجب أن يحتوي على أرقام فقط");
      }

      const response = await PublicAxios.post("user/verify-email-otp", body);
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * إعادة إرسال OTP للبريد الإلكتروني
   */
  static async resendEmailOTP(body: { email: string }): Promise<OTPResponse> {
    try {
      if (!body.email) {
        throw new Error("البريد الإلكتروني مطلوب");
      }

      const response = await PublicAxios.post("user/resend-email-otp", body);
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * التحقق من OTP للهاتف (للاستخدام المستقبلي)
   */
  static async verifyPhoneOTP(body: {
    phone: string;
    otp: string;
  }): Promise<OTPResponse> {
    try {
      if (!body.phone || !body.otp) {
        throw new Error("رقم الهاتف ورمز التحقق مطلوبان");
      }

      if (body.otp.length !== 6) {
        throw new Error("رمز التحقق يجب أن يكون مكون من 6 أرقام");
      }

      const response = await PublicAxios.post("user/verify-phone-otp", body);
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * إعادة إرسال OTP للهاتف (للاستخدام المستقبلي)
   */
  static async resendPhoneOTP(body: { phone: string }): Promise<OTPResponse> {
    try {
      if (!body.phone) {
        throw new Error("رقم الهاتف مطلوب");
      }

      const response = await PublicAxios.post("user/resend-phone-otp", body);
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * التحقق من حالة OTP (هل ما زال صالحاً)
   */
  static async checkOTPStatus(body: { email: string }): Promise<OTPResponse> {
    try {
      const response = await PublicAxios.post("user/check-otp-status", body);
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  // ============= Helper functions =============

  /**
   * Validate OTP code locally
   */
  static validateOTPFormat(otp: string): { isValid: boolean; error?: string } {
    if (!otp) {
      return { isValid: false, error: "رمز التحقق مطلوب" };
    }

    if (otp.length !== 6) {
      return {
        isValid: false,
        error: "رمز التحقق يجب أن يكون مكون من 6 أرقام",
      };
    }

    if (!/^\d{6}$/.test(otp)) {
      return { isValid: false, error: "رمز التحقق يجب أن يحتوي على أرقام فقط" };
    }

    return { isValid: true };
  }

  /**
   * Validate email
   */
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email) {
      return { isValid: false, error: "البريد الإلكتروني مطلوب" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "البريد الإلكتروني غير صحيح" };
    }

    return { isValid: true };
  }

  /**
   * Calculate remaining time until OTP expiry (15 minutes)
   */
  static calculateOTPExpiry(sentTime: Date): {
    isExpired: boolean;
    remainingMinutes: number;
    remainingSeconds: number;
  } {
    const now = new Date();
    const expiryTime = new Date(sentTime.getTime() + 15 * 60 * 1000); // 15 minutes
    const remainingMs = expiryTime.getTime() - now.getTime();

    if (remainingMs <= 0) {
      return {
        isExpired: true,
        remainingMinutes: 0,
        remainingSeconds: 0,
      };
    }

    const remainingMinutes = Math.floor(remainingMs / 60000);
    const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);

    return {
      isExpired: false,
      remainingMinutes,
      remainingSeconds,
    };
  }

  /**
   * تنسيق رمز OTP للعرض (مع فراغات)
   */
  static formatOTPForDisplay(otp: string): string {
    if (otp.length !== 6) return otp;
    return `${otp.slice(0, 3)} ${otp.slice(3)}`;
  }

  /**
   * إزالة التنسيق من رمز OTP
   */
  static cleanOTPInput(otp: string): string {
    return otp.replace(/\s/g, "").replace(/\D/g, "");
  }
}

export default OTPServices;
