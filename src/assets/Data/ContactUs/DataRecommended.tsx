import Images from "@/Constants/Images";
import type { DataRecommendedType } from "@/Types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const DataRecommended = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const Data: DataRecommendedType[] = useMemo(
    () => [
      {
        id: 1,
        img: Images.imgTeam,
        title: t("Meet the team"),
        desc: t("meet our team at shiro to learn more about us"),
        link: () => navigate("/team"),
      },
      {
        id: 2,
        img: Images.imgCareer,
        title: t("Customer Reviews"),
        desc: t(
          "Read what our satisfied customers say about their experience with Shiro Estate"
        ),
        link: () => navigate("/reviews"),
      },
      {
        id: 3,
        img: Images.imgFind,
        title: t("Find a Property"),
        desc: t(
          "Looking for your next home ? Discover Shiro Estates listings for you new address"
        ),
        link: () => navigate("/buy/properties-for-sale"),
      },
      {
        id: 4,
        img: Images.imgServices,
        title: t("Property Services"),
        desc: t(
          "Shiro Estate covers all property related services for a seamless experience"
        ),
        link: () => navigate("/property-services"),
      },
    ],
    [t]
  );
  return Data;
};

export default DataRecommended;
