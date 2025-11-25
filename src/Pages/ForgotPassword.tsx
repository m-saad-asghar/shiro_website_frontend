import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Images from "@/Constants/Images";
import Icons from "@/Constants/Icons";
import AuthServices from "@/Services/AuthServices";
import PasswordStrengthIndicator from "@/Components/PasswordStrengthIndicator";
import { validatePassword } from "@/Utils/Validations/passwordValidation";
import { toast } from "sonner";

type Step = 1 | 2 | 3; // 1: Email, 2: OTP, 3: New Password

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Countdown
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Start countdown timer in step 2
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (step === 2 && countdown > 0 && !canResend) {
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
  }, [step, countdown, canResend]);

  // Step 1: Send email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthServices.forgotPassword({ email });
      if (response.status) {
        toast.success("تم إرسال رمز الاسترداد إلى بريدك الإلكتروني");
        setStep(2);
        setCountdown(60);
        setCanResend(false);
      }
    } catch (error: any) {
      toast.error(error.message || "فشل في إرسال البريد الإلكتروني");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("يرجى إدخال رمز مكون من 6 أرقام");
      return;
    }

    setLoading(true);

    try {
      const response = await AuthServices.checkResetToken({
        email,
        token: code,
      });
      if (response.status) {
        toast.success("تم التحقق من الرمز بنجاح");
        setStep(3);
      }
    } catch (error: any) {
      toast.error(error.message || "رمز التحقق غير صحيح");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password locally
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.errors.join("، "));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتان");
      return;
    }

    setLoading(true);
    const code = otp.join("");

    try {
      const response = await AuthServices.resetPassword({
        email,
        token: code,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      if (response.status) {
        toast.success("تم تغيير كلمة المرور بنجاح!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.message || "فشل في تغيير كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);

    try {
      const response = await AuthServices.forgotPassword({ email });
      if (response.status) {
        toast.success("تم إرسال رمز جديد!");
        setCountdown(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (error: any) {
      toast.error(error.message || "فشل في إعادة الإرسال");
    } finally {
      setLoading(false);
    }
  };

  // Format countdown timer
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | Shiro Real Estate - Reset Your Password</title>
        <meta
          name="description"
          content="Reset your Shiro Real Estate account password. Secure password recovery process to regain access to your property listings and account."
        />
      </Helmet>
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center py-12 px-4">
        <div className="container flex-center">
          <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {/* Logo */}
            <div className="flex-center flex-col gap-3 mb-8">
              <div className="w-[140px] h-[40px]">
                <img
                  src={Images.Logo}
                  className="w-full h-full object-contain"
                  alt="Logo"
                />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary text-center">
                {t("Forgot Password")}
              </h1>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-2">
                {/* Step 1 */}
                <motion.div
                  animate={{
                    backgroundColor: step >= 1 ? "#094834" : "#e5e7eb",
                    color: step >= 1 ? "#ffffff" : "#9ca3af",
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all"
                >
                  {step > 1 ? <Icons.FaCheck size={16} /> : "1"}
                </motion.div>
                <motion.div
                  animate={{
                    backgroundColor: step > 1 ? "#094834" : "#e5e7eb",
                  }}
                  className="w-16 h-1"
                />

                {/* Step 2 */}
                <motion.div
                  animate={{
                    backgroundColor: step >= 2 ? "#094834" : "#e5e7eb",
                    color: step >= 2 ? "#ffffff" : "#9ca3af",
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all"
                >
                  {step > 2 ? <Icons.FaCheck size={16} /> : "2"}
                </motion.div>
                <motion.div
                  animate={{
                    backgroundColor: step > 2 ? "#094834" : "#e5e7eb",
                  }}
                  className="w-16 h-1"
                />

                {/* Step 3 */}
                <motion.div
                  animate={{
                    backgroundColor: step >= 3 ? "#094834" : "#e5e7eb",
                    color: step >= 3 ? "#ffffff" : "#9ca3af",
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all"
                >
                  3
                </motion.div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Email */}
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSendEmail}
                  className="space-y-6"
                >
                  <p className="text-sm text-gray-600 text-center mb-6">
                    {t(
                      "Please enter your email address. We'll send you a verification code."
                    )}
                  </p>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      {t("Email Address")}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("Enter your email")}
                        required
                        className="w-full h-14 px-4 pl-12 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white text-gray-900"
                      />
                      <Icons.MdOutlineEmail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                        size={20}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Icons.FaSpinner size={16} />
                      </motion.div>
                    )}
                    {loading ? t("Sending...") : t("Send Verification Code")}
                  </button>

                  <div className="text-center">
                    <NavLink
                      to="/login"
                      className="text-sm text-primary hover:underline"
                    >
                      {t("Back to Login")}
                    </NavLink>
                  </div>
                </motion.form>
              )}

              {/* Step 2: OTP Verification */}
              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                >
                  <p className="text-sm text-gray-600 text-center mb-6">
                    {t("We sent a 6-digit code to")} <strong>{email}</strong>
                  </p>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-3 text-center">
                      {t("Enter Verification Code")}
                    </label>
                    <div className="flex justify-center gap-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Icons.FaSpinner size={16} />
                      </motion.div>
                    )}
                    {loading ? t("Verifying...") : t("Verify Code")}
                  </button>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm text-primary hover:underline"
                    >
                      {t("Change Email")}
                    </button>

                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="text-sm text-primary hover:underline disabled:opacity-50"
                      >
                        {t("Resend Code")}
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500">
                        {t("Resend in")} {formatCountdown(countdown)}
                      </span>
                    )}
                  </div>
                </motion.form>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleResetPassword}
                  className="space-y-6"
                >
                  <p className="text-sm text-gray-600 text-center mb-6">
                    {t("Enter your new password")}
                  </p>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      {t("New Password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t("Enter new password")}
                        minLength={8}
                        required
                        className="w-full h-14 px-4 pr-12 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
                      >
                        {showPassword ? (
                          <Icons.FaEyeSlash size={20} />
                        ) : (
                          <Icons.FaEye size={20} />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    <PasswordStrengthIndicator
                      password={newPassword}
                      className="mt-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      {t("Confirm Password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t("Re-enter your password")}
                        minLength={8}
                        required
                        className="w-full h-14 px-4 pr-12 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
                      >
                        {showConfirmPassword ? (
                          <Icons.FaEyeSlash size={20} />
                        ) : (
                          <Icons.FaEye size={20} />
                        )}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        {t("Passwords do not match")}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || newPassword !== confirmPassword}
                    className="w-full h-14 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Icons.FaSpinner size={16} />
                      </motion.div>
                    )}
                    {loading ? t("Resetting...") : t("Reset Password")}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Footer Links */}
            {step === 1 && (
              <div className="mt-6 text-center text-sm text-gray-600">
                {t("Remember your password?")}{" "}
                <NavLink
                  to="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  {t("Login")}
                </NavLink>{" "}
                {t("or")}{" "}
                <NavLink
                  to="/signup"
                  className="font-semibold text-primary hover:underline"
                >
                  {t("Sign Up")}
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
