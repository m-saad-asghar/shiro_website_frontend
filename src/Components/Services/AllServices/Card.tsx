import ImagesUrl from "@/helpers/ImagesURL";
import type { FC } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Icons from "@/Constants/Icons";

interface CardType {
  item: {
    id: number;
    title_main: string;
    description: string;
    image_main: string;
    [key: string]: unknown;
  };
}

const Card: FC<CardType> = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Create slug from title and append ID at the end
    const slug = `${
      item.title_main
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "service"
    }_${item.id}`;
    navigate(`/service/${slug}`);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="w-full h-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group block"
    >
      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={ImagesUrl(item?.image_main)}
          alt={item?.title_main}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/src/assets/Images/Property/placeholder-property.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Overlay Icon */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Icons.IoIosArrowForward size={20} className="text-primary" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {item?.title_main}
        </h3>
        <p className="text-gray-600 text-sm lg:text-base leading-relaxed line-clamp-3">
          {item?.description}
        </p>

        {/* Read More Link */}
        <div className="mt-4 flex items-center gap-2 text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>{item?.title_main}</span>
          <Icons.IoIosArrowForward
            size={16}
            className="transform group-hover:translate-x-1 transition-transform duration-300"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
