import Icons from "@/Constants/Icons";
import { ValueContext } from "@/Context/ValueContext";
import areaImagesUrl from "@/helpers/areaImagesURL";
import { useContext, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type AreaItem = {
  id?: number;
  name: string;
  main_image: string | null;
  description: string | null;
  slug: string;
};

type AreaCardProps = {
  item: AreaItem;
};

const AreaCard: FC<AreaCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const { setValues } = useContext(ValueContext);
  const { t } = useTranslation();

  const handleClick = () => {
    setValues((prev: any) => ({
      ...prev,
      // ✅ store area info
      area_id: item?.id,
      area_slug: item?.slug,
      area_name: item?.name,
      area_description: item?.description,
    }));

    // ✅ route to area details
    navigate(`/areas/${item?.slug}`);
  };

  const imageSrc = item?.main_image ? areaImagesUrl(item.main_image) : "";

  return (
    <motion.div
      className="group relative bg-white overflow-hidden cursor-pointer block"
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative h-60 overflow-hidden border-radius bg-gray-100">
        {imageSrc ? (
           <img
   src={imageSrc}
            alt={item?.name}
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
  loading="lazy"
/>
          // <img
          //   src={imageSrc}
          //   alt={item?.name}
          //   loading="lazy"
          //   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          // />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            {t("No Image")}
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0" />
      </div>

      {/* Content Section */}
      <div className="p-6" style={{ paddingLeft: 0, paddingRight: 0 }}>
        {/* Area Name */}
        <div className="flex items-center mb-2">
          <h3 className="font-semibold text-primary text-xl">{item?.name}</h3>
          <motion.div className="text-primary transition-colors duration-200">
            <Icons.RxArrowTopRight className="w-4 h-5 ml-3" />
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {item?.description?.trim()
            ? item.description
            : t("Explore this area to discover lifestyle, attractions, and property options.")}
        </p>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-primary/0 border-radius transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default AreaCard;
