import ArrayInputsContact from "@/assets/Data/Home/ArrayInputsContact";
import FormikContainer from "@/Components/Forms/FormikContainer";
import UseQueryPost from "@/hooks/useQueryPost";
import { ContactServices } from "@/Services/Contact&Subscribe";
import type { FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Icons from "@/Constants/Icons";
import contactFormValidationSchema from "@/Utils/Validations/contactFormValidation";
import { Form } from "../Components/Home";

interface ContactFormProps {
  title?: string;
  message?: string;
}

interface OnSubmitProps {
  setSubmitting: (isSubmitting: boolean) => void;
  resetForm: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  title = "Contact Us",
  message = "Hello,\nI would like to get in touch with you.",
}) => {
  const { t } = useTranslation();
  const { mutateAsync } = UseQueryPost(
    ["subscribe"],
    ContactServices.contact,
    undefined,
    undefined,
    { success: t("Sent successfully") }
  );

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    message: message,
    language: "",
  };

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full bg-white change_border shadow-xl border border-gray-100 p-8"
    >
      {/* Header */}
      {/* <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icons.IoMailOutline size={24} className="text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">
          {t("Get in touch with our team for professional assistance")}
        </p>
      </div> */}

      {/* Form */}
      <div className="space-y-6">
        <Form/>
        {/* <FormikContainer
          conClassName="w-full space-y-6"
          onSubmit={onSubmit}
          initialValues={initialValues}
          arrayOnInputs={ArrayInputsContact()}
          schema={contactFormValidationSchema}
          btnClass="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          btnText={t("Submit Details")}
        /> */}
      </div>

      {/* Additional Info */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 text-sm text-[#9f8151]">
          <Icons.IoShieldCheckmarkOutline size={16} />
          <span>{t("Your information is secure and confidential")}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactForm;
