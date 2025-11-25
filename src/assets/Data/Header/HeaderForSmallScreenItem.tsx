import { TypesContext } from "@/Context/TypesContext";
import useQueryGet from "@/hooks/useQueryGet";
import DevelopersServices from "@/Services/DevelopersServices";
import type { HeaderItemType } from "@/Types";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

const HeaderForSmallScreenItem = () => {
  const { t } = useTranslation();

  const { data: filterDeveloper } = useQueryGet(
    ["filterDeveloper"],
    DevelopersServices.developer
  );
  const { data } = useContext(TypesContext);
  const filteredData = (name: string) => {
    const data1 = data?.types?.filter((item) => item.name == name);
    return {
      ...data1,
    };
  };
  const Data: HeaderItemType[] = useMemo(
    () => [
      {
        id: 1,
        li: t("Buy"),
        link: `/buy/properties-for-sale`,
      },
      {
        id: 2,
        li: t("Rent"),
        link: `/rent/properties-for-rent`,
      },
      {
        id: 3,
        li: t("Projects"),
        link: `/new-projects`,
      },
      {
        id: 4,
        li: t("Developers"),
        link: `/developers`,
      },
      {
        id: 5,
        li: t("Areas"),
        link: "/area-guides",
      },
      {
        id: 6,
        li: t("About Us"),
        link: "/about",
      },
      {
        id: 7,
        li: t("Services"),
        link: "/property-services",
      },
      {
        id: 8,
        li: t("Meet The Team"),
        link: "/team",
      },
      {
        id: 9,
        li: t("Blog"),
        link: "/blog",
      },
      {
        id: 10,
        li: t("Testimonials"),
        link: "/reviews",
      },
      {
        id: 11,
        li: t("Contact Us"),
        link: "/contact",
      },
    ],
    [filteredData, filterDeveloper, t]
  );
  return Data;
};

export default HeaderForSmallScreenItem;
