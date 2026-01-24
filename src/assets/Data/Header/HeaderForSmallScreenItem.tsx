import { TypesContext } from "@/Context/TypesContext";
import useQueryGet from "@/hooks/useQueryGet";
import DevelopersServices from "@/Services/DevelopersServices";
import type { HeaderItemType } from "@/Types";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

const HeaderForSmallScreenItem = () => {
  const { t } = useTranslation();

  // keeping these since you already had them (even if not used in Data right now)
  useQueryGet(["filterDeveloper"], DevelopersServices.developer);
  useContext(TypesContext);

  const Data: HeaderItemType[] = useMemo(
    () => [
      { id: 1, li: t("Buy"), link: "/buy/properties-for-sale" },
      { id: 2, li: t("Rent"), link: "/rent/properties-for-rent" },
      { id: 3, li: t("Developers"), link: "/developers" },
      { id: 3, li: t("Projects"), link: "/projects" },
      { id: 4, li: t("Areas"), link: "/areas" },
      { id: 5, li: t("List With Us"), link: "/list-your-property" },
      { id: 6, li: t("About Shiro"), link: "/about" },
      { id: 7, li: t("Services"), link: "/property-services" },
      { id: 8, li: t("Meet The Team"), link: "/team" },
      { id: 9, li: t("Contact Us"), link: "/contact" },

      // ✅ Career (external new tab)
      {
        id: 10,
        li: t("Career"),
        link: "https://shiro.estate/career",
        external: true,
        target: "_blank",
      },
    ],
    [t]
  );

  return Data;
};

export default HeaderForSmallScreenItem;
