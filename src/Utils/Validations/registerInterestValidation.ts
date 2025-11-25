import * as Yup from "yup";

/**
 * Register Interest Form Validation Schema
 *
 * SECURITY NOTE FOR BACKEND TEAM:
 * This is FRONTEND validation for UX purposes only.
 * BACKEND MUST implement the same (or stricter) validation for security.
 *
 * Required Backend Validations:
 * 1. Sanitize all inputs to prevent XSS
 * 2. Validate against SQL injection
 * 3. Implement rate limiting (max 3 submissions per hour per IP)
 * 4. Validate email and phone format on server side
 * 5. Verify project ID exists in database
 */

export const registerInterestValidationSchema = Yup.object({
  name: Yup.string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .matches(
      /^[a-zA-Z\u0600-\u06FF\s]+$/,
      "Name can only contain letters and spaces"
    )
    .test("no-dangerous-chars", "Invalid characters detected", (value) => {
      return !/[<>{}[\]\\/]/.test(value || "");
    })
    .trim(),

  email: Yup.string()
    .required("Email address is required")
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters")
    .test("no-dangerous-chars", "Invalid characters detected", (value) => {
      return !/[<>{}[\]\\/]/.test(value || "");
    })
    .trim(),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(
      /^\+?[0-9]{8,15}$/,
      "Please enter a valid phone number (8-15 digits)"
    )
    .test("valid-phone", "Phone number seems invalid", (value) => {
      // Additional check: must start with + or digit
      return /^[+0-9]/.test(value || "");
    }),

  message: Yup.string()
    .notRequired() // Message is optional for register interest
    .max(500, "Message must not exceed 500 characters")
    .test("no-html", "HTML tags are not allowed", (value) => {
      if (!value) return true; // Allow empty messages
      return !/<[^>]*>/g.test(value);
    })
    .test("no-dangerous-chars", "Invalid characters detected", (value) => {
      if (!value) return true; // Allow empty messages
      // Prevent dangerous characters but allow normal punctuation
      return !/[<>{}[\]]/.test(value);
    })
    .test("no-suspicious-patterns", "Suspicious content detected", (value) => {
      if (!value) return true; // Allow empty messages
      // Check for SQL injection patterns
      const sqlPatterns =
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|SCRIPT)\b)/gi;
      return !sqlPatterns.test(value);
    })
    .trim(),
});

export default registerInterestValidationSchema;
