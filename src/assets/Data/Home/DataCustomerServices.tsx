import { useMemo } from "react";
import Images from "../../../Constants/Images";
import type { DataCustomerServicesType } from "../../../Types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const DataCustomerServices = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  function scrollToElement(id: any) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  const data: DataCustomerServicesType[] = useMemo(
    () => [
      {
        id: 1,
        img: Images.SpecialistGreenGold,
        title: t("Connect with a Specialist"),
        desc: t(
          "Access our dedicated team of over 400+ expert agents ready to assist you."
        ),
         link: "/contact",
        onClick: () => navigate("/contact"),
        // onClick: () => scrollToElement("ListYourProperty"),
      },
      {
        id: 2,
        img: Images.ListingGreenGold,
        title: t("List Your Property"),
        desc: t(
          "Achieve optimal value by listing your property with our expert marketing strategies"
        ),
        link: "/list-your-property",
        onClick: () => navigate("/list-your-property"),
      },
      {
        id: 3,
        img: Images.VisionGreenGold,
        title: t("Check Our Vision"),
        desc: t(
          "Learn how our vision is redefining real estate with innovation and long-term value"
        ),
        link: "/about",
        onClick: () => navigate("/about"),
        // link: "../../PDF/SHIRO ESTATE - Company Profile.pdf",
        //    onClick : () => {
        //         saveAs(File , "shirow")
        //      }
        // onClick: () => {
        //   navigate("/about");
        // },
      },
      {
        id: 4,
        img: Images.ExploreGreenGold,
        title: t("Explore Dubai Developers"),
        desc: t(
          "Browse and find your ideal property from our extensive portfolio of Dubai developers."
        ),
        link: "/developers",
        onClick: () => {
          navigate("/developers");
        },
      },
    ],
    [t]
  );
  return data;
};

export default DataCustomerServices;
