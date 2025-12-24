import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import ImagesUrl from "@/helpers/ImagesURL";
import { useTranslation } from "react-i18next";
import { ContactForm } from "@/Sections/Home";
import Icons from "@/Constants/Icons";
import Gallery from "@/Pages/Gallery"
import ProjectAmenities from "./ProjectAmenities";
import ProjectPaymentPlan from "./ProjectPaymentPlan";
import ProjectFaq from "./ProjectFaq";
import ProjectFloorPlan from "./ProjectFloorPlan";
import UniqueSellingPointsSection from "./UniqueSellingPointsSection";
import ProjectLocationSection from "./ProjectLocation";
import ProjectImagesUrl from "@/helpers/projectImagesURL";
// Simple service using fetch
const SingleProjectServices = {
  async fetchProjectBySlug(slug: string) {
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = `${baseUrl}/fetch_project_details/${slug}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to Fetch Project, Status Code: ${response.status}`);
    }

    const data = await response.json();
    return data;
  },
};

// Helper to get text in current language (JSON or plain string)
const getLocalizedValue = (value: any, lang: string, fallbackLang = "en") => {
  if (!value) return "";

  if (typeof value === "object") {
    return (
      value[lang] ||
      value[fallbackLang] ||
      (Object.values(value)[0] as string) ||
      ""
    );
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === "object" && parsed !== null) {
        return (
          parsed[lang] ||
          parsed[fallbackLang] ||
          (Object.values(parsed)[0] as string) ||
          ""
        );
      }
    } catch {
      return value;
    }
  }

  return "";
};

/** ✅ Sticky Tabs Component (like screenshot) */
const StickySectionTabs = ({
  tabs,
  offsetTopClass = "top-0",
}: {
  tabs: { id: string; label: string }[];
  offsetTopClass?: string;
}) => {
  const [active, setActive] = useState<string>(tabs?.[0]?.id || "");

  const scrollTo = (id: string) => {
    setActive(id); // ✅ underline stays on clicked tab until next click
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div
  className={`sticky ${offsetTopClass} z-[9999] bg-white navbar_styling_down`}
  style={{ position: "sticky" }}
>
      <div className="custom_container">
        <div className="flex gap-7 
       sticky_inner_navbar
        down_navbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => scrollTo(t.id)}
              className={`relative py-4 text-[14px] whitespace-nowrap transition
                ${active === t.id ? "text-[#9f8151] font-semibold" : "text-[#094834] hover:text-gray-800"}
              `}
            >
              {t.label}
              <span
                className={`absolute left-0 -bottom-[1px] h-[3px] w-full transition
                  ${active === t.id ? "bg-[#9f8151]" : "bg-transparent"}
                `}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


const ProjectDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ define tabs BEFORE any return (no hook here)
  const sectionTabs = [
    { id: "details", label: t("Details") },
    { id: "gallery", label: t("Gallery") },
    { id: "floorPlans", label: t("Floor Plans") },
    { id: "amenities", label: t("Amenities") },
    { id: "paymentPlans", label: t("Payment Plans") },
  ];

  const handleClick = (projectSlug: string) => {
    if (!projectSlug) return;
    navigate(`/projects/${projectSlug}`);
  };

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    SingleProjectServices.fetchProjectBySlug(slug)
      .then((data) => {
        setProjectData(data);
      })
      .catch((err: any) => {
        console.error("Error fetching project:", err);
        setError(err.message || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // ✅ Safe early returns (no hooks below this point)
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-600 text-lg">Loading Project</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-red-500 text-lg">Error: {error}</span>
      </div>
    );
  }

  const projects = projectData?.projects || [];
  const currentLang = (i18n.language || "en").split("-")[0];

  const localizedName = getLocalizedValue(projects?.name, currentLang, "en");
  const localizedDeveloperName = getLocalizedValue(
    projects?.developer_name,
    currentLang,
    "en"
  );
  const localizedDescription = getLocalizedValue(
    projects?.description,
    currentLang,
    "en"
  );

  return (
    <>
      <Helmet>
        <title>{localizedName || "Project"} | Shiro Real Estate</title>
      </Helmet>

      <div
        className={`w-full min-h-screen bg-white ${
          isRTL ? "rtl text-right" : "ltr text-left"
        }`}
      >
        {/* Hero Image */}
        {projects?.project_main_image && (
          <section className="relative w-full h-[91vh]">
            <img
              src={ImagesUrl(projects.project_main_image)}
              alt={localizedName}
              className="w-full h-full object-cover"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

            <div
              className="
                custom_container
                absolute bottom-14 left-1/2 -translate-x-1/2 
                flex flex-col items-center text-center gap-5 text-white
                sm:bottom-18
                md:bottom-28 md:left-0 md:translate-x-0 md:items-start md:text-left
              "
            >
              <h1 className="hidden md:block w-full lg:w-[100%] font-bold !text-white drop-shadow-lg tracking-wide leading-tight content_general project_text">
                {localizedName}
              </h1>

              <p className="text-sm sm:text-base">
                <span className="text-white text-xl">by</span>{" "}
                <span className="font-semibold text-white text-xl">
                  {localizedDeveloperName}
                </span>
              </p>

              <button
        onClick={() => {
   window.location.href = `${import.meta.env.VITE_API_URL}/download-brochure`;
  }}


                className="
                  w-full bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 border-radius shadow-lg hover:shadow-xl cursor-pointer transition
                "
              >
                {t("Download Brochure")}
              </button>
            </div>
          </section>
        )}

        {/* ✅ Sticky Tabs */}
        <StickySectionTabs tabs={sectionTabs} offsetTopClass="top-0" />

        {/* ✅ SECTIONS */}
        <section className="py-10 md:py-14 lg:py-16">
          {/* DETAILS */}
          <div id="details" className="scroll-mt-28 custom_container">
           <div className="mb-8">
             <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
               {t("About the Project")}
              </h1>
           </div>
          <div className="grid grid-cols-12 gap-10 items-start">
  {/* LEFT */}
  <div className="col-span-12 md:col-span-8">
    {localizedDescription && (
      <div
        className="down_styling para_styling"
        dangerouslySetInnerHTML={{ __html: localizedDescription }}
      />
    )}
  </div>

  {/* RIGHT (tight box like image 1) */}
  <div className="col-span-12 md:col-span-4">
    <div className="ml-auto w-full md:w-[360px] text-left">
      {projects?.logo && (
        <div className="w-full h-[70px] flex justify-end mb-2">
          <img
            src={ImagesUrl(projects.logo)}
            alt={localizedName}
            className="h-full object-contain"
          />
        </div>
      )}

      {/* Stats box like image 1 */}
      <div className="space-y-8">
       {projects && projects.project_starting_price &&  <div>
          <div className="text-xs tracking-widest text-gray-400 right_details_info">
            {t("Starting Price")}
          </div>
          <div className="font-semibold text-primary text-4xl text-[#0B2B1C] mt-3">
            {projects.project_starting_price}
          </div>
          <div className="h-px bg-gray-200 mt-6" />
        </div>}

        {projects && projects.project_handover && <div>
          <div className="text-xs tracking-widest text-gray-400 right_details_info">
            {t("Handover")}
          </div>
          <div className="font-semibold text-primary text-4xl text-[#0B2B1C] mt-3">
            {projects.project_handover}
          </div>
          <div className="h-px bg-gray-200 mt-6" />
        </div>}

        {projects && projects.project_payment_plan && <div>
          <div className="text-xs tracking-widest text-gray-400 right_details_info">
            {t("Payment Plan")}
          </div>
          <div className="font-semibold text-primary text-4xl text-[#0B2B1C] mt-3">
            {projects.project_payment_plan}
          </div>
        </div>}
      </div>
    </div>
  </div>
</div>

          </div>

          {/* GALLERY */}
         <div id="gallery" className="scroll-mt-28 custom_container">
           <div className="mt-8">
             <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
               {t("Gallery")}
              </h1>
           </div>
          <div className="grid grid-cols-12 items-start">
  <div className="col-span-12 md:col-span-12">
 {projects?.images?.length > 0 && (
<Gallery images={projects?.images || []} />
)}

  </div>
</div>

          </div>

            {/* Unique Selling Point */}
         <div id="selling_point" className="scroll-mt-28">
           {/* <div className="mt-8">
             <h1 className="custom_container hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
               {t("Unique Selling Point")}
              </h1>
           </div> */}
          <div className="grid grid-cols-12 items-start">
  <div className="col-span-12 md:col-span-12">
 {projects?.unique_selling_points?.length > 0 && (
<UniqueSellingPointsSection unique_selling_points={projects?.unique_selling_points[0] || []} />
)}

  </div>
</div>

          </div>

          {/* FLOOR PLANS */}
        
             <div id="floorPlans" className="scroll-mt-28 custom_container floor_plan_styling">
           <div className="mt-8 mb-8">
             <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
                 {t("Floor Plans")}
              </h1>
           </div>
          <div className="grid grid-cols-12 items-start">
  <div className="col-span-12 md:col-span-12">
 {projects?.floorplans?.length > 0 && (
<ProjectFloorPlan floorplans={projects?.floorplans || []} />
)}

  </div>
</div>

          </div>

          {/* AMENITIES */}
           <div id="amenities" className="scroll-mt-28 custom_container">
           <div className="mt-8 mb-8">
             <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
               {t("Amenities")}
              </h1>
           </div>
          <div className="grid grid-cols-12 items-start">
  <div className="col-span-12 md:col-span-12">
 {projects?.amenities?.length > 0 && (
<ProjectAmenities amenities={projects?.amenities || []} />
)}

  </div>
</div>

          </div>

            {/* Project Location */}
         <div id="location" className="scroll-mt-28 floor_plan_styling">
           {/* <div className="mt-8">
             <h1 className="custom_container hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
               {projects.name} {t("Location")}
              </h1>
           </div> */}
          <div className="grid grid-cols-12 items-start">
  <div className="col-span-12 md:col-span-12">
 {projects?.location?.length > 0 && (
<ProjectLocationSection project_location={projects?.location[0] || []} />
)}

  </div>
</div>

          </div>

          {/* PAYMENT PLANS */}
             <div id="paymentPlans" className="scroll-mt-28 custom_container">
           <div className="mt-8 ">
             <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
                {localizedName} {t("Payment Plans")}
              </h1>
           </div>
          <div className="grid grid-cols-12 items-start">
  <div className="col-span-12 md:col-span-12">
 {projects?.payment_plans?.length > 0 && (
<ProjectPaymentPlan payment_plans={projects?.payment_plans || []} project_payment_plan_description={projects?.project_payment_plan_description || ""} 
onButtonClick={() => {
    const el = document.getElementById("contactForm");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }} />
)}

  </div>
</div>

          </div>

          {/* FAQ */}
            {projects?.faqs?.length > 0 && (<div id="faq" className="scroll-mt-28 custom_container half_padding_up">
           <div className="mt-8 mb-8">
             <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
                {t("Useful Information About ")} {localizedName}
              </h1>
           </div>
          <div className="grid grid-cols-12 items-start">
  <div className="col-span-12 md:col-span-12">
<ProjectFaq faqs={projects?.faqs || []} />

  </div>
</div>

          </div>)}

          {/* Projects section (your existing) */}
          {projects.length > 0 && (
            <section
              className="w-full py-12 md:py-4 lg:py-6 explore_properties_styling"
              style={{ marginBottom: 0, paddingBottom: 0 }}
            >
              <div className="mx-auto">
                <div className="mb-8 md:mb-8">
                  <h2 className="hidden md:block w-full lg:w-[100%] text-[24px] sm:text-[28px] md:text-[32px] lg:text-[40px] font-bold text-white tracking-wide leading-tight content_general">
                    {t("Projects by ")} {localizedName}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {projects.map((project: any, index: number) => {
                    const projectName = getLocalizedValue(
                      project.name,
                      currentLang,
                      "en"
                    );
                    const projectCommunity = getLocalizedValue(
                      project.community_name,
                      currentLang,
                      "en"
                    );
                    const projectDescription = getLocalizedValue(
                      project.description,
                      currentLang,
                      "en"
                    );

                    return (
                      <div
                        key={project.id || index}
                        onClick={() => handleClick(project.slug)}
                        className="group bg-white change_border border border-gray-100 overflow-hidden h-full flex flex-col transition-transform duration-300 cursor-pointer"
                      >
                        {project.project_main_image && (
                          <div className="group bg-white change_border border border-gray-100 transition-all duration-300 overflow-hidden relative flex flex-col">
                            <img
                              src={ImagesUrl(project.project_main_image)}
                              alt={projectName}
                              className="transition-transform duration-500 group-hover:scale-110 w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-cover"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}

                        <div className="p-4 md:p-5 flex flex-col gap-2">
                          <h3 className="font-semibold text-primary text-xl">
                            {projectName}
                          </h3>

                          {projectCommunity && (
                            <div
                              className="flex items-center gap-2 text-gray-600"
                              style={{ marginBottom: 0 }}
                            >
                              <Icons.CiLocationOn
                                size={16}
                                className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]"
                              />
                              <span className="rounded-lg text-sm transition-all duration-200 mb-1 mt-1 text-[#9f8151] text_stying">
                                {projectCommunity}
                              </span>
                            </div>
                          )}

                          {projectDescription && (
                            <p
                              className="leading-relaxed line-clamp-3 rounded-lg text-sm transition-all duration-200 mb-1 text-primary"
                              dangerouslySetInnerHTML={{
                                __html: projectDescription,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </section>

        <div className="half_padding_bottom" id="contactForm">
          <ContactForm />
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
