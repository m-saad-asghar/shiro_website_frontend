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
import { Form } from "../../Components/Home";

type BoxFormProps = {
  item: any;
  employee?: any;
  agents?: any;
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

const BoxForm: FC<BoxFormProps> = ({ item, employee, agents }) => {
  const { t } = useTranslation();

  const imageSrc = employeeImagesUrl(
    agents?.profile_picture?.trim()
      ? agents.profile_picture
      : employee?.profile_picture?.trim()
      ? employee.profile_picture
      : "default_employee.png"
  );

  const imageAlt =
    agents?.name?.trim()
      ? agents.name
      : employee?.name?.trim()
      ? employee.name
      : "Agent";

  const shouldLinkAgent = agents?.slug?.trim() && agents?.description?.trim();

  const onClick = (name: string, number: string) => {
    if (!number) return;
    if (name === "whatsapp") {
      window.open(`https://wa.me/${number}`, "_blank", "noopener,noreferrer");
    } else {
      window.open(`tel:${number}`, "_blank", "noopener,noreferrer");
    }
  };

  const renderContact = useMemo(() => {
    return item?.agents?.map((contact: any) => (
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
    mutateAsync({
      first_name: values?.name || "",
      second_name: "",
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
      <div className="flex items-center gap-4 p-4 bg-gray-50 change_border">
        <div className="w-28 h-28 change_border overflow-hidden">
          {shouldLinkAgent ? (
            <a href={`/team/${agents.slug}`} className="block w-full h-full">
              <img
                src={imageSrc}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition rounded-full"
                alt={imageAlt}
              />
            </a>
          ) : (
            <img
              src={imageSrc}
              className="w-full h-full object-cover"
              alt={imageAlt}
            />
          )}
        </div>

        <div className="flex-1">
          <p className="text-primary text_stying text-sm">
            <span className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Name")}:
            </span>{" "}
            {agents?.name?.trim()
              ? agents.name
              : employee?.name?.trim()
              ? employee.name
              : "Agent"}
          </p>

          <p className="text-primary text_stying text-sm">
            <span className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("ORN")}:
            </span>{" "}
            {agents?.orn && agents.orn !== "0" && agents.orn !== 0
              ? agents.orn
              : employee?.orn && employee.orn !== "0" && employee.orn !== 0
              ? employee.orn
              : "-"}
          </p>

          <div className="w-full flex">
            {/* EMAIL */}
            {agents?.email && agents?.email !== "" && (
              <a
                href={`mailto:${agents?.email}?subject=${encodeURIComponent(
                  "Property Enquiry | Shiro Estate"
                )}&body=${encodeURIComponent(
                  `Hi ${agents?.name || "there"},\n\nI’m contacting you via the Shiro Estate website regarding a property I’m interested in.\n\nListing Reference: ${
                    item?.reference
                  }\n\nI would appreciate details on availability, pricing, and the next steps to proceed.\n\nThank you.`
                )}`}
                aria-label={`Email ${agents.name}`}
                title="Email"
                className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9f8151"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <polyline points="3 7 12 13 21 7" />
                </svg>
              </a>
            )}

            {/* WHATSAPP */}
            {agents?.whatsapp && agents?.whatsapp !== "" && (
              <a
                href={`https://wa.me/${String(agents.whatsapp)
                  .replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hi ${agents?.name || "there"},\n\nI’m contacting you via the Shiro Estate website regarding a property I’m interested in.\n\nListing Reference: ${
                    item?.reference
                  }\n\nI would appreciate it if you could share the current availability, pricing details, and the next steps to proceed.\n\nLooking forward to your response.\n\nThank you.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${agents.name}`}
                className="w-11 h-11 flex items-center justify-center hover:opacity-80 transition"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  className="w-15 h-15"
                  loading="lazy"
                />
              </a>
            )}

            {/* PHONE */}
            {agents?.phone && String(agents.phone).trim() !== "" && (
              <a
                href={`tel:${String(agents.phone).replace(/\s+/g, "")}`}
                aria-label={`Call ${agents.name}`}
                className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9f8151"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.06a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>
            )}
          </div>

          {/* <p className="text-primary text_stying text-sm">
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
          </p> */}
        </div>
      </div>

      {/* Contact Form */}
      {/* <div className="space-y-4">
        <h4 className="font-semibold text-primary text-xl key_information_heading">
          {t("Request Information")}
        </h4>

        <Form />
      </div> */}
    </motion.div>
  );
};

export default BoxForm;
