import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Icons from "@/Constants/Icons";
import Images from "@/Constants/Images";
import { PASSWORD_CONFIG, PASSWORD_MESSAGES } from "@/config/passwordConfig";

interface PasswordProtectionProps {
  onSuccess: () => void;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password from settings
  const SITE_PASSWORD = PASSWORD_CONFIG.SITE_PASSWORD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate short loading
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (password === SITE_PASSWORD) {
      // Save access status in localStorage
      localStorage.setItem("siteAccess", "granted");
      localStorage.setItem("accessTime", Date.now().toString());
      onSuccess();
    } else {
      setError(t(PASSWORD_MESSAGES.INVALID_PASSWORD));
      setPassword("");
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit(e as any);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#094834] via-[#0a5a42] to-[#094834] flex items-center justify-center p-4"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4">
              <img
                src={Images.Logo}
                className="w-full h-full object-contain"
                alt="Shiro Properties Logo"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#094834] mb-2">
              {t("Welcome to Shiro Properties")}
            </h1>
            <p className="text-gray-600 text-sm">
              {t("Please enter the access password to continue")}
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("Enter access password")}
                  className="w-full h-14 px-4 pr-12 border-2 border-gray-300 rounded-xl focus:border-[#094834] focus:ring-2 focus:ring-[#094834]/20 transition-all duration-200 bg-white text-gray-900 text-center font-medium"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#094834] transition-colors"
                >
                  {showPassword ? (
                    <Icons.FaEyeSlash size={20} />
                  ) : (
                    <Icons.FaEye size={20} />
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg"
                >
                  <Icons.IoAlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full h-14 bg-[#094834] hover:bg-[#9f8151] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-[.4s] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{t("Verifying...")}</span>
                </>
              ) : (
                <>
                  <Icons.IoShieldCheckmarkOutline size={20} />
                  <span>{t("Access Site")}</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              {t("This site is password protected")}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Icons.IoShieldCheckmarkOutline
                size={14}
                className="text-[#094834]"
              />
              <span className="text-xs text-[#094834] font-medium">
                {t("Secure Access")}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PasswordProtection;
