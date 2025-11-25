import ImagesUrl from "@/helpers/ImagesURL";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type AreaCardProps = {
  item: any;
};

const AreaCard: FC<AreaCardProps> = ({ item }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer h-full"
      onClick={() =>
        navigate(`/area-guides/${item?.name.replaceAll(" ", "-")}`)
      }
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            src={ImagesUrl(item?.image)}
            className="w-full h-full object-cover"
            alt={item?.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          <motion.h3
            whileHover={{ color: "#094834" }}
            transition={{ duration: 0.3 }}
            className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300"
          >
            {item?.name}
          </motion.h3>

          <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3 flex-1">
            {item?.description}
          </p>

          {/* Read More Indicator */}
          <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Learn more</span>
            <svg
              className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
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
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AreaCard;
