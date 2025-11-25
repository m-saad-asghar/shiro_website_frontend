import * as Yup from "yup";

/**
 * Call Us Form Validation Schema
 *
 * SECURITY NOTE FOR BACKEND TEAM:
 * This is FRONTEND validation for UX purposes only.
 * BACKEND MUST implement the same (or stricter) validation for security.
 *
 * Required Backend Validations:
 * 1. Sanitize all inputs to prevent XSS
 * 2. Validate against SQL injection
 * 3. Implement rate limiting (max 10 submissions per hour per IP)
 * 4. Validate phone format on server side
 * 5. Check for spam patterns
 */

export const callUsValidationSchema = Yup.object({
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
});

export default callUsValidationSchema;
