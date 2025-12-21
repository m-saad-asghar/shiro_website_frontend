import Icons from "@/Constants/Icons";
import { useMemo, type FC } from "react";
import FormikContainer from "../Forms/FormikContainer";
import type { FormikValues } from "formik";
import ContactAgent from "@/Services/ContactAgent";
import UseQueryPost from "@/hooks/useQueryPost";
import { useTranslation } from "react-i18next";
import ImagesUrl from "@/helpers/ImagesURL";
import { motion } from "framer-motion";
import employeeImagesUrl from "@/helpers/employeeImagesURL";
import contactAgentValidationSchema from "@/Utils/Validations/contactAgentValidation";
import ArrayInputsContact from "@/assets/Data/Home/ArrayInputsContact";

type BoxFormProps = {
  item: any;
  employee?: any;
};

interface OnSubmitProps {
  setSubmitting: (isSubmitting: boolean) => void;
  resetForm: () => void;
}

const initialValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const BoxForm: FC<BoxFormProps> = ({ item , employee}) => {
  const { t } = useTranslation();

  const onClick = (name: string, number: string) => {
    if (!number) return;
    if (name === "whatsapp") {
      window.open(`https://wa.me/${number}`, "_blank", "noopener,noreferrer");
    } else {
      window.open(`tel:${number}`, "_blank", "noopener,noreferrer");
    }
  };

  const renderContact = useMemo(() => {
    return item?.agent?.contact_inf?.map((contact: any) => (
      <button
        key={contact?.type}
        onClick={() => onClick(contact?.type, contact?.value)}
        className={`flex items-center justify-center gap-2 px-6 py-3 change_border font-semibold transition-all duration-[.4s] ${
          contact?.type === "phone"
            ? "bg-[#9f8151] text-white hover:bg-[#094834]"
            : "bg-[#094834] text-white hover:bg-[#9f8151]"
        }`}
        type="button"
      >
        <span className="flex-shrink-0">
          {contact?.type === "phone" ? (
            <Icons.LuPhone size={20} />
          ) : (
            <Icons.FaWhatsapp size={20} />
          )}
        </span>
        <span className="capitalize text-sm">{contact?.type}</span>
      </button>
    ));
  }, [item]);

  const { mutateAsync } = UseQueryPost(
    ["agentForm"],
    ContactAgent.Agent,
    undefined,
    undefined,
    { success: t("Sent successfully") }
  );

  const onSubmit = (values: FormikValues, onSubmitProps: OnSubmitProps) => {
    // Map new form fields to your existing API payload
    mutateAsync({
      // old API expects first_name / second_name
      first_name: values?.name || "",
      second_name: "",
      // old API expects phone_two + prefix + phone_one mapping
      phone_two: values?.phone || "",
      prefix: values?.phone || "",
      phone_one: values?.phone || "",
      message: values?.message || "",
      agent_id: item?.agent?.id,
      property_id: item?.id,
      email: values?.email || "",
    })
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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white change_border shadow-lg border border-gray-100 p-6 md:p-8 sticky top-6"
    >
      {/* Agent Info */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 change_border">
       <div className="w-28 h-28 change_border overflow-hidden">
  <img
    src={employeeImagesUrl(
      employee?.profile_picture?.trim()
        ? employee.profile_picture
        : "default_employee.png"
    )}
    className="w-full h-full object-cover"
    alt={employee?.name || "Agent"}
  />
</div>


        <div className="flex-1">
          <p className="text-primary text_stying text-sm">
            <span className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Name")}:
            </span>{" "}
            {employee?.name}
          </p>
          <p className="text-primary text_stying text-sm">
            <span className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Email")}:
            </span>{" "}
            {employee?.email}
          </p>
          <p className="text-primary text_stying text-sm">
            <span className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Position")}:
            </span>{" "}
            {employee?.position}
          </p>
        </div>
      </div>

      {/* Contact Buttons */}
      {Array.isArray(item?.agent?.contact_inf) && item.agent.contact_inf.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">{renderContact}</div>
      )}

      {/* Contact Form */}
      <div className="space-y-4">
        <h4 className="font-semibold text-primary text-xl key_information_heading">
          {t("Request Information")}
        </h4>

        <FormikContainer
          conClassName="space-y-4"
          onSubmit={onSubmit}
          initialValues={initialValues}
          // ✅ Use the same form input generator style as your other Form
          arrayOnInputs={ArrayInputsContact()}
          schema={contactAgentValidationSchema}
          // ✅ Keep BoxForm UI same as before (your existing button design)
          btnClass="search_btn_styling change_border rounded-[4px] font-NeueHaasGrotesk !text-[16px] md:text-[14px] capitalize flex-center cursor-pointer search_btn_styling h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold change_border transition-all duration-[.4s] flex items-center justify-center gap-2 flex-center w-fit min-h-[50px] min-w-[200px]"
          btnText={t("request information")}
        />
      </div>
    </motion.div>
  );
};

export default BoxForm;
