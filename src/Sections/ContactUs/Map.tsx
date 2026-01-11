import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";

const Map = () => {
  const { t } = useTranslation();

  return (
     <section className="">
      <div className="custom_container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] change_border overflow-hidden border border-gray-200">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.0929029806157!2d55.2751323!3d25.2000893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f4300340bbb71%3A0x6665bc040d9a7501!2zU2hpcm8gRXN0YXRlIC0g2LTZitix2Ygg2KfZhNi52YLYp9ix2YrYqQ!5e0!3m2!1sar!2s!4v1752996590360!5m2!1sar!2s"
              width="full"
              height="full"
              loading="lazy"
              title="Shiro Real Estate Location"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icons.IoLocationOutline size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary text-2xl">
                  Shiro Real Estate
                </h3>
                <p className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
                  {t("Your Trusted Partner in Dubai Real Estate")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Icons.IoTimeOutline
                  size={16}
                  className="text-primary flex-shrink-0"
                />
                <span className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                  {t("Mon - Fri: 9:00 AM - 6:00 PM")}
                </span>
              </div>
            </div>

            <button
              className="search_btn_styling change_border rounded-[4px] font-NeueHaasGrotesk !text-[16px] md:text-[14px] capitalize flex-center cursor-pointer search_btn_styling h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold change_border transition-all duration-[.4s] flex items-center justify-center gap-2 flex-center w-full min-h-[50px] min-w-[200px] disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() =>
                window.open(
                  "https://maps.google.com/?q=Shiro+Real+Estate+Dubai",
                  "_blank"
                )
              }
            >
              <Icons.IoIosArrowForward size={16} />
              {t("Get Directions")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Map;
