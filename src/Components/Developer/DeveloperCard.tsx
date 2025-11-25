import Icons from "@/Constants/Icons";
import Images from "@/Constants/Images";
import { ValueContext } from "@/Context/ValueContext";
import ImagesUrl from "@/helpers/ImagesURL";
import { useContext, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type DeveloperCardProps = {
  item: any;
};

const DeveloperCard: FC<DeveloperCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const { setValues } = useContext(ValueContext);
  const { t } = useTranslation();

  const handleClick = () => {
    setValues((prev: any) => {
      return {
        ...prev,
        developer_id: item?.id,
        developer_name: item?.name,
      };
    });
    navigate(
      `/new-projects/developed-by-${item?.name
        ?.toLowerCase()
        .replace(/ /g, "-")}-properties`
    );
  };

  return (
    <motion.div
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-primary/20 block"
      onClick={handleClick}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={Images.ImgDeveloper}
          alt={item?.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Logo Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg group-hover:shadow-xl transition-all duration-300"
        >
          <img
            src={ImagesUrl(item?.logo)}
            alt={`${item?.name} logo`}
            className="w-20 h-12 object-contain"
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {t("Active")}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Developer Name */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-200 line-clamp-1">
            {item?.name}
          </h3>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            className="text-primary group-hover:text-primary/80 transition-colors duration-200"
          >
            <Icons.RxArrowTopRight className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {item?.description ||
            t(
              "Leading real estate developer with innovative projects and exceptional quality standards."
            )}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Icons.IoHomeOutline className="w-4 h-4" />
            <span>{t("Projects")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Icons.IoStar className="w-4 h-4 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>

        {/* View Projects Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-3 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center gap-2 group/btn"
        >
          <span>{t("View Projects")}</span>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <Icons.RxArrowTopRight className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 rounded-2xl transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default DeveloperCard;
