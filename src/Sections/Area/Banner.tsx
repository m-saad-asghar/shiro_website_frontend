import Icons from "@/Constants/Icons";
import { fadeIn } from "@/Utils/Motions/motion";
import { motion } from "framer-motion";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

type BannerProps = {
  setValues: any;
};

const Banner: FC<BannerProps> = ({ setValues }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section with Background Image */}
      <div className="relative py-16 md:py-20 lg:py-24">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/80 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/90"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center">
          <motion.div
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6"
            >
              {t("Top Dubai Communities")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto"
            >
              {t(
                "Discover vibrant living in Dubai through our comprehensive area guide, offering insights into top communities, attractions, and things to do. Explore the best restaurants, must-visit places, and top-rated apartments, while uncovering the finest properties for the community that best fits you."
              )}
            </motion.p>

            {/* Additional Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/80">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2">
                    {t("Prime Locations")}
                  </h3>
                  <p className="text-sm">
                    {t(
                      "Explore Dubai's most sought-after neighborhoods and communities"
                    )}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2">
                    {t("Luxury Properties")}
                  </h3>
                  <p className="text-sm">
                    {t(
                      "Find premium apartments, villas, and townhouses in exclusive areas"
                    )}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2">
                    {t("Fast Growth")}
                  </h3>
                  <p className="text-sm">
                    {t(
                      "Invest in areas with high potential for property value appreciation"
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("Search Area")}
                  className="w-full h-14 md:h-16 px-6 pl-14 pr-6 text-lg border-2 border-white/30 rounded-2xl focus:border-white focus:ring-4 focus:ring-white/20 outline-none transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 shadow-xl"
                  onChange={(e) => setValues(e.target.value)}
                />
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/70">
                  <Icons.IoIosSearch className="w-6 h-6" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
