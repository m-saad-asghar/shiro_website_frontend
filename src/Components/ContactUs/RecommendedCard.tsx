import type { DataRecommendedType } from "@/Types";
import type { FC } from "react";
import { motion } from "framer-motion";

type RecommendedCardProps = {
  item: DataRecommendedType;
};

const RecommendedCard: FC<RecommendedCardProps> = ({ item }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group w-full h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
      onClick={item?.link}
    >
      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x300?text=Service+Image";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-2"
        >
          {item.title}
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-gray-600 text-sm leading-relaxed line-clamp-3"
        >
          {item.desc}
        </motion.p>

        {/* Learn More Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="pt-2"
        >
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary/80 transition-colors duration-200 group-hover:gap-3">
            {item.link ? "Learn More" : "View Details"}
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
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
          </span>
        </motion.div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default RecommendedCard;
