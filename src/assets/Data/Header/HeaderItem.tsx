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

const HeaderItem = () => {
  const { t } = useTranslation();

  const { data: filterDeveloper } = useQueryGet(
    ["filterDeveloper"],
    DevelopersServices.developer
  );

  const { data: filter } = useQueryGet(["filter"], PropertiesServices.filters);

  useContext(TypesContext); // still used elsewhere, keep context hook so TS doesn’t complain

  const renderDeveloper =
    filterDeveloper?.developers?.map(
      (item: { id: number; name: string }) => ({
        id: item.id,
        item: item.name,
      })
    ) || [];

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
      // ✅ BUY – NO DROPDOWN
      {
        id: 1,
        li: t("Buy"),
        link: "/buy/properties-for-sale",
      },

      // ✅ RENT – NO DROPDOWN
      {
        id: 2,
        li: t("Rent"),
        link: "/rent/properties-for-rent",
      },

      // PROJECTS – keeps dropdown
      // {
      //   id: 3,
      //   li: t("Projects"),
      //   link: "/new-projects",
      //   content: {
      //     option: [
      //       {
      //         id: 1,
      //         item: t("New Projects"),
      //         link: "/new-projects",
      //       },
      //       ...(propertyTypes?.map(
      //         (propertyType: { id: number; name: string }, index: number) => ({
      //           id: index + 2,
      //           item: propertyType.name,
      //           link: "/new-projects",
      //           property_type_id: propertyType.id,
      //         })
      //       ) || []),
      //     ],
      //   },
      // },

      {
        id: 3,
        li: t("Developers"),
        link: "/developers",
        // content: {
        //   option: renderDeveloper,
        // },
      },
       {
        id: 4,
        li: t("List With Us"),
        link: "/list-your-property",
        // content: {
        //   option: renderDeveloper,
        // },
      },

      // {
      //   id: 5,
      //   li: t("Areas"),
      //   link: "/area-guides",
      //   content: {
      //     option: [
      //       { id: 1, item: t("Dubai Creek Harbour") },
      //       { id: 2, item: t("Business Bay") },
      //       { id: 3, item: t("Dubai Marina") },
      //       { id: 4, item: t("Palm Jumeirah") },
      //       { id: 5, item: t("Downtown Dubai") },
      //       { id: 6, item: t("Jumeirah Village Circle") },
      //       { id: 7, item: t("EMAAR Beachfront") },
      //       { id: 8, item: t("Sobha Hartland") },
      //       { id: 9, item: t("Jumeirah") },
      //       { id: 10, item: t("Meydan") },
      //       { id: 11, item: t("Expo City") },
      //       { id: 12, item: t("All Areas in Dubai") },
      //     ],
      //   },
      // },

      // {
      //   id: 6,
      //   li: t("Blog"),
      //   link: "/blog",
      // },

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
            // {
            //   id: 3,
            //   icon: listPropertyIcon,
            //   item: t("List Your Property"),
            //   link: "/list-your-property",
            // },
            // {
            //   id: 4,
            //   icon: faqsIcon,
            //   item: t("FAQs"),
            //   link: "/faqs",
            // },
            {
              id: 5,
              icon: meetTheTeamIcon,
              item: t("Meet The Team"),
              link: "/team",
            },
            // {
            //   id: 6,
            //   icon: testimonialIcon,
            //   item: t("Testimonials"),
            //   link: "/reviews",
            // },
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
    [filterDeveloper, propertyTypes, filter, t]
  );

  return Data;
};

export default HeaderItem;