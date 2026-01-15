import useQueryGet from "@/hooks/useQueryGet";
import { Helmet } from "react-helmet";
import { AllDeveloper, Banner } from "@/Sections/Developer";
import { ContactForm, StayInTheLoop } from "@/Sections/Home";
import DevelopersServices from "@/Services/DevelopersServices";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ImagesUrl from "@/helpers/ImagesURL";

const Devleoper = () => {
  const [value, setValue] = useState<string>("");
  const { t } = useTranslation();
  const { data, status } = useQueryGet(["alldeveloper", value], () =>
    DevelopersServices.developer(value)
  );

  return (
    <>
      <Helmet>
        <title>Dubai Property Developers | Shiro Real Estate Partners</title>
        <meta
          name="description"
          content="Explore properties from Dubai's leading developers. Browse exclusive projects and developments from trusted real estate developers partnered with Shiro."
        />
      </Helmet>
       <div className="relative w-full h-[91vh] overflow-hidden developer_listing_styling">
        <img
          src={ImagesUrl("our_developers_main_image.jpg")}
          alt="Services Banner"
          className="w-full h-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent"></div>
        <div
          className="
            custom_container
            develop_heading_styling
          "
        >
        <h1 className="hidden md:block project_text font-bold !text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {t("Trusted Partners")}
          </h1>

          <p className="text-sm sm:text-base">
            <span className="text-white text-xl">
              {t(
                "Collaborating with the UAE’s Leading Developers"
              )}
            </span>
          </p>

          <button
              onClick={() => {
  const section = document.getElementById("list_with_us");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}}
            className="w-fit bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 shadow-lg transition"
          >
            {t("Enquire Now")}
          </button>
        </div>
       </div>
      <div className="min-h-screen">
        {/* Header Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-[120px] md:pt-[140px] lg:pt-[127.2px]"
        >
          <Banner setValue={setValue} />
        </motion.div> */}

        {/* Developers Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-10 lg:py-20 pb-10 lg:pb-10"
        >
          {data?.developers?.length === 0 ? (
            <div className="container mx-auto px-4">
              <div className="text-center py-20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <svg
                    className="w-12 h-12 text-gray-400"
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
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-2xl font-bold text-gray-900 mb-2"
                >
                  {t("No Developers Found")}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-gray-600 max-w-md mx-auto"
                >
                  {t(
                    "We couldn't find any developers matching your criteria. Try adjusting your search."
                  )}
                </motion.p>
              </div>
            </div>
          ) : (
            <AllDeveloper data={data?.developers} status={status} />
          )}
        </motion.div>

        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white mb-16"
          id="list_with_us"
        >
          <ContactForm />
        </motion.div>

        {/* Stay In The Loop Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gray-50"
        >
          <StayInTheLoop />
        </motion.div> */}
      </div>
    </>
  );
};

export default Devleoper;
