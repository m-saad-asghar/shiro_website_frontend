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
        icons: <Icons.FaWhatsapp color="#67C15E" size={25} />,
        title: t("WhatsApp"),
        desc: contact?.contact_info?.whatsapp,
      },
      {
        id: 2,
        icons: <Icons.LuPhone color="#35373C" size={25} />,
        title: t("Phone"),
        desc: contact?.contact_info?.phone,
      },
      {
        id: 3,
        icons: <Icons.LuPhone color="#35373C" size={25} />,
        title: t("secondary Phone"),
        desc: contact?.contact_info?.secondary_phone,
      },
             {
         id: 4,
         icons: <Icons.MdOutlineEmail color="#35373C" size={25} />,
         title: t("Email"),
         desc: contact?.contact_info?.email,
       },
       {
         id: 5,
         icons: <Icons.CiLocationOn color="#35373C" size={25} />,
         title: t("Location"),
         desc: contact?.contact_info?.address || "Dubai, UAE",
       },
    ],
    [contact, t]
  );
  return data;
};

export default DataSocialMedia;
