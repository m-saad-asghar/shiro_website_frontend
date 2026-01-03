import Images from "@/Constants/Images";
import { useState } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useAreaUnit } from "@/Context/AreaUnitContext";
import { motion } from "framer-motion";
import SocialShare from "@/Components/SingleProperty/SocialShare";

type InfoPropertyProps = {
  item: any;
  employee: any;
  amenities: any;
  commercialAmenities: any;
};

const InfoProperty: FC<InfoPropertyProps> = ({ item, employee, amenities, commercialAmenities }) => {
  console.log("InfoProperty item prop debugging:", employee);
  const { t } = useTranslation();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const { formatArea } = useAreaUnit();
  const segment = location.pathname.split("/")[2];
  const match = segment.match(/for-(.*?)-in/);
  const result = match ? match[1].replace(/-/g, " ") : null;
console.log("InfoProperty item:", item);
  return (
    <div className="space-y-8 relative change_border">
      {/* Share button in top right corner */}
      <div className="absolute top-0 right-0 z-10">
        {/* <SocialShare property={item} /> */}
      </div>

      {/* Property Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 info_property_header change_border"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 properties_details_heading">
          <h1 className="font-semibold text-primary text-3xl">
           {"Đ "} {item?.price?.toLocaleString()}
          </h1>
        </div>

         <h3 className="font-semibold text-primary text-xl mb-0 !text-[#9f8151]">
         {item?.title}
        </h3>

         <h3 className="rounded-lg text-md transition-all duration-200 mb-1 text-[#9f8151]">
        {[
  item?.property_type && `${item.property_type}`,
  item?.property_category && `${t("for")} ${item.property_category}`,
  item?.community && `${t("in")} ${item.community}`,
  item?.sub_community && `, ${item.sub_community}`,
]
  .filter(Boolean)
  .join(" ")}


        </h3>

        <div className="space-y-2">
          <p className="font-semibold rounded-lg text-lg transition-all duration-200 mb-1 text-[#9f8151]">
            {item?.selling_points}
          </p>
          <p className="text-primary text_stying text-lg">
             {/* {item?.title} {t("By")}{" "}  {item?.developer.name} */}
            {/* {item?.property_type?.name} {t("for")}{" "}
            {result == "rent"
              ? t("rent")
              : result == "buy"
              ? t("Buy")
              : t("new project")}{" "}
            {t("in")} {item?.location} */}
          </p>
        </div>
      </motion.div>

      {/* Property Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-3 gap-6 py-4 border-y border-gray-200"
      >
         <>
                        <div className="flex items-center gap-2">
                          <img
                            src={Images.BedsIcons}
                            className="w-5 h-5"
                            alt="Bedrooms icon"
                          />
                          <div className="text-center">
                            <div className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                             {item?.bedrooms == "Studio"
                      ? t("Studio")
                      : `${item?.bedrooms} ${
                          Number(item?.bedrooms) == 1
                            ? t("Bedroom")
                            : t("Bedrooms")
                        }`}
        
                            </div>
                            {/* <div className="text-xs text-gray-500">{t("Bedrooms")}</div> */}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={Images.BathIcons}
                            className="w-5 h-5"
                            alt="Bathrooms icon"
                          />
                          <div className="text-center">
                            <div className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                            {Number(item?.bathrooms) === 1
                      ? `1 ${t("Bathroom")}`
                      : `${item?.bathrooms} ${t("Bathrooms")}`}
        
                            </div>
                            {/* <div className="text-xs text-gray-500">
                              {t("Bathrooms")}
                            </div> */}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={Images.ArrowIcons}
                            className="w-5 h-5"
                            alt="Area icon"
                          />
                          <div className="text-center">
                            <div className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                              {formatArea(item?.area)}
                            </div>
                            {/* <div className="text-xs text-gray-500">{t("Area")}</div> */}
                          </div>
                        </div>
                      </>
        {/* <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <img src={Images.BedsIcons} className="w-6 h-6" alt="Beds" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {item?.num_bedroom === 0 ? t("Studio") : item?.num_bedroom}
            </p>
            <p className="text-sm text-gray-600">{t("beds")}</p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <img src={Images.BathIcons} className="w-6 h-6" alt="Baths" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {item?.num_bathroom}
            </p>
            <p className="text-sm text-gray-600">{t("Baths")}</p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <img src={Images.ArrowIcons} className="w-6 h-6" alt="Area" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {formatArea(item?.area)}
            </p>
            <p className="text-sm text-gray-600">{t("Area")}</p>
          </div>
        </div> */}
      </motion.div>

      {/* Key Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6 margin_key_information_section"
      >
        <h3 className="font-semibold text-primary text-xl key_information_heading">
          {t("Key Information")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Property Type")}
            </p>
            <p className="text-primary text_stying text-sm">
              {item?.property_type
    ? item.property_type.charAt(0).toUpperCase() + item.property_type.slice(1)
    : ""}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
             {t("Property Category")}
            </p>
            {/* <p className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Purpose")}
            </p> */}
            <p className="text-primary text_stying text-sm">
              {item?.property_category}
            </p>
          </div>

          {/* Rental Period - Only show for rent properties */}
          {/* {result === "rent" && item?.rental_period && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm font-medium text-green-700 mb-1">
                {t("Rental Period")}
              </p>
              <p className="text-lg font-semibold text-green-800">
                {item.rental_period}
              </p>
            </div>
          )} */}
        </div>
      </motion.div>

      {/* Regulatory Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-6 !mb-0"
      >
        <h3 className="font-semibold text-primary text-xl key_information_heading">
          {t("Regulatory Information")}
        </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Broker License")}
            </p>
            <p className="text-primary text_stying text-sm">
               {employee?.orn && employee.orn !== 0 ? employee.orn : "-"}

            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
             {t("DLD Permit Number")}
            </p>
            {/* <p className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Purpose")}
            </p> */}
            <p className="text-primary text_stying text-sm">
              {item?.rera ? item.rera : "-"}
            </p>
          </div>

          {/* Rental Period - Only show for rent properties */}
          {/* {result === "rent" && item?.rental_period && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm font-medium text-green-700 mb-1">
                {t("Rental Period")}
              </p>
              <p className="text-lg font-semibold text-green-800">
                {item.rental_period}
              </p>
            </div>
          )} */}
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Reference ID")}
            </p>
            <p className="text-primary text_stying text-sm">
               {item?.reference}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Furnishing Type")}
            </p>
            {/* <p className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Purpose")}
            </p> */}
            <p className="text-primary text_stying text-sm">
              {item?.furnishing?.toLowerCase() == "yes"
  ? t("Furnished")
  : item?.furnishing?.toLowerCase() == "partly"
  ? t("Partly Furnished")
  : t("Not Furnished")}

               {/* {item?.furnishing == "furnished"
  ? t("Furnished")
  : item?.furnishing == "unfurnished"
  ? t("Not Furnished")
  : item?.furnishing == "semifurnished"
  ? t("Semi Furnished")
  : "-"} */}
            </p>
          </div>

          {/* Rental Period - Only show for rent properties */}
          {/* {result === "rent" && item?.rental_period && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm font-medium text-green-700 mb-1">
                {t("Rental Period")}
              </p>
              <p className="text-lg font-semibold text-green-800">
                {item.rental_period}
              </p>
            </div>
          )} */}
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 info_property_header">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
                  {t("Reference ID")}
                </p>
                <p className="text-base text-primary">
                  {item?.reference}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-">
                <p className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
                  {t("Furnishing Type")}
                </p>
                <p className="text-base text-primary capitalize">
                 {item?.furnishing == "furnished"
  ? t("Furnished")
  : item?.furnishing == "unfurnished"
  ? t("Not Furnished")
  : item?.furnishing == "semifurnished"
  ? t("Semi Furnished")
  : "-"}

                </p>
              </div>
            </div>
          </div>


        </div> */}
      </motion.div>

      {/* Description */}
    <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.4 }}
  style={{ marginTop: 15 }}
  className="space-y-4"
>
  <h3 className="font-semibold text-primary text-xl key_information_heading">
    {t("Description")}
  </h3>

  <div className="bg-gray-50 rounded-xl p-6">

    <div className={`down_styling para_styling ${expanded ? "" : "line-clamp-4"}`}
     style={{ whiteSpace: "pre-line" }}>
  {item?.description || "-"}
</div>

    {/* <div
      className={`down_styling para_styling ${expanded ? "" : "line-clamp-4"}`}
      dangerouslySetInnerHTML={{ __html: item?.description || "" }}
    /> */}

    {(item?.description?.length || 0) > 200 && (
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-base font-semibold text-primary underline !text-[#9f8151]"
      >
        {expanded ? "Read Less" : "Read More"}
      </button>
    )}
  </div>
</motion.div>

 <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.4 }}
  style={{ marginTop: 15 }}
  className="space-y-4"
>
  <h3 className="font-semibold text-primary text-xl key_information_heading">
    {t("Private Amenities")}
  </h3>

  <div className="bg-gray-50 rounded-xl p-6">
  {amenities.map((amenity: string, index: number) => (
  <span
    key={`${amenity}-${index}`}
    className="px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-700 amentity_badge_styling mr-2 mb-2 inline-block"
  >
    {amenity}
  </span>
))}
  </div>
</motion.div>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.4 }}
  style={{ marginTop: 15 }}
  className="space-y-4"
>
  <h3 className="font-semibold text-primary text-xl key_information_heading">
    {t("Commercial Amenities")}
  </h3>

  <div className="bg-gray-50 rounded-xl p-6">
  {commercialAmenities.map((amenity: string, index: number) => (
  <span
    key={`${amenity}-${index}`}
    className="px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-700 amentity_badge_styling mr-2 mb-2 inline-block"
  >
    {amenity}
  </span>
))}
  </div>
</motion.div>

    </div>
  );
};

export default InfoProperty;
