import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Icons from "@/Constants/Icons";
import OTPServices from "@/Services/OTPServices";

interface OTPVerificationProps {
  email: string;
  onSuccess: (data: any) => void;
  onError?: (error: string) => void;
  onResendSuccess?: () => void;
  className?: string;
  autoFocus?: boolean;
  length?: number; // Code length (default 6)
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onSuccess,
  onError,
  onResendSuccess,
  className = "",
  autoFocus = true,
  length = 6,
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // OTP states
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Countdown timer
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Input refs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (countdown > 0 && !canResend) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [countdown, canResend]);

  // Auto focus on first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Handle OTP value change
  const handleOTPChange = (index: number, value: string) => {
    // Only numbers allowed
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next field
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify when code is complete
    if (
      newOtp.every((digit) => digit !== "") &&
      newOtp.join("").length === length
    ) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  // Handle key press
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous field on delete
        inputRefs.current[index - 1]?.focus();
      } else {
        // Delete current value
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      handleVerifyOTP(otp.join(""));
    }
  };

  // Paste code
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (pastedData.length === length) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);

      // Auto verify
      handleVerifyOTP(pastedData);
    } else {
      toast.error(
        isRTL
          ? `يرجى لصق رمز مكون من ${length} أرقام`
          : `Please paste a ${length}-digit code`
      );
    }
  };

  // Verify OTP code
  const handleVerifyOTP = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp.join("");

    // Local validation
    const validation = OTPServices.validateOTPFormat(codeToVerify);
    if (!validation.isValid) {
      toast.error(validation.error);
      if (onError) onError(validation.error!);
      return;
    }

    setLoading(true);

    try {
      const response = await OTPServices.verifyEmailOTP({
        email,
        otp: codeToVerify,
      });

      if (response.status) {
        toast.success(isRTL ? "تم التحقق بنجاح!" : "Verification successful!");
        onSuccess(response.data);
      } else {
        const errorMessage =
          response.error ||
          (isRTL ? "رمز التحقق غير صحيح" : "Invalid verification code");
        toast.error(errorMessage);
        if (onError) onError(errorMessage);

        // Reset fields
        setOtp(new Array(length).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      const errorMessage =
        error.message || (isRTL ? "فشل في التحقق" : "Verification failed");
      toast.error(errorMessage);
      if (onError) onError(errorMessage);

      // Reset fields
      setOtp(new Array(length).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP code
  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      const response = await OTPServices.resendEmailOTP({ email });

      if (response.status) {
        toast.success(isRTL ? "تم إرسال رمز جديد!" : "New code sent!");

        // Reset countdown
        setCountdown(60);
        setCanResend(false);

        // Reset fields
        setOtp(new Array(length).fill(""));
        inputRefs.current[0]?.focus();

        if (onResendSuccess) onResendSuccess();
      } else {
        const errorMessage =
          response.error ||
          (isRTL ? "فشل في إعادة الإرسال" : "Failed to resend code");
        toast.error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage =
        error.message ||
        (isRTL ? "فشل في إعادة الإرسال" : "Failed to resend code");
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  // Format countdown timer
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`otp-verification ${className}`}
    >
      {/* Title and description */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isRTL ? "تحقق من بريدك الإلكتروني" : "Verify Your Email"}
        </h2>
        <p className="text-gray-600 text-sm">
          {isRTL ? "تم إرسال رمز التحقق إلى" : "We sent a verification code to"}{" "}
          <span className="font-semibold text-primary">{email}</span>
        </p>
      </div>

      {/* OTP fields */}
      <div className="mb-6">
        <div
          className={`flex justify-center gap-3 ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all duration-200 ${
                digit
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-300 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            />
          ))}
        </div>
      </div>

      {/* Verify button */}
      <motion.button
        type="button"
        onClick={() => handleVerifyOTP()}
        disabled={loading || otp.some((digit) => digit === "")}
        className={`w-full h-12 bg-primary text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          loading ? "cursor-not-allowed" : "hover:bg-primary/90"
        }`}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Icons.FaSpinner size={16} />
          </motion.div>
        )}
        <span>
          {loading
            ? isRTL
              ? "جاري التحقق..."
              : "Verifying..."
            : isRTL
            ? "تحقق"
            : "Verify"}
        </span>
      </motion.button>

      {/* Resend */}
      <div className="mt-6 text-center">
        <AnimatePresence mode="wait">
          {canResend ? (
            <motion.button
              key="resend"
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileHover={{ scale: resendLoading ? 1 : 1.05 }}
            >
              {resendLoading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Icons.FaSpinner size={14} />
                </motion.div>
              )}
              <span>
                {resendLoading
                  ? isRTL
                    ? "جاري الإرسال..."
                    : "Sending..."
                  : isRTL
                  ? "إعادة إرسال الرمز"
                  : "Resend Code"}
              </span>
            </motion.button>
          ) : (
            <motion.p
              key="countdown"
              className="text-gray-500 text-sm flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Icons.FaClock size={14} />
              <span>
                {isRTL ? "يمكنك إعادة الإرسال خلال" : "Resend in"}{" "}
                <span className="font-semibold text-primary">
                  {formatCountdown(countdown)}
                </span>
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Helpful tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <Icons.FaInfoCircle
            className="text-blue-500 mt-0.5 flex-shrink-0"
            size={16}
          />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">
              {isRTL ? "نصائح مفيدة:" : "Helpful tips:"}
            </p>
            <ul
              className={`space-y-1 text-xs ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <li>
                {isRTL
                  ? "• تحقق من صندوق البريد الإلكتروني والرسائل المزعجة"
                  : "• Check your inbox and spam folder"}
              </li>
              <li>
                {isRTL
                  ? "• الرمز صالح لمدة 15 دقيقة"
                  : "• Code is valid for 15 minutes"}
              </li>
              <li>
                {isRTL
                  ? "• يمكنك لصق الرمز مباشرة"
                  : "• You can paste the code directly"}
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OTPVerification;
