import * as Yup from "yup";
import { validatePassword } from "../passwordValidation";

// Update registration schema with new security requirements
const SignUpSchema = Yup.object({
  name: Yup.string()
    .required("الاسم مطلوب")
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم لا يجب أن يتجاوز 50 حرف")
    .matches(/^[a-zA-Z\u0600-\u06FF\s]+$/, "الاسم يجب أن يحتوي على أحرف فقط")
    .trim(),

  email: Yup.string()
    .required("البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح")
    .max(100, "البريد الإلكتروني لا يجب أن يتجاوز 100 حرف")
    .trim(),

  password: Yup.string()
    .required("كلمة المرور مطلوبة")
    .test(
      "password-strength",
      "كلمة المرور لا تلبي متطلبات الأمان",
      function (value) {
        if (!value) return false;

        const validation = validatePassword(value);

        if (!validation.isValid) {
          return this.createError({
            message: validation.errors.join("، "),
          });
        }

        return true;
      }
    ),

  password_confirmation: Yup.string()
    .required("تأكيد كلمة المرور مطلوب")
    .oneOf([Yup.ref("password")], "كلمتا المرور غير متطابقتان"),

  birthday: Yup.date()
    .required("تاريخ الميلاد مطلوب")
    .max(
      new Date(Date.now() - 16 * 365 * 24 * 60 * 60 * 1000),
      "يجب أن تكون 16 سنة أو أكثر"
    )
    .min(
      new Date(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000),
      "التاريخ غير صحيح"
    ),

  phone: Yup.string()
    .required("رقم الهاتف مطلوب")
    .matches(/^\+?[0-9]{8,15}$/, "رقم الهاتف غير صحيح (8-15 رقم)"),

  gender: Yup.string()
    .notRequired()
    .oneOf(["male", "female", "other"], "الجنس غير صحيح"),

  address: Yup.string()
    .notRequired()
    .max(200, "العنوان لا يجب أن يتجاوز 200 حرف")
    .trim(),

  terms: Yup.boolean()
    .required("يجب الموافقة على الشروط والأحكام")
    .oneOf([true], "يجب الموافقة على الشروط والأحكام"),
});

export default SignUpSchema;
