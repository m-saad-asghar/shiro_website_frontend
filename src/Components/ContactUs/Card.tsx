import { useState, type FC } from "react";
import ImagesUrl from "@/helpers/ImagesURL";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

type CardProps = {
  item: any;
  lenght: any;
};

const Card: FC<CardProps> = ({ item, lenght }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`${
        lenght == "1" ? "w-full max-w-2xl" : "w-full max-w-lg"
      } h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden`}
    >
      {/* Image Section */}
      <div
        className={`${
          lenght == "1" ? "h-80" : "h-64"
        } w-full relative overflow-hidden`}
      >
        <img
          src={ImagesUrl(item?.image)}
          alt={item?.title}
          className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x300?text=Office+Image";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {item?.title}
          </h3>
          <p className="text-sm text-primary font-semibold">{item?.address}</p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p
            className={`${
              open == false ? "line-clamp-3" : ""
            } text-sm text-gray-600 leading-relaxed`}
          >
            {item?.description}
          </p>
          <button
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200 underline"
            onClick={() => setOpen(!open)}
            aria-label={
              open == false
                ? "Read more about this service"
                : "Read less about this service"
            }
          >
            {open == false ? t("Read More") : t("Read Less")}
          </button>
        </div>

        {/* Contact Info */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t("Phone")}
          </p>
          <a
            href={`tel:${item?.phone}`}
            className="text-sm text-gray-700 hover:text-primary transition-colors duration-200 block"
          >
            {item?.phone}
          </a>
        </div>

        {/* Contact Button */}
        <div className="pt-2">
          <button
            onClick={() => window.open(`mailto:${item?.email}`)}
            className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#9f8151] transition-all duration-[.4s] flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {t("Contact Office")}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
