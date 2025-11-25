import { AuthAxios, PublicAxios } from "./AxiosHandler";

// Response data type
export interface ApiResponse<T = any> {
  data: T;
  status: boolean;
  error?: string;
  statusCode?: number;
}

// User data type
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  address?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

// Login response data type
export interface LoginResponse {
  user: User;
  token: string;
}

// Registration data type
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  birthday: string;
  phone: string;
  gender?: string;
  address?: string;
}

// Enhanced error messages
export const AUTH_ERROR_MESSAGES = {
  400: "خطأ في البيانات المُرسلة. يرجى التحقق من المعلومات.",
  401: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  406: "الحساب غير مُحقق. تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.",
  409: "البريد الإلكتروني مُستخدم مسبقاً. يرجى استخدام بريد إلكتروني آخر.",
  503: "فشل في إرسال البريد الإلكتروني. يرجى التحقق من الاتصال والمحاولة مرة أخرى.",
  500: "خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.",
  network: "فشل في الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت.",
  timeout: "انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.",
  unknown: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
} as const;

class AuthServices {
  static endPoint = "auth";

  /**
   * معالج الأخطاء الموحد
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

    // If there's a custom error message from the API
    if (errorMessage) {
      return errorMessage;
    }

    // Error messages by status code
    return (
      AUTH_ERROR_MESSAGES[status as keyof typeof AUTH_ERROR_MESSAGES] ||
      AUTH_ERROR_MESSAGES.unknown
    );
  }

  /**
   * تسجيل الدخول
   */
  static async login(body: {
    email: string;
    password: string;
  }): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await PublicAxios.post(
        `${AuthServices.endPoint}/login`,
        body
      );
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * تسجيل حساب جديد
   */
  static async register(
    body: RegisterData
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await PublicAxios.post(
        `${AuthServices.endPoint}/register`,
        body
      );
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * طلب استرداد كلمة المرور
   */
  static async forgotPassword(body: { email: string }): Promise<ApiResponse> {
    try {
      const response = await PublicAxios.post(
        `${AuthServices.endPoint}/forgot-password`,
        body
      );
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * التحقق من رمز استرداد كلمة المرور
   */
  static async checkResetToken(body: {
    email: string;
    token: string;
  }): Promise<ApiResponse> {
    try {
      const response = await PublicAxios.post(
        `${AuthServices.endPoint}/check-reset-token`,
        body
      );
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * إعادة تعيين كلمة المرور
   */
  static async resetPassword(body: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }): Promise<ApiResponse> {
    try {
      const response = await PublicAxios.post(
        `${AuthServices.endPoint}/reset-password`,
        body
      );
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * التحقق من صحة البريد الإلكتروني قبل التسجيل
   */
  static async checkEmailAvailability(body: {
    email: string;
  }): Promise<ApiResponse> {
    try {
      const response = await PublicAxios.post(
        `${AuthServices.endPoint}/check-email`,
        body
      );
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * التحقق من وجود البريد الإلكتروني
   */
  static async emailExists(body: { email: string }): Promise<ApiResponse> {
    try {
      const response = await PublicAxios.post(
        `${AuthServices.endPoint}/email-exists`,
        body
      );
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  // ============= Protected APIs (require Token) =============

  /**
   * Get current user data
   */
  static async getUserProfile(): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await AuthAxios.get("user/profile");
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Update user data
   */
  static async updateUserProfile(
    body: Partial<User>
  ): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await AuthAxios.post("user/profile/update", body);
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Change password
   */
  static async changePassword(body: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<ApiResponse> {
    try {
      const response = await AuthAxios.post("user/change-password", body);
      return response.data;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }

  // ============= Helper functions for Token Management =============

  /**
   * Save login data
   */
  static saveAuthData(token: string, user: User): void {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // For compatibility with current system
    const Cookies = require("js-cookie");
    Cookies.set("token", token);
    if (user.name) {
      Cookies.set("username", user.name);
    }
  }

  /**
   * Clear login data
   */
  static clearAuthData(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    // For compatibility with current system
    const Cookies = require("js-cookie");
    Cookies.remove("token");
    Cookies.remove("username");
  }

  /**
   * التحقق من حالة تسجيل الدخول
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem("auth_token");
    return !!token;
  }

  /**
   * الحصول على بيانات المستخدم المحفوظة
   */
  static getCurrentUser(): User | null {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * الحصول على الـ Token
   */
  static getToken(): string | null {
    return localStorage.getItem("auth_token");
  }
}

export default AuthServices;
