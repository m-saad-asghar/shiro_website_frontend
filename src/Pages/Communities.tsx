import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import ImagesUrl from "@/helpers/ImagesURL";
import { useTranslation } from "react-i18next";
import { ContactForm } from "@/Sections/Home";
import Icons from "@/Constants/Icons";


// Simple service using fetch
const SingleCommunityServices = {
  async fetchCommunityBySlug(slug: string) {
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = `${baseUrl}/fetch_community_data/${slug}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to Fetch Data, Status Code: ${response.status}`);
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

const Communities = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  const [communityData, setCommunityData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ handleClick INSIDE component so it can use navigate
  const handleClick = (communitySlug: string) => {
    // if (!communitySlug) return;
    // navigate(`/projects/${communitySlug}`);
  };

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    SingleCommunityServices.fetchCommunityBySlug(slug)
      .then((data) => {
        setCommunityData(data);
      })
      .catch((err: any) => {
        console.error("Error Fetching Community, Status Code:", err);
        setError(err.message || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-600 text-lg">Loading Community</span>
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

  const community = communityData?.community;
  const projects = communityData?.projects || [];

  const currentLang = (i18n.language || "en").split("-")[0];

  const localizedName = getLocalizedValue(community?.name, currentLang, "en");
  const localizedDescription = getLocalizedValue(
    community?.description,
    currentLang,
    "en"
  );

  return (
    <>
      <Helmet>
        <title>{localizedName || "Community"} | Shiro Real Estate</title>
      </Helmet>

      <div
        className={`w-full min-h-screen bg-white ${
          isRTL ? "rtl text-right" : "ltr text-left"
        }`}
      >
        {/* Hero Image */}
        {community?.community_main_image && (
          <section className="w-full h-[92vh]">
            <img
              src={ImagesUrl(community.community_main_image)}
              alt={localizedName}
              className="w-full h-full"
            />
          </section>
        )}

        {/* Developer heading + description */}
        <section className="custom_container py-14 md:py-18 lg:py-22">
          <div>
            <h1
              style={{ paddingBottom: 15 }}
              className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white tracking-wide leading-tight content_general"
            >
              {localizedName}
            </h1>

            {localizedDescription && (
              <p
                className="down_styling para_styling"
                dangerouslySetInnerHTML={{ __html: localizedDescription }}
              />
            )}
          </div>

          {/* Projects section */}
          {projects.length > 0 && (
            <section
              className="w-full py-12 md:py-4 lg:py-6 explore_properties_styling"
              style={{ marginBottom: 0, paddingBottom: 0 }}
            >
              <div className="mx-auto">
                {/* Header */}
                <div className="mb-8 md:mb-8">
                  <h2 className="hidden md:block w-full lg:w-[100%] text-[24px] sm:text-[28px] md:text-[32px] lg:text-[40px] font-bold text-white tracking-wide leading-tight content_general">
                    {t("Projects by ")} {localizedName}
                  </h2>
                </div>

                {/* Grid of cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {projects.map((project: any, index: number) => {
                    const projectName = getLocalizedValue(
                      project.name,
                      currentLang,
                      "en"
                    );
                     const projectCommunity = getLocalizedValue(
                      community.name,
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
                        {/* Image with hover zoom */}
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

                        {/* Text content */}
                        <div className="p-4 md:p-5 flex flex-col gap-2">
                          <h3 className="font-semibold text-primary text-xl">
                            {projectName}
                          </h3>

                            {projectCommunity && (
                            <div className="flex items-center gap-2 text-gray-600" style={{marginBottom: 0}}>
                                        <Icons.CiLocationOn
                                          size={16}
                                          className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]"
                                        />
                                        <span className="rounded-lg text-sm transition-all duration-200 mb-1 mt-1 text-[#9f8151] text_stying">{projectCommunity}</span>
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

        <ContactForm display_name="contact-us-form-via-communities-page-of-website"/>
      </div>
    </>
  );
};

export default Communities;