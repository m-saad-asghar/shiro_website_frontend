import useQueryGet from "@/hooks/useQueryGet";
import { Helmet } from "react-helmet";
import AllProjects from "@/Sections/Developer/AllProjects";
import { ContactForm } from "@/Sections/Home";
import ProjectsServices from "@/Services/ProjectServices";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ImagesUrl from "@/helpers/ImagesURL";
import Pagination from "@/Components/Pagination";
import EnquireNowReactModal from "@/Components/Home/ContactForm/EnquireNowReactModal";

const PER_PAGE = 12;

const OffplanProjects = () => {
  const { t } = useTranslation();

  const [value, setValue] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [value]);

  // ✅ Projects Query
  const { data: apiRes, status: queryStatus } = useQueryGet(
    ["projects", value, page],
    () =>
      ProjectsServices.projects({
        search: value,
        page,
        per_page: PER_PAGE,
      })
  );

  // ✅ normalize response (supports BOTH shapes)
  // shape A: { projects: [], pagination: {} }
  // shape B: { data: { projects: [], pagination: {} }, status: true, ... }
  const payload = (apiRes as any)?.data ?? apiRes;

  const projects = payload?.projects ?? [];
  const pagination = payload?.pagination;
  const currentPage = pagination?.current_page ?? page;

  // ✅ normalize UI status for components (important!)
  const uiStatus: "pending" | "success" | "error" =
    queryStatus === "success" || (apiRes as any)?.status === true
      ? "success"
      : queryStatus === "error" || (apiRes as any)?.status === false
      ? "error"
      : "pending";

  const handlePageChange = (p: number) => {
    setPage(p);
    document
      .getElementById("projects_list")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>Off-Plan Projects in Dubai | Shiro Real Estate Partners</title>
        <meta
          name="description"
          content="Explore off-plan projects in Dubai. Browse premium developments, communities, and investment opportunities."
        />
      </Helmet>

      {/* Hero Section */}
      <div className="relative w-full h-[91vh] overflow-hidden developer_listing_styling">
         <img
   src={ImagesUrl("our_developers_main_image.jpg")}
          alt="Projects Banner"
  className="w-full h-full object-cover"
  loading="eager"
  decoding="async"
  fetchPriority="high"
/>
        {/* <img
          src={ImagesUrl("our_developers_main_image.jpg")}
          alt="Projects Banner"
          className="w-full h-full object-cover"
        /> */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

        <div className="custom_container develop_heading_styling">
          <h1 className="hidden md:block project_text font-bold !text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {t("Exclusive Property Projects")}
          </h1>

          <p className="text-sm sm:text-base">
            <span className="text-white text-xl">
              {t("Our Projects Across the UAE’s Key Locations")}
            </span>
          </p>

          <EnquireNowReactModal
            title={t("ENQUIRE NOW")}
            display_name="enquire-now-button-click-from-projects-page"
            project_name=""
            origin={t("Click | Enquire Now Button | Projects Page")}
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
        </div>
      </div>

      <div className="min-h-screen">
        <motion.div
          id="projects_list"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-10 lg:py-20 pb-10 lg:pb-10"
        >
          {/* Projects Grid */}
          <AllProjects
            data={projects}
            status={uiStatus}
            searchValue={value}
            onSearchChange={(v) => setValue(v)}
            onClearSearch={() => setValue("")}
          />

          {/* Pagination */}
          {uiStatus === "success" && pagination && (
            <div className="custom_container">
              <Pagination
                className="w-full py-[20px]"
                lastPages={pagination.last_page}
                page={currentPage}
                setPage={handlePageChange}
              />
            </div>
          )}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white mb-16"
          id="list_with_us"
        >
          <ContactForm display_name="contact-us-form-via-projects-page-of-website" />
        </motion.div>
      </div>
    </>
  );
};

export default OffplanProjects;