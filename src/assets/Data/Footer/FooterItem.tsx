import { useContext, useMemo } from "react";
import type { FooterItemType } from "../../../Types";
import { TypesContext } from "@/Context/TypesContext";
import { useTranslation } from "react-i18next";
import useQueryGet from "@/hooks/useQueryGet";
import PropertiesServices from "@/Services/PropertiesServices";
import { getPropertyTypeSlug } from "@/helpers/propertyTypeHelper";

const FooterItem = () => {
  const { t } = useTranslation();
  const { data: dataTypes } = useContext(TypesContext);
  const { data: filter } = useQueryGet(["filter"], PropertiesServices.filters);

  const data: FooterItemType[] = useMemo(() => {
    // Fallback property types if API data is not available
    const fallbackPropertyTypes = [
      { id: 1, name: "Villa" },
      { id: 2, name: "Apartment" },
      { id: 3, name: "Townhouse" },
      { id: 4, name: "Penthouse" },
      { id: 5, name: "Studio" },
      { id: 6, name: "Duplex" },
    ];

    const propertyTypes = filter?.property_types || fallbackPropertyTypes;

    return [
      {
        id: 1,
        title: t("Buy"),
        option: [
          {
            id: 1,
            item: t("Properties for Sale"),
            link: `/buy/properties-for-sale`,
          },
          // Add property types for Buy - using English slugs in URLs
          ...(propertyTypes?.map((propertyType: any, index: number) => ({
            id: index + 2,
            item: propertyType.name, // Display name (can be Arabic or English)
            link: `/buy/properties-for-sale/${getPropertyTypeSlug(
              propertyType.name
            )}`, // Always English slug
          })) || []),
        ],
      },

      {
        id: 2,
        title: t("Off plan"),
        option: [
          {
            id: 1,
            item: t("New Projects"),
            link: `/new-projects`,
          },
          // Add property types for Projects
          // Note: Projects use state for property_type_id, so link remains the same
          ...(propertyTypes?.map((propertyType: any, index: number) => ({
            id: index + 2,
            item: propertyType.name, // Display name (can be Arabic or English)
            link: `/new-projects`,
            property_type_id: propertyType.id,
          })) || []),
        ],
      },
      {
        id: 3,
        title: t("Rent"),
        option: [
          {
            id: 1,
            item: t("Properties to Rent"),
            link: `/rent/properties-for-rent`,
          },
          // Add property types for Rent - using English slugs in URLs
          ...(propertyTypes?.map((propertyType: any, index: number) => ({
            id: index + 2,
            item: propertyType.name, // Display name (can be Arabic or English)
            link: `/rent/properties-for-rent/${getPropertyTypeSlug(
              propertyType.name
            )}`, // Always English slug
          })) || []),
        ],
      },
      {
        id: 4,
        title: t("Support"),
        option: [
          {
            id: 1,
            item: t("FAQs"),
            link: "/faqs",
          },
          {
            id: 2,
            item: t("List Your Property"),
            link: "/list-your-property",
          },
          {
            id: 3,
            item: t("Testimonials"),
            link: "/reviews",
          },
          {
            id: 4,
            item: t("Contact Us"),
            link: "/contact",
          },
        ],
      },
      {
        id: 5,
        title: t("About"),
        option: [
          {
            id: 1,
            item: t("About Us"),
            link: "/about",
          },
          {
            id: 2,
            item: t("Meet The Team"),
            link: "/team",
          },
        ],
      },
    ];
  }, [dataTypes, filter, t]);

  return data;
};

export default FooterItem;
