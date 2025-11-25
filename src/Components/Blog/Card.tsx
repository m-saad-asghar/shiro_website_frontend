import ImagesUrl from "@/helpers/ImagesURL";
import formatDate from "@/helpers/formatDate";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useBlogCategories from "@/hooks/useBlogCategories";

type CardProps = {
  item: any;
};

const Card: FC<CardProps> = ({ item }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { getCategoryName } = useBlogCategories();

  const handleCardClick = () => {
    // Create slug from title and append ID at the end
    const slug = `${item?.title.replaceAll(" ", "_")}_${item.id}`;
    navigate(`/blog/${slug}`);
  };

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-48">
        <img
          src={ImagesUrl(item?.main_image)}
          alt={item?.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-[#094834] text-white text-xs font-semibold px-3 py-1 rounded-full">
            {getCategoryName(item?.blog_category_id)}
          </span>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-[#094834]/0 group-hover:bg-[#094834]/10 transition-all duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-[#094834] line-clamp-2 group-hover:text-[#9f8151] transition-colors duration-200 leading-tight">
          {item?.title}
        </h3>

        {/* Date */}
        <p className="text-sm text-gray-500 font-medium">
          {formatDate(item?.created_at, i18n.language)}
        </p>

        {/* Read More Button */}
        <button className="inline-flex items-center gap-2 text-[#094834] font-semibold hover:text-[#9f8151] transition-colors duration-200 group/btn cursor-pointer">
          <span>{t("Read More")}</span>
          <svg
            className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Card;
