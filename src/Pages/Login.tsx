import { useState } from "react";
import { Helmet } from "react-helmet";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Btn } from "@/Components";
import OTPVerification from "@/Components/OTPVerification";
import Icons from "@/Constants/Icons";
import Images from "@/Constants/Images";
import AuthServices, { type User } from "@/Services/AuthServices";
import LoginSchema from "@/Utils/Validations/Login/Schema";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface LoginStep {
  step: "form" | "verification";
  email?: string;
}

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<LoginStep>({ step: "form" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: typeof initialValues) => {
    setLoading(true);

    try {
      const response = await AuthServices.login({
        email: values.email,
        password: values.password,
      });

      if (response.status) {
        // Login successful
        AuthServices.saveAuthData(response.data.token, response.data.user);
        toast.success("تم تسجيل الدخول بنجاح!");
        navigate("/");
      } else {
        toast.error(response.error || "فشل في تسجيل الدخول");
      }
    } catch (error) {
      // Special handling for unverified accounts
      const errorMessage =
        error instanceof Error ? error.message : "فشل في الاتصال بالخادم";
      if (errorMessage.includes("غير مُحقق") || errorMessage.includes("406")) {
        setCurrentStep({ step: "verification", email: values.email });
        toast.warning("يجب تحقيق حسابك أولاً. تم إرسال رمز تحقق جديد.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = (data: { token?: string; user?: User }) => {
    // Save user data after verification
    if (data?.token && data?.user) {
      AuthServices.saveAuthData(data.token, data.user);
      toast.success("تم التحقق بنجاح! مرحباً بك");
      navigate("/");
    }
  };

  const handleOTPError = (error: string) => {
    toast.error(error);
  };

  // for login with google
  const googleLogin = useGoogleLogin({
    onSuccess: () => {},
    onError: () => {},
  });

  return (
    <>
      <Helmet>
        <title>Login | Shiro Real Estate - Access Your Account</title>
        <meta
          name="description"
          content="Login to your Shiro Real Estate account. Access your property listings, saved searches, and manage your real estate portfolio in Dubai."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {currentStep.step === "form" ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4 }}
              >
                {/* Back Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-6"
                >
                  <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 group"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                      <Icons.FaLongArrowAltLeft className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium capitalize">
                      {t("Back to website")}
                    </span>
                  </button>
                </motion.div>

                {/* Login Card */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8"
                >
                  {/* Logo and Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mb-8"
                  >
                    <div className="w-32 h-10 mx-auto mb-4">
                      <img
                        src={Images.Logo}
                        className="w-full h-full object-contain"
                        alt="Logo"
                      />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {t("Login to your account")}
                    </h1>
                    <p className="text-gray-600 text-sm">
                      {t("Don't have an account yet?")}{" "}
                      <NavLink
                        to="/signup"
                        className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
                      >
                        {t("Sign Up")}
                      </NavLink>
                    </p>
                  </motion.div>

                  {/* Login Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="space-y-6"
                  >
                    <Formik
                      initialValues={initialValues}
                      validationSchema={LoginSchema}
                      onSubmit={onSubmit}
                    >
                      {({ errors, touched, isSubmitting }) => (
                        <Form className="space-y-4">
                          {/* Email Field */}
                          <div>
                            <Field
                              name="email"
                              type="email"
                              placeholder={t("Email Address")}
                              className={`w-full h-12 px-4 border-2 rounded-xl transition-all duration-200 ${
                                errors.email && touched.email
                                  ? "border-red-300 bg-red-50"
                                  : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                              }`}
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>

                          {/* Password Field */}
                          <div>
                            <div className="relative">
                              <Field
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder={t("Password")}
                                className={`w-full h-12 px-4 pr-12 border-2 rounded-xl transition-all duration-200 ${
                                  errors.password && touched.password
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors duration-200"
                              >
                                {showPassword ? (
                                  <Icons.FaEyeSlash size={20} />
                                ) : (
                                  <Icons.FaEye size={20} />
                                )}
                              </button>
                            </div>
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>

                          {/* Forgot Password Link */}
                          <div className="flex justify-end">
                            <NavLink
                              to="/forgotpassword"
                              className="text-sm text-primary hover:text-primary/80 underline transition-colors duration-200"
                            >
                              {t("Forgot your password?")}
                            </NavLink>
                          </div>

                          {/* Submit Button */}
                          <motion.button
                            type="submit"
                            disabled={loading || isSubmitting}
                            className={`w-full h-12 bg-primary text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                              loading
                                ? "cursor-not-allowed"
                                : "hover:bg-primary/90"
                            }`}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
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
                            <span>
                              {loading ? t("Logging in...") : t("Login")}
                            </span>
                          </motion.button>

                          {/* Privacy Policy */}
                          <div className="text-center">
                            <p className="text-xs text-gray-500">
                              {t(
                                "By clicking Login you agree to our Privacy Policy."
                              )}
                            </p>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </motion.div>

                  {/* Social Login */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <div className="text-center mb-4">
                      <span className="text-sm text-gray-500">
                        {t("Or login with")}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <Btn
                        type="outLine"
                        text="log in with google"
                        conClass="w-full max-w-[280px] border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                        isIcons={<Icons.FcGoogle size={16} />}
                        onclick={googleLogin}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="otp-verification"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8"
              >
                <div className="mb-6">
                  <button
                    onClick={() => setCurrentStep({ step: "form" })}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 group"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                      <Icons.FaLongArrowAltLeft className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium capitalize">
                      {t("Back to login")}
                    </span>
                  </button>
                </div>

                <OTPVerification
                  email={currentStep.email!}
                  onSuccess={handleOTPSuccess}
                  onError={handleOTPError}
                  onResendSuccess={() => toast.success("تم إرسال رمز جديد!")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
