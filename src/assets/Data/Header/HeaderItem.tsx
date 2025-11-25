import { TypesContext } from "@/Context/TypesContext";
import useQueryGet from "@/hooks/useQueryGet";
import DevelopersServices from "@/Services/DevelopersServices";
import PropertiesServices from "@/Services/PropertiesServices";

import type { HeaderItemType } from "@/Types";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import aboutUsIcon from "@/assets/icons/aboutUs.svg";
import servicesIcon from "@/assets/icons/services.svg";
import listPropertyIcon from "@/assets/icons/listProperty.svg";
import faqsIcon from "@/assets/icons/faqs.svg";
import meetTheTeamIcon from "@/assets/icons/meetTheTeam.svg";
import testimonialIcon from "@/assets/icons/testimonial.svg";
import contactUsIcon from "@/assets/icons/contactUs.svg";
import { getPropertyTypeSlug } from "@/helpers/propertyTypeHelper";

const HeaderItem = () => {
  // Translation
  const { t } = useTranslation();

  const { data: filterDeveloper } = useQueryGet(
    ["filterDeveloper"],
    DevelopersServices.developer
  );

  const { data: filter } = useQueryGet(["filter"], PropertiesServices.filters);

  const { data } = useContext(TypesContext);
  const filteredData = (name: string) => {
    const data1 = data?.types?.filter((item) => item.name == name);
    return {
      ...data1,
    };
  };
  const renderDeveloper = filterDeveloper?.developers?.map(
    (item: { id: number; name: string }) => {
      return {
        id: item.id,
        item: item.name,
      };
    }
  );

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
  const Data: HeaderItemType[] = useMemo(
    () => [
      {
        id: 1,
        li: t("Buy"),
        link: `/buy/properties-for-sale`,
        content: {
          option: [
            {
              id: 1,
              item: t("Properties for Sale"),
              link: `/buy/properties-for-sale`,
            },
            // Add property types for Buy - using English slugs in URLs
            ...(propertyTypes?.map(
              (propertyType: { id: number; name: string }, index: number) => ({
                id: index + 2,
                item: propertyType.name, // Display name (can be Arabic or English)
                link: `/buy/properties-for-sale/${getPropertyTypeSlug(
                  propertyType.name
                )}`, // Always English slug
              })
            ) || []),
          ],
        },
      },
      {
        id: 2,
        li: t("Rent"),
        link: `/rent/properties-for-rent`,
        content: {
          option: [
            {
              id: 1,
              item: t("Properties to Rent"),
              link: `/rent/properties-for-rent`,
            },
            // Add property types for Rent - using English slugs in URLs
            ...(propertyTypes?.map(
              (propertyType: { id: number; name: string }, index: number) => ({
                id: index + 2,
                item: propertyType.name, // Display name (can be Arabic or English)
                link: `/rent/properties-for-rent/${getPropertyTypeSlug(
                  propertyType.name
                )}`, // Always English slug
              })
            ) || []),
          ],
        },
      },
      {
        id: 3,
        li: t("Projects"),
        link: `/new-projects`,
        content: {
          option: [
            {
              id: 1,
              item: t("New Projects"),
              link: `/new-projects`,
            },
            // Add property types for Projects
            ...(propertyTypes?.map(
              (propertyType: { id: number; name: string }, index: number) => ({
                id: index + 2,
                item: propertyType.name,
                link: `/new-projects`,
                property_type_id: propertyType.id,
              })
            ) || []),
          ],
        },
      },
      {
        id: 4,
        li: t("Developers"),
        link: `/developers`,
        content: {
          option: renderDeveloper,
        },
      },
      {
        id: 5,
        li: t("Areas"),
        link: "/area-guides",
        content: {
          option: [
            {
              id: 1,
              item: t("Dubai Creek Harbour"),
            },
            {
              id: 2,
              item: t("Business Bay"),
            },
            {
              id: 3,
              item: t("Dubai Marina"),
            },
            {
              id: 4,
              item: t("Palm Jumeirah"),
            },
            {
              id: 5,
              item: t("Downtown Dubai"),
            },
            {
              id: 6,
              item: t("Jumeirah Village Circle"),
            },
            {
              id: 7,
              item: t("EMAAR Beachfront"),
            },
            {
              id: 8,
              item: t("Sobha Hartland"),
            },
            {
              id: 9,
              item: t("Jumeirah"),
            },
            {
              id: 10,
              item: t("Meydan"),
            },
            {
              id: 11,
              item: t("Expo City"),
            },
            {
              id: 12,
              item: t("All Areas in Dubai"),
            },
          ],
        },
      },
      {
        id: 6,
        li: t("Blog"),
        link: "/blog",
      },
      {
        id: 7,
        li: t("More Options"),
        link: "/about",
        content: {
          title: t("More Options"),
          option: [
            {
              id: 1,
              icon: aboutUsIcon,
              item: t("About Us"),
              link: "/about",
            },
            {
              id: 2,
              icon: servicesIcon,
              item: t("Services"),
              link: "/property-services",
            },
            {
              id: 3,
              icon: listPropertyIcon,
              item: t("List Your Property"),
              link: "/list-your-property",
            },
            {
              id: 4,
              icon: faqsIcon,
              item: t("FAQs"),
              link: "/faqs",
            },
            {
              id: 5,
              icon: meetTheTeamIcon,
              item: t("Meet The Team"),
              link: "/team",
            },
            {
              id: 6,
              icon: testimonialIcon,
              item: t("Testimonials"),
              link: "/reviews",
            },
            {
              id: 7,
              icon: contactUsIcon,
              item: t("Contact Us"),
              link: "/contact",
            },
          ],
        },
      },
    ],
    [filteredData, filterDeveloper, propertyTypes, filter, t]
  );
  return Data;
};

export default HeaderItem;
