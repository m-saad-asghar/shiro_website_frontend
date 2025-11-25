// Password protection settings
export const PASSWORD_CONFIG = {
  // Main password to access the site
  // Can be changed as needed
  SITE_PASSWORD: "!@UnitedArab778899",

  // Access validity duration (in milliseconds)
  // 24 hours = 24 * 60 * 60 * 1000
  // 7 days = 7 * 24 * 60 * 60 * 1000
  // 30 days = 30 * 24 * 60 * 60 * 1000
  ACCESS_EXPIRY_TIME: 24 * 60 * 60 * 1000, // 24 hours

  // localStorage keys
  STORAGE_KEYS: {
    ACCESS_STATUS: "siteAccess",
    ACCESS_TIME: "accessTime",
  },

  // Development settings
  DEVELOPMENT: {
    // Do we want to protect the site in development mode?
    ENABLE_PROTECTION_IN_DEV: true,

    // Additional password for development (optional)
    DEV_PASSWORD: "dev123",
  },

  // UI settings
  UI: {
    // Do we want to show a welcome message?
    SHOW_WELCOME_MESSAGE: true,

    // Do we want to show the company logo?
    SHOW_COMPANY_LOGO: true,

    // Do we want to show security information?
    SHOW_SECURITY_INFO: true,
  },

  // Security settings
  SECURITY: {
    // Maximum number of failed attempts allowed
    MAX_FAILED_ATTEMPTS: 5,

    // Lockout duration after failed attempts (in milliseconds)
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes

    // Do we want to log login attempts?
    LOG_ATTEMPTS: true,
  },
};

// System messages
export const PASSWORD_MESSAGES = {
  // Error messages
  INVALID_PASSWORD: "كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
  MAX_ATTEMPTS_REACHED:
    "تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة لاحقاً.",
  ACCESS_EXPIRED: "انتهت صلاحية الوصول. يرجى إدخال كلمة المرور مرة أخرى.",

  // Success messages
  ACCESS_GRANTED: "تم منح الوصول بنجاح!",
  ACCESS_REVOKED: "تم إلغاء الوصول.",

  // Information messages
  ENTER_PASSWORD: "يرجى إدخال كلمة المرور للوصول إلى الموقع",
  WELCOME_MESSAGE: "مرحباً بك في Shiro Properties",
  SECURITY_INFO: "هذا الموقع محمي بكلمة مرور",

  // Development messages
  DEV_MODE_ACTIVE: "وضع التطوير نشط - تم تخطي حماية كلمة المرور",
};

// Helper functions
export const PasswordHelpers = {
  // Check if the mode is development mode
  isDevelopment: (): boolean => {
    return import.meta.env.DEV;
  },

  // Check if protection should be enabled
  shouldProtect: (): boolean => {
    if (
      import.meta.env.DEV &&
      !PASSWORD_CONFIG.DEVELOPMENT.ENABLE_PROTECTION_IN_DEV
    ) {
      return false;
    }
    return true;
  },

  // Generate random access code (for future use)
  generateAccessCode: (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  },

  // Check password strength
  checkPasswordStrength: (
    password: string
  ): {
    score: number;
    feedback: string[];
  } => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("يجب أن تحتوي على حروف صغيرة");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("يجب أن تحتوي على حروف كبيرة");
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("يجب أن تحتوي على أرقام");
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("يجب أن تحتوي على رموز خاصة");
    }

    return { score, feedback };
  },
};

// Export default settings
export default PASSWORD_CONFIG;
