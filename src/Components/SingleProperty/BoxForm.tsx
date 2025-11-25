import Icons from "@/Constants/Icons";
// import Btn from "../Btn";
import { useMemo, type FC } from "react";
import FormikContainer from "../Forms/FormikContainer";
import type { FormikValues } from "formik";
import { ArrayInputBoxSingle } from "@/assets/Data/SingleProperty";
import ContactAgent from "@/Services/ContactAgent";
import UseQueryPost from "@/hooks/useQueryPost";
import { useTranslation } from "react-i18next";
import ImagesUrl from "@/helpers/ImagesURL";
import { motion } from "framer-motion";
import contactAgentValidationSchema from "@/Utils/Validations/contactAgentValidation";

type BoxFormProps = {
  item: any;
};

const initialValues = {
  first_name: "",
  second_name: "",
  phone_two: "",
  prefix: "",
  message: "",
};

const BoxForm: FC<BoxFormProps> = ({ item }) => {
  const { t } = useTranslation();

  const onClick = (name: string, number: string) => {
    if (name == "whatsapp") {
      window.open(`https://wa.me/${number}`);
    } else {
      window.open(`tel:${number}`);
    }
  };

  const renderContact = useMemo(() => {
    return item?.agent?.contact_inf?.map((contact: any) => (
      <button
        key={contact?.type}
        onClick={() => onClick(contact?.type, contact?.value)}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-[.4s] ${
          contact?.type == "phone"
            ? "bg-primary text-white hover:bg-[#9f8151]"
            : "bg-green-500 text-white hover:bg-[#9f8151]"
        }`}
      >
        <span className="flex-shrink-0">
          {contact?.type == "phone" ? (
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

  const onSubmit = (values: FormikValues, onSubmitProps: any) => {
    mutateAsync({
      ...values,
      agent_id: item?.agent?.id,
      property_id: item?.id,
      phone_one: values["prefix"],
    })
      .then((_) => {
        onSubmitProps.setSubmitting(false);
        onSubmitProps.resetForm();
      })
      .catch((_) => {
        onSubmitProps.setSubmitting(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 sticky top-6"
    >
      {/* Agent Info */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
        {item?.agent?.image && (
          <div className="w-16 h-16 rounded-xl overflow-hidden">
            <img
              src={ImagesUrl(item.agent.image)}
              className="w-full h-full object-cover"
              alt={item?.agent?.name || "Agent"}
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {item?.agent?.name}
          </h3>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{t("Email")}:</span>{" "}
            {item?.agent?.email}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{t("address")}:</span>{" "}
            {item?.agent?.address}
          </p>
        </div>
      </div>

      {/* Contact Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">{renderContact}</div>

      {/* Contact Form */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-gray-900">
          {t("Request Information")}
        </h4>

        <FormikContainer
          conClassName="space-y-4"
          onSubmit={onSubmit}
          initialValues={initialValues}
          arrayOnInputs={ArrayInputBoxSingle}
          schema={contactAgentValidationSchema}
          btnClass="w-full bg-primary text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#9f8151] transition-all duration-[.4s]"
          btnText={t("request information")}
        >
          <div className="text-xs text-gray-500 text-center">
            {t(
              "By clicking Submit, you agree to our Terms & Conditions and Privacy Policy."
            )}
          </div>
        </FormikContainer>
      </div>
    </motion.div>
  );
};

export default BoxForm;
