import { ArrayInputCallUs } from "@/assets/Data";
import FormikContainer from "@/Components/Forms/FormikContainer";
import UseQueryPost from "@/hooks/useQueryPost";
import { SubscribeServices } from "@/Services/Contact&Subscribe";
import type { FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";
import callUsValidationSchema from "@/Utils/Validations/callUsValidation";

const initialValues = {
  name: "",
  phone: "",
};

const FormBox = () => {
  const { t } = useTranslation();

  const { mutateAsync } = UseQueryPost(
    ["subscribe"],
    SubscribeServices.subscribe,
    undefined,
    undefined,
    { success: t("Sent successfully") }
  );

  const onSubmit = (values: FormikValues, onSubmitProps: any) => {
    mutateAsync(values)
      .then((_) => {
        onSubmitProps.setSubmitting(false);
        onSubmitProps.resetForm();
      })
      .catch((_) => {
        onSubmitProps.setSubmitting(false);
      });
  };

  return (
    <div className="w-full h-fit sticky top-[120px] bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <Icons.LuPhone size={28} className="text-primary" />
        </div>
        <h4 className="font-semibold text-primary text-xl">
          {t("Get a call within 55 seconds")}
        </h4>
        <p className="rounded-lg text-sm transition-all duration-200 mb-1 mt-1 text-[#9f8151] text_stying">
          <span className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
            {t("Leave your number")}
          </span>{" "}
          {t("and we will call you right away!")}
        </p>
      </div>

      {/* Form */}
      <FormikContainer
        conClassName="w-full space-y-4"
        onSubmit={onSubmit}
        initialValues={initialValues}
        arrayOnInputs={ArrayInputCallUs}
        schema={callUsValidationSchema}
        btnClass="w-full h-12 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        btnText={t("submit details")}
      />

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <Icons.IoCheckmark size={16} className="text-green-500" />
          <span>{t("Your information is secure and confidential")}</span>
        </div>
      </div>
    </div>
  );
};

export default FormBox;
