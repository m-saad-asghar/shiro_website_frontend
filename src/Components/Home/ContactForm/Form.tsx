import ArrayInputsContact from "@/assets/Data/Home/ArrayInputsContact";
import FormikContainer from "@/Components/Forms/FormikContainer";
import UseQueryPost from "@/hooks/useQueryPost";
import { ContactServices } from "@/Services/Contact&Subscribe";
import type { FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import contactFormValidationSchema from "@/Utils/Validations/contactFormValidation";

interface OnSubmitProps {
  setSubmitting: (isSubmitting: boolean) => void;
  resetForm: () => void;
}

const initialValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  language: "",
};

const Form = () => {
  const { t } = useTranslation();
  const { mutateAsync } = UseQueryPost(
    ["subscribe"],
    ContactServices.contact,
    undefined,
    undefined,
    { success: t("Sent successfully") }
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
    <div className="w-full space-y-6">
      <FormikContainer
        conClassName="w-full space-y-6"
        onSubmit={onSubmit}
        initialValues={initialValues}
        arrayOnInputs={ArrayInputsContact()}
        schema={contactFormValidationSchema}
        btnClass="w-full bg-[#094834] hover:bg-[#073a2a] text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
        btnText={t("Submit")}
      />
    </div>
  );
};

export default Form;
