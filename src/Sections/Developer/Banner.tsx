import { fadeIn } from "@/Utils/Motions/motion";
import { motion } from "framer-motion";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";

type BannerProps = {
  setValue: (value: string) => void;
};

const Banner: FC<BannerProps> = ({ setValue }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-gradient-to-br from-primary/5 via-white to-primary/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-8 pb-4"
        >
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <span className="hover:text-primary transition-colors duration-200 cursor-pointer">
              {t("Home")}
            </span>
            <Icons.IoIosArrowForward className="w-4 h-4" />
            <span className="text-primary font-medium">{t("Developer")}</span>
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className="py-16 md:py-20 lg:py-24 text-center">
          <motion.div
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-primary rounded-full"
              ></motion.div>
              <span className="text-primary font-medium text-sm">
                {t("Developer Directory")}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              {t("Real Estate Developers in Dubai & The UAE")}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              {t(
                "Discover the most trusted and innovative real estate developers shaping Dubai's skyline and creating exceptional living experiences"
              )}
            </motion.p>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto"
            >
              <div className="relative w-full sm:w-96 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icons.IoIosSearch className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  placeholder={t("Search for developers...")}
                  className="w-full h-14 pl-12 pr-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 group-hover:border-gray-300"
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>

              <button className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-[#9f8151] transition-all duration-[.4s] flex items-center justify-center gap-2">
                <Icons.IoIosSearch className="w-5 h-5" />
                {t("Search")}
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-gray-200"
            >
              <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  50+
                </div>
                <div className="text-sm text-gray-600">{t("Developers")}</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  200+
                </div>
                <div className="text-sm text-gray-600">{t("Projects")}</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  20+
                </div>
                <div className="text-sm text-gray-600">
                  {t("Years Experience")}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
