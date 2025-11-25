import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  getPasswordRequirements,
  checkPasswordStrength,
} from "@/Utils/Validations/passwordValidation";
import Icons from "@/Constants/Icons";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true,
  className = "",
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const requirements = getPasswordRequirements(password);
  const strength = checkPasswordStrength(password);

  // Gradient colors based on strength
  const getGradientColors = () => {
    switch (strength.level) {
      case "weak":
        return "from-red-500 to-red-400";
      case "medium":
        return "from-amber-500 to-yellow-400";
      case "strong":
        return "from-emerald-500 to-green-400";
      default:
        return "from-gray-300 to-gray-200";
    }
  };

  // Translated strength text
  const getStrengthText = () => {
    switch (strength.level) {
      case "weak":
        return t("Weak");
      case "medium":
        return t("Medium");
      case "strong":
        return t("Strong");
      default:
        return t("None");
    }
  };

  // If no password entered, don't display anything
  if (!password) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`password-strength-indicator ${className}`}
    >
      {/* Strength bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t("Password Strength")}
          </span>
          <span
            className="text-sm font-bold transition-colors duration-300"
            style={{ color: strength.color }}
          >
            {getStrengthText()}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${strength.percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getGradientColors()} relative`}
          >
            {/* Light effect */}
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </motion.div>

          {/* Division points */}
          <div className="absolute inset-0 flex justify-between items-center px-1">
            {[20, 40, 60, 80].map((position, index) => (
              <div
                key={index}
                className="w-0.5 h-1.5 bg-white rounded-full opacity-50"
                style={{ marginLeft: `${position - 2}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Requirements list */}
      {showRequirements && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {requirements.map((requirement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                  requirement.passed ? "text-emerald-600" : "text-gray-500"
                }`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className={`flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300 ${
                    requirement.passed
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {requirement.passed ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icons.FaCheck size={12} />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icons.FaTimes size={10} />
                    </motion.div>
                  )}
                </motion.div>

                <span
                  className={`transition-all duration-300 ${
                    requirement.passed ? "font-medium" : "font-normal"
                  }`}
                >
                  {isRTL ? requirement.labelAr : requirement.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Additional tips */}
      {strength.level === "weak" && password.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <div className="flex items-start gap-2">
            <Icons.FaExclamationTriangle
              className="text-amber-500 mt-0.5 flex-shrink-0"
              size={16}
            />
            <p className="text-sm text-amber-700">
              {t(
                "Weak password. For better security, please meet all requirements."
              )}
            </p>
          </div>
        </motion.div>
      )}

      {/* Success message */}
      {strength.level === "strong" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Icons.FaCheckCircle
              className="text-emerald-500 flex-shrink-0"
              size={16}
            />
            <p className="text-sm text-emerald-700 font-medium">
              {t("Excellent! Your password is strong and secure.")}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PasswordStrengthIndicator;
