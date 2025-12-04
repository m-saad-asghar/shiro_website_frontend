import { useMemo } from "react";
import Icons from "../../../Constants/Icons";
import useQueryGet from "@/hooks/useQueryGet";
import StaticServices from "@/Services/StaticServices";
import { useTranslation } from "react-i18next";

const DataSocialMedia = () => {
  const { t } = useTranslation();
  const { data: contact } = useQueryGet(["contact"], StaticServices.contact);
  const data = useMemo(
    () => [
      {
        id: 1,
        icons: (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
    alt="WhatsApp"
    width={50}
    height={50}
  />
),

        title: t("WhatsApp"),
        desc: contact?.contact_info?.whatsapp,
      },
    {
  id: 2,
  icons: (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9f8151"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 11.19 19 19.5 19.5 0 0 1 3.16 11 19.86 19.86 0 0 1 1 4.18A2 2 0 0 1 3 2h3a2 2 0 0 1 2 1.72c.12.81.34 1.6.63 2.35a2 2 0 0 1-.45 2.11L6.5 9a16 16 0 0 0 8.5 8.5l.82-1.68a2 2 0 0 1 2.11-.45c.75.29 1.54.51 2.35.63A2 2 0 0 1 22 16.92Z" />
  </svg>
),


  title: t("Phone"),
  desc: contact?.contact_info?.phone,
},
      // {
      //   id: 3,
      //   icons: <Icons.LuPhone color="#35373C" size={25} />,
      //   title: t("secondary Phone"),
      //   desc: contact?.contact_info?.secondary_phone,
      // },
             {
         id: 4,
        icons: (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="29"
    height="29"
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
),

         title: t("Email"),
         desc: contact?.contact_info?.email,
       },
       {
  id: 5,
  icons: (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
  >
    <path
      d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"
      fill="none"
      stroke="#9f8151"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="10"
      r="3"
      fill="none"
      stroke="#9f8151"
      strokeWidth="2"
    />
  </svg>
),

  title: t("Location"),
  desc: "Boulevard Plaza Tower 1 - Downtown - Office No. 2101 - 21st Floor - Dubai",
}

    ],
    [contact, t]
  );
  return data;
};

export default DataSocialMedia;
