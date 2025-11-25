/**
 * نظام التحقق القوي من كلمة المرور
 * يتماشى مع متطلبات الأمان الجديدة للـ API
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: {
    score: number; // 0-5
    level: "weak" | "medium" | "strong";
    color: string;
    percentage: number;
  };
}

export interface PasswordRequirement {
  test: RegExp;
  label: string;
  labelAr: string;
  passed: boolean;
}

/**
 * القواعد الجديدة لكلمة المرور (متطلبات API الجديد)
 */
export const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
} as const;

/**
 * التحقق من صحة كلمة المرور حسب القواعد الجديدة
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  const requirements: PasswordRequirement[] = [
    {
      test: /.{8,}/,
      label: "At least 8 characters",
      labelAr: "8 أحرف على الأقل",
      passed: false,
    },
    {
      test: /[A-Z]/,
      label: "One uppercase letter",
      labelAr: "حرف كبير واحد على الأقل",
      passed: false,
    },
    {
      test: /[a-z]/,
      label: "One lowercase letter",
      labelAr: "حرف صغير واحد على الأقل",
      passed: false,
    },
    {
      test: /[0-9]/,
      label: "One number",
      labelAr: "رقم واحد على الأقل",
      passed: false,
    },
    {
      test: /[!@#$%^&*(),.?":{}|<>]/,
      label: "One special character",
      labelAr: "رمز خاص واحد على الأقل",
      passed: false,
    },
  ];

  // Check each requirement
  requirements.forEach((req) => {
    req.passed = req.test.test(password);
    if (!req.passed) {
      errors.push(req.labelAr);
    }
  });

  // Calculate strength
  const passedCount = requirements.filter((req) => req.passed).length;
  const strength = calculatePasswordStrength(passedCount);

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * حساب قوة كلمة المرور
 */
function calculatePasswordStrength(passedCount: number) {
  const score = passedCount;
  const percentage = (score / 5) * 100;

  let level: "weak" | "medium" | "strong";
  let color: string;

  if (score < 3) {
    level = "weak";
    color = "#ef4444"; // red-500
  } else if (score < 5) {
    level = "medium";
    color = "#f59e0b"; // amber-500
  } else {
    level = "strong";
    color = "#10b981"; // emerald-500
  }

  return {
    score,
    level,
    color,
    percentage,
  };
}

/**
 * دالة مساعدة للحصول على متطلبات كلمة المرور مع حالة كل متطلب
 */
export function getPasswordRequirements(
  password: string
): PasswordRequirement[] {
  const requirements: PasswordRequirement[] = [
    {
      test: /.{8,}/,
      label: "At least 8 characters",
      labelAr: "8 أحرف على الأقل",
      passed: false,
    },
    {
      test: /[A-Z]/,
      label: "One uppercase letter",
      labelAr: "حرف كبير واحد على الأقل",
      passed: false,
    },
    {
      test: /[a-z]/,
      label: "One lowercase letter",
      labelAr: "حرف صغير واحد على الأقل",
      passed: false,
    },
    {
      test: /[0-9]/,
      label: "One number",
      labelAr: "رقم واحد على الأقل",
      passed: false,
    },
    {
      test: /[!@#$%^&*(),.?":{}|<>]/,
      label: "One special character",
      labelAr: "رمز خاص واحد على الأقل",
      passed: false,
    },
  ];

  requirements.forEach((req) => {
    req.passed = req.test.test(password);
  });

  return requirements;
}

/**
 * دالة للتحقق السريع من قوة كلمة المرور
 */
export function checkPasswordStrength(password: string) {
  const validation = validatePassword(password);
  return validation.strength;
}

/**
 * رسائل الخطأ المترجمة
 */
export const PASSWORD_ERROR_MESSAGES = {
  en: {
    tooShort: "Password must be at least 8 characters long",
    noUppercase: "Password must contain at least one uppercase letter",
    noLowercase: "Password must contain at least one lowercase letter",
    noNumbers: "Password must contain at least one number",
    noSymbols:
      "Password must contain at least one special character (!@#$%^&*)",
    weak: "Password is too weak. Please meet all requirements.",
    mismatch: "Passwords do not match",
  },
  ar: {
    tooShort: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
    noUppercase: "يجب أن تحتوي على حرف كبير واحد على الأقل",
    noLowercase: "يجب أن تحتوي على حرف صغير واحد على الأقل",
    noNumbers: "يجب أن تحتوي على رقم واحد على الأقل",
    noSymbols: "يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)",
    weak: "كلمة المرور ضعيفة جداً. يرجى استيفاء جميع المتطلبات.",
    mismatch: "كلمتا المرور غير متطابقتان",
  },
} as const;

/**
 * دالة لإنشاء schema validation لـ Yup
 */
export function createPasswordYupSchema() {
  const Yup = require("yup");

  return Yup.string()
    .required("كلمة المرور مطلوبة")
    .test(
      "password-strength",
      "كلمة المرور لا تلبي متطلبات الأمان",
      function (this: any, value: string) {
        if (!value) return false;

        const validation = validatePassword(value);

        if (!validation.isValid) {
          return this.createError({
            message: validation.errors.join("، "),
          });
        }

        return true;
      }
    );
}
