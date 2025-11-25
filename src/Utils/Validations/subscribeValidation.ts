import * as Yup from "yup";

/**
 * Subscribe Form Validation Schema
 *
 * SECURITY NOTE FOR BACKEND TEAM:
 * This is FRONTEND validation for UX purposes only.
 * BACKEND MUST implement the same (or stricter) validation for security.
 *
 * Required Backend Validations:
 * 1. Sanitize all inputs to prevent XSS
 * 2. Validate against SQL injection
 * 3. Implement rate limiting (max 10 subscriptions per hour per IP)
 * 4. Validate email format on server side
 * 5. Check for spam patterns and duplicate emails
 */

export const subscribeValidationSchema = Yup.object({
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

  agreeToTerms: Yup.boolean()
    .oneOf(
      [true],
      "You must agree to the Terms & Conditions and Privacy Policy"
    )
    .required("You must agree to the Terms & Conditions and Privacy Policy"),
});

export default subscribeValidationSchema;
