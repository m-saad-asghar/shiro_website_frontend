import ImagesUrl from "@/helpers/ImagesURL";
import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type CardProps = {
  item: any;
};

const Card: FC<CardProps> = ({ item }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCardClick = () => {
    // Create slug from name only - no ID needed
    const slug =
      item.name
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "team-member";
    navigate(`/team-member/${slug}`);
  };

  return (
    <div
      className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative mb-6">
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={item?.image_url || ImagesUrl(item?.image)}
            alt={item?.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-[#094834]/0 group-hover:bg-[#094834]/10 transition-all duration-300 rounded-xl"></div>

        {/* View Profile Button */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="bg-white text-[#094834] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#9f8151] hover:text-white transition-all duration-[.4s] cursor-pointer">
            {t("View Profile")}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-[#094834] mb-2 group-hover:text-[#9f8151] transition-colors duration-200">
          {item?.name}
        </h3>
        <p className="text-gray-600 font-medium">{item?.position}</p>
      </div>
    </div>
  );
};

export default Card;
