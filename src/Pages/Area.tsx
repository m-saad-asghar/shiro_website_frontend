import useQueryGet from "@/hooks/useQueryGet";
import { Helmet } from "react-helmet";
import AllAreas from "@/Sections/Developer/AllAreas";
import { ContactForm } from "@/Sections/Home";
import AreasServices from "@/Services/AreasServices";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import areaImagesUrl from "@/helpers/areaImagesURL";
import Pagination from "@/Components/Pagination";
import EnquireNowReactModal from "@/Components/Home/ContactForm/EnquireNowReactModal";

const PER_PAGE = 16;

const AreaPage = () => {
  const { t } = useTranslation();

  const [value, setValue] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [value]);

  // ✅ useQueryGet returns response.data.data
  const { data, status } = useQueryGet(["areas", value, page], () =>
    AreasServices.areas({
      search: value,
      page,
      per_page: PER_PAGE,
    })
  );

  // ✅ correct structure
  const areas = data?.areas ?? [];
  const pagination = data?.pagination;

  const currentPage = pagination?.current_page ?? page;

  const handlePageChange = (p: number) => {
    setPage(p);
    document
      .getElementById("areas_list")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>Dubai Property Areas | Shiro Real Estate Partners</title>
        <meta
          name="description"
          content="Explore Dubai’s prime areas. Browse top communities and locations for investment and living."
        />
      </Helmet>

      {/* Hero Section */}
      <div className="relative w-full h-[91vh] overflow-hidden developer_listing_styling">
        <img
          src={areaImagesUrl("areas_main_image.avif")}
          alt="Areas Banner"
          className="w-full h-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

        <div className="custom_container develop_heading_styling">
          <h1 className="hidden md:block project_text font-bold !text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {t("Trusted Partners")}
          </h1>

          <p className="text-sm sm:text-base">
            <span className="text-white text-xl">
              {t("Collaborating with the UAE’s Leading Areas")}
            </span>
          </p>

          <EnquireNowReactModal
  title={t("ENQUIRE NOW")}
  display_name="enquire-now-button-click-from-areas-page"
  project_name=""
  origin={t("Click | Enquire Now Button | Area Page")}
  showSuccessToast={true}
  showErrorToast={true}
  closeOnSuccess={true}
  trigger={(open) => (
    <button
      type="button"
      onClick={open}
      className="w-fit bg-[#094834] hover:bg-[#9f8151] change_border text-white font-semibold py-4 px-6 shadow-lg transition"
    >
      {t("Enquire Now")}
    </button>
  )}
/>

          {/* <button
            onClick={() =>
              document
                .getElementById("list_with_us")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-fit bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 shadow-lg transition"
          >
            {t("Enquire Now")}
          </button> */}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-screen">
        <motion.div
          id="areas_list"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-10 lg:py-20 pb-10 lg:pb-10"
        >
          {/* Empty State */}
          
            <>
              {/* Areas Grid */}
              <AllAreas
  data={areas}
  status={status as any}
  searchValue={value}
  onSearchChange={(v) => setValue(v)}
  onClearSearch={() => setValue("")}
/>


              {/* ✅ Shared Pagination Component */}
              {status === "success" && pagination && (
                <div className="custom_container">
                  <Pagination
                  className="w-full py-[20px]"
                  lastPages={pagination?.last_page}
                  page={currentPage}
                  setPage={handlePageChange}
                />
                </div>
              )}
            </>
         
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white mb-16"
          id="list_with_us"
        >
          <ContactForm display_name="contact-us-form-via-areas-page-of-website"/>
        </motion.div>
      </div>
    </>
  );
};

export default AreaPage;
