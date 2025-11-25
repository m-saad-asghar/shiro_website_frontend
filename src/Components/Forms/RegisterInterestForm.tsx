import { useTranslation } from "react-i18next";
import UseQueryPost from "@/hooks/useQueryPost";
import ContactServices from "@/Services/Contact&Subscribe/ContactServices";
import Icons from "@/Constants/Icons";
import registerInterestValidationSchema from "@/Utils/Validations/registerInterestValidation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikValues } from "formik";

interface RegisterInterestFormProps {
  projectTitle: string;
  projectId: string;
}

interface OnSubmitProps {
  setSubmitting: (isSubmitting: boolean) => void;
  resetForm: () => void;
}

const RegisterInterestForm: React.FC<RegisterInterestFormProps> = ({
  projectTitle,
}) => {
  const { t } = useTranslation();

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    message: `I am interested in the project: ${projectTitle}`,
  };

  const { mutateAsync } = UseQueryPost(
    ["register-interest"],
    ContactServices.contact,
    undefined,
    undefined,
    { success: t("Interest registered successfully") }
  );

  const onSubmit = (values: FormikValues, onSubmitProps: OnSubmitProps) => {
    mutateAsync(values)
      .then(() => {
        onSubmitProps.setSubmitting(false);
        onSubmitProps.resetForm();
      })
      .catch(() => {
        onSubmitProps.setSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={registerInterestValidationSchema}
    >
      {(formik) => (
        <Form className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("Full Name")} *
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              placeholder={t("Enter your full name")}
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("Email Address")} *
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              placeholder={t("Enter your email")}
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("Phone Number")} *
            </label>
            <Field
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              placeholder={t("Enter your phone number")}
            />
            <ErrorMessage
              name="phone"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("Message")}
            </label>
            <Field
              as="textarea"
              id="message"
              name="message"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
              placeholder={t("Your message")}
            />
            <ErrorMessage
              name="message"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            className="w-full bg-primary text-white font-semibold py-4 px-6 rounded-xl hover:bg-[#9f8151] transition-all duration-[.4s] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {formik.isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {t("Sending...")}
              </>
            ) : (
              <>
                <Icons.FaArrowUpRightFromSquare className="w-5 h-5" />
                {t("Register Interest")}
              </>
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterInterestForm;
