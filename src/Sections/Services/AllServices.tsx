import { Card } from "@/Components/Services/AllServices";
import { useMemo, type FC } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";

interface ServiceItem {
  id: number;
  title_main: string;
  description: string;
  image_main: string;
  title?: string;
  image?: string;
  [key: string]: unknown;
}

type AllServicesProps = {
  item: ServiceItem[];
  status: string;
};

const AllServices: FC<AllServicesProps> = ({ item, status }) => {
  const { t } = useTranslation();

  const renderCard = item?.map((item: ServiceItem, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3"
    >
      <Card item={item} />
    </motion.div>
  ));

  const renderSkeletonCard = useMemo(() => {
    return [...Array(8)].map((_, index: number) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </motion.div>
    ));
  }, []);

  return (
    <section className="py-10 lg:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6"
          >
            <Icons.IoGridOutline size={20} />
            {t("Our Services")}
          </motion.div>

          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t("Comprehensive")}
            <span className="block text-primary">
              {t("Real Estate Services")}
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t(
              "Discover our wide range of professional real estate services designed to meet all your property needs in Dubai."
            )}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="flex flex-wrap -mx-3">
          {status === "pending" || status === "error"
            ? renderSkeletonCard
            : renderCard}
        </div>

        {/* Load More Button (if needed for future) */}
        {item && item.length > 8 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-12"
          >
            <button className="inline-flex items-center gap-2 bg-primary hover:bg-[#9f8151] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-[.4s]">
              <Icons.FiPlus size={20} />
              {t("Load More Services")}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AllServices;
