import { useState } from "react";
import { Helmet } from "react-helmet";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Btn } from "@/Components";
import PasswordStrengthIndicator from "@/Components/PasswordStrengthIndicator";
import OTPVerification from "@/Components/OTPVerification";
import Icons from "@/Constants/Icons";
import Images from "@/Constants/Images";
import AuthServices, {
  type RegisterData,
  type User,
} from "@/Services/AuthServices";
import SignUpSchema from "@/Utils/Validations/SignUp/Schema";
import { validatePassword } from "@/Utils/Validations/passwordValidation";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface SignUpStep {
  step: "form" | "verification";
  email?: string;
}

const initialValues: RegisterData & { terms: boolean } = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  birthday: "",
  phone: "",
  gender: "",
  address: "",
  terms: false,
};

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<SignUpStep>({ step: "form" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: typeof initialValues) => {
    setLoading(true);

    try {
      // Validate password locally first
      const passwordValidation = validatePassword(values.password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.errors.join("، "));
        setLoading(false);
        return;
      }

      // Send registration data
      const response = await AuthServices.register({
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
        birthday: values.birthday,
        phone: values.phone,
        gender: values.gender || undefined,
        address: values.address || undefined,
      });

      if (response.status) {
        // Registration successful - go to OTP verification page
        setCurrentStep({ step: "verification", email: values.email });
        toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      } else {
        toast.error(response.error || "فشل في التسجيل");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "فشل في الاتصال بالخادم";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = (data: { token?: string; user?: User }) => {
    // Save user data
    if (data?.token && data?.user) {
      AuthServices.saveAuthData(data.token, data.user);
      toast.success("تم التحقق بنجاح! مرحباً بك");
      navigate("/");
    }
  };

  const handleOTPError = (error: string) => {
    toast.error(error);
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | Shiro Real Estate - Create Your Account</title>
        <meta
          name="description"
          content="Create your Shiro Real Estate account. Join thousands of users discovering their dream properties in Dubai. Fast, secure, and easy registration."
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
                key="signup-form"
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
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 group"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                      <Icons.FaLongArrowAltLeft className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium capitalize">
                      {t("Back to login")}
                    </span>
                  </button>
                </motion.div>

                {/* SignUp Card */}
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
                      {t("Create your account")}
                    </h1>
                    <p className="text-gray-600 text-sm">
                      {t("Already have an account?")}{" "}
                      <NavLink
                        to="/login"
                        className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
                      >
                        {t("Login")}
                      </NavLink>
                    </p>
                  </motion.div>

                  {/* SignUp Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="space-y-6"
                  >
                    <Formik
                      initialValues={initialValues}
                      validationSchema={SignUpSchema}
                      onSubmit={onSubmit}
                    >
                      {({ values, errors, touched, isSubmitting }) => (
                        <Form className="space-y-4">
                          {/* Name Field */}
                          <div>
                            <Field
                              name="name"
                              type="text"
                              placeholder={t("Full Name")}
                              className={`w-full h-12 px-4 border-2 rounded-xl transition-all duration-200 ${
                                errors.name && touched.name
                                  ? "border-red-300 bg-red-50"
                                  : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                              }`}
                            />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>

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

                            {/* Password Strength Indicator */}
                            <PasswordStrengthIndicator
                              password={values.password}
                              className="mt-3"
                            />

                            <ErrorMessage
                              name="password"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>

                          {/* Password Confirmation Field */}
                          <div>
                            <div className="relative">
                              <Field
                                name="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={t("Confirm Password")}
                                className={`w-full h-12 px-4 pr-12 border-2 rounded-xl transition-all duration-200 ${
                                  errors.password_confirmation &&
                                  touched.password_confirmation
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors duration-200"
                              >
                                {showConfirmPassword ? (
                                  <Icons.FaEyeSlash size={20} />
                                ) : (
                                  <Icons.FaEye size={20} />
                                )}
                              </button>
                            </div>
                            <ErrorMessage
                              name="password_confirmation"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>

                          {/* Birthday Field */}
                          <div>
                            <Field
                              name="birthday"
                              type="date"
                              className={`w-full h-12 px-4 border-2 rounded-xl transition-all duration-200 ${
                                errors.birthday && touched.birthday
                                  ? "border-red-300 bg-red-50"
                                  : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                              }`}
                            />
                            <ErrorMessage
                              name="birthday"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>

                          {/* Phone Field */}
                          <div>
                            <Field
                              name="phone"
                              type="tel"
                              placeholder={t(
                                "Phone Number (e.g. +971501234567)"
                              )}
                              className={`w-full h-12 px-4 border-2 rounded-xl transition-all duration-200 ${
                                errors.phone && touched.phone
                                  ? "border-red-300 bg-red-50"
                                  : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                              }`}
                            />
                            <ErrorMessage
                              name="phone"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>

                          {/* Optional Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Gender Field */}
                            <div>
                              <Field
                                as="select"
                                name="gender"
                                className="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                              >
                                <option value="">
                                  {t("Gender (Optional)")}
                                </option>
                                <option value="male">{t("Male")}</option>
                                <option value="female">{t("Female")}</option>
                                <option value="other">{t("Other")}</option>
                              </Field>
                            </div>

                            {/* Address Field */}
                            <div>
                              <Field
                                name="address"
                                type="text"
                                placeholder={t("Address (Optional)")}
                                className="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                              />
                            </div>
                          </div>

                          {/* Terms Checkbox */}
                          <div className="flex items-start gap-3">
                            <Field
                              name="terms"
                              type="checkbox"
                              className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label className="text-sm text-gray-600">
                              {t("I agree to the")}{" "}
                              <NavLink
                                to="/terms-conditions"
                                className="text-primary hover:text-primary/80 underline"
                              >
                                {t("Terms & Conditions")}
                              </NavLink>{" "}
                              {t("and")}{" "}
                              <NavLink
                                to="/privacy-policy"
                                className="text-primary hover:text-primary/80 underline"
                              >
                                {t("Privacy Policy")}
                              </NavLink>
                            </label>
                          </div>
                          <ErrorMessage
                            name="terms"
                            component="div"
                            className="text-sm text-red-600"
                          />

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
                              {loading
                                ? t("Creating account...")
                                : t("Create Account")}
                            </span>
                          </motion.button>
                        </Form>
                      )}
                    </Formik>
                  </motion.div>

                  {/* Social SignUp */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <div className="text-center mb-4">
                      <span className="text-sm text-gray-500">
                        {t("Or sign up with")}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <Btn
                        type="outLine"
                        text="sign up with google"
                        conClass="w-full max-w-[280px] border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                        isIcons={<Icons.FcGoogle size={16} />}
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

export default SignUp;
