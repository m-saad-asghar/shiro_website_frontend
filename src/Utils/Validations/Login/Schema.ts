import * as Yup from "yup";

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("البريد الإلكتروني غير صحيح")
    .required("البريد الإلكتروني مطلوب"),
  password: Yup.string()
    .required("كلمة المرور مطلوبة")
    .min(1, "كلمة المرور مطلوبة"),
});

export default LoginSchema;
