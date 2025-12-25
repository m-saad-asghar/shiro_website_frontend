import { useMemo } from "react";
import type { FooterItemType } from "../../../Types";
import { useTranslation } from "react-i18next";
import useQueryGet from "@/hooks/useQueryGet";
import PropertiesServices from "@/Services/PropertiesServices";
import { getPropertyTypeSlug } from "@/helpers/propertyTypeHelper";

const FooterItem = () => {
  const { t } = useTranslation();
  const { data: filter } = useQueryGet(["filter"], PropertiesServices.filters);

  const fallbackPropertyTypes = useMemo(
    () => [
      { id: 1, name: "Villa" },
      { id: 2, name: "Apartment" },
      { id: 3, name: "Townhouse" },
      { id: 4, name: "Penthouse" },
      { id: 5, name: "Studio" },
      { id: 6, name: "Duplex" },
    ],
    []
  );

  const propertyTypes = useMemo(
    () => filter?.property_types || fallbackPropertyTypes,
    [filter, fallbackPropertyTypes]
  );

  // ✅ Separated sections
  const buySection: FooterItemType = useMemo(
    () => ({
      id: 1,
      title: t("Popular Searches"),
      option: [
        { id: 1, item: t("Properties for Sale"), link: "/buy/properties-for-sale" },
        { id: 2, item: t("Apartment for Sale"), link: "/buy/properties-for-sale?property_type=apartment" },
        { id: 3, item: t("Townhouse for Sale"), link: "/buy/properties-for-sale?property_type=townhouse" },
        { id: 4, item: t("Villa for Sale"), link: "/buy/properties-for-sale?property_type=villa" },
        { id: 5, item: t("Off Plan Properties"), link: "/new-projects" },
        // ...(propertyTypes?.map((pt: any, index: number) => ({
        //   id: index + 2,
        //   item: pt.name,
        //   link: `/buy/properties-for-sale/${getPropertyTypeSlug(pt.name)}`,
        // })) || []),
      ],
    }),
    [propertyTypes, t]
  );

  const offPlanSection: FooterItemType = useMemo(
    () => ({
      id: 2,
      title: "",
      option: [
        { id: 1, item: t("Off Plan Apartment"), link: "/new-projects?property_type=apartment" },
        { id: 2, item: t("Off Plan Townhouse"), link: "/new-projects?property_type=townhouse" },
        { id: 3, item: t("Off Plan Villa"), link: "/new-projects?property_type=villa" },
        { id: 4, item: t("Properties for Rent"), link: "/rent/properties-for-rent" },
        { id: 5, item: t("Apartment for Rent"), link: "/rent/properties-for-rent?property_type=apartment" },
       
        // { id: 1, item: t("New Projects"), link: "/new-projects" },
        // ...(propertyTypes?.map((pt: any, index: number) => ({
        //   id: index + 2,
        //   item: pt.name,
        //   link: "/new-projects",
        //   property_type_id: pt.id,
        // })) || []),
      ],
    }),
    [propertyTypes, t]
  );

  const rentSection: FooterItemType = useMemo(
    () => ({
      id: 3,
      title: "",
      option: [
         
        { id: 1, item: t("Townhouse for Rent"), link: "/rent/properties-for-rent?property_type=townhouse" },
        { id: 2, item: t("Villa for Rent"), link: "/rent/properties-for-rent?property_type=villa" },
        { id: 3, item: t("Developers"), link: "/developers" },
        { id: 4, item: t("List With Us"), link: "/list-your-property" },
        { id: 5, item: t("Meet The Team"), link: "/team" },
        // { id: 1, item: t("Properties to Rent"), link: "/rent/properties-for-rent" },
        // ...(propertyTypes?.map((pt: any, index: number) => ({
        //   id: index + 2,
        //   item: pt.name,
        //   link: `/rent/properties-for-rent/${getPropertyTypeSlug(pt.name)}`,
        // })) || []),
      ],
    }),
    [propertyTypes, t]
  );

  const supportSection: FooterItemType = useMemo(
    () => ({
      id: 4,
      title: "",
      option: [
        { id: 1, item: t("Services"), link: "/property-services" },
        { id: 2, item: t("About Us"), link: "/about" },
        { id: 3, item: t("Contact Us"), link: "/contact" },
      ],
    }),
    [t]
  );

  // const aboutSection: FooterItemType = useMemo(
  //   () => ({
  //     id: 5,
  //     title: t("About"),
  //     option: [
  //       { id: 1, item: t("About Us"), link: "/about" },
  //       { id: 2, item: t("Meet The Team"), link: "/team" },
  //     ],
  //   }),
  //   [t]
  // );

  // ✅ Final combined array (still returned same as before)
  const data: FooterItemType[] = useMemo(
    () => [buySection, offPlanSection, rentSection, supportSection],
    [buySection, offPlanSection, rentSection, supportSection]
  );

  return data;
};

export default FooterItem;
