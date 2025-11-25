import * as Yup from "yup";

/**
 * Contact Agent Form Validation Schema
 *
 * SECURITY NOTE FOR BACKEND TEAM:
 * This is FRONTEND validation for UX purposes only.
 * BACKEND MUST implement the same (or stricter) validation for security.
 *
 * Required Backend Validations:
 * 1. Sanitize all inputs to prevent XSS
 * 2. Validate against SQL injection
 * 3. Implement rate limiting (max 5 submissions per hour per IP)
 * 4. Verify agent_id and property_id exist in database
 * 5. Validate phone format on server side
 */

export const contactAgentValidationSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .matches(
      /^[a-zA-Z\u0600-\u06FF\s]+$/,
      "First name can only contain letters and spaces"
    )
    .test("no-dangerous-chars", "Invalid characters detected", (value) => {
      return !/[<>{}[\]\\\/]/.test(value || "");
    })
    .trim(),

  second_name: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .matches(
      /^[a-zA-Z\u0600-\u06FF\s]+$/,
      "Last name can only contain letters and spaces"
    )
    .test("no-dangerous-chars", "Invalid characters detected", (value) => {
      return !/[<>{}[\]\\\/]/.test(value || "");
    })
    .trim(),

  prefix: Yup.string()
    .required("Phone number is required")
    .matches(
      /^\+?[0-9]{8,15}$/,
      "Please enter a valid phone number (8-15 digits)"
    )
    .test("valid-phone", "Phone number seems invalid", (value) => {
      // Additional check: must start with + or digit
      return /^[+0-9]/.test(value || "");
    }),

  phone_two: Yup.string()
    .notRequired()
    .matches(
      /^(\+?[0-9]{8,15})?$/,
      "Please enter a valid phone number (8-15 digits)"
    ),

  message: Yup.string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must not exceed 500 characters")
    .test("no-html", "HTML tags are not allowed", (value) => {
      return !/<[^>]*>/g.test(value || "");
    })
    .test("no-dangerous-chars", "Invalid characters detected", (value) => {
      // Prevent dangerous characters but allow normal punctuation
      return !/[<>{}[\]]/.test(value || "");
    })
    .test("no-suspicious-patterns", "Suspicious content detected", (value) => {
      // Check for SQL injection patterns
      const sqlPatterns =
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|SCRIPT)\b)/gi;
      return !sqlPatterns.test(value || "");
    })
    .trim(),
});

export default contactAgentValidationSchema;
