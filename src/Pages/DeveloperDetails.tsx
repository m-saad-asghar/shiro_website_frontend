import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import ImagesUrl from "@/helpers/ImagesURL";
import { useTranslation } from "react-i18next";
import { ContactForm } from "@/Sections/Home";
import Icons from "@/Constants/Icons";
import { MdOutlineCalendarMonth, MdOutlineEmail } from "react-icons/md";

const SingleDeveloperServices = {
  async fetchDeveloperBySlug(slug: string) {
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = `${baseUrl}/fetch_projects_from_developer/${slug}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to Fetch Developer, Status Code: ${response.status}`
      );
    }
    return await response.json();
  },
};

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

const formatStartingPrice = (price: any) => {
  if (price === null || price === undefined) return "";
  const str = String(price).trim();
  if (!str) return "";

  if (/[a-zA-Z]/.test(str)) return str;

  const num = Number(str.replace(/,/g, ""));
  if (!Number.isFinite(num)) return str;

  return num.toLocaleString();
};

// ✅ FIX: WhatsApp expects digits only (no +, no spaces)
const cleanPhoneForWhatsApp = (phone: string) => phone.replace(/[^\d]/g, "");

const DeveloperDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  const [developerData, setDeveloperData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentLang = useMemo(
    () => (i18n.language || "en").split("-")[0],
    [i18n.language]
  );

  // ✅ Fixed contact destinations (as you requested)
  const CALL_NUMBER = "+97145776496";
  const WHATSAPP_NUMBER = "+971588888461";
  const EMAIL_TO = "enquiry@shiroestate.ae";
  const EMAIL_SUBJECT = "Project Inquiry";

  const handleProjectClick = (projectSlug: string) => {
    if (!projectSlug) return;
    navigate(`/projects/${projectSlug}`);
  };

  // ✅ Prefilled message (WhatsApp + Email)
  const buildInquiryMessage = (params: {
    projectName: string;
    communityName: string;
    developerName: string;
    price: string;
  }) => {
    const { projectName, communityName, developerName, price } = params;
    return `Hello, I am interested in Project ${projectName} in ${communityName} by ${developerName} with price ${price}`;
  };

  const onCallClick = () => {
    window.location.href = `tel:${CALL_NUMBER}`;
  };

  const onWhatsAppClick = (message: string) => {
    const number = cleanPhoneForWhatsApp(WHATSAPP_NUMBER);
    const msg = encodeURIComponent(message);
    window.open(`https://wa.me/${number}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const onEmailClick = (message: string) => {
    const subject = encodeURIComponent(EMAIL_SUBJECT);
    const body = encodeURIComponent(message);
    const mailto = `mailto:${EMAIL_TO}?subject=${subject}&body=${body}`;
    window.open(mailto, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    SingleDeveloperServices.fetchDeveloperBySlug(slug)
      .then((data) => setDeveloperData(data))
      .catch((err: any) => {
        console.error("Error fetching developer:", err);
        setError(err.message || "Something went wrong");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-600 text-lg">Loading Developer…</span>
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

  const developer = developerData?.developer;
  const projects = developerData?.projects || [];

  const localizedName = getLocalizedValue(developer?.name, currentLang, "en");
  const localizedDescription = getLocalizedValue(
    developer?.description,
    currentLang,
    "en"
  );

  return (
    <>
      <Helmet>
        <title>{localizedName || "Developer"} | Shiro Real Estate</title>
      </Helmet>

      <div
        className={`w-full min-h-screen bg-white ${
          isRTL ? "rtl text-right" : "ltr text-left"
        }`}
      >
        <section className="custom_container py-14 md:py-18 lg:py-22 developer_details_styling">
          <div>
            <h1
              style={{ paddingBottom: 15 }}
              className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white tracking-wide leading-tight content_general"
            >
              {localizedName}
            </h1>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-6">
                {localizedDescription && (
                  <p
                    className="down_styling para_styling"
                    dangerouslySetInnerHTML={{ __html: localizedDescription }}
                  />
                )}
              </div>

              <div className="col-span-12 md:col-span-6 flex justify-end text-right developer_logo_styling">
                <div className="w-full flex justify-end">
                  {developer?.logo && (
                    <div className="h-[60px] w-auto">
                      <img
                        src={ImagesUrl(developer.logo)}
                        alt={localizedName}
                        className="h-[60px] w-auto object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "/src/assets/Images/Property/placeholder-property.jpg";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

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
                    const projectName =
                      getLocalizedValue(project?.name, currentLang, "en") || "-";

                    const projectCommunity =
                      getLocalizedValue(
                        project?.project_community_name ??
                          project?.community_name,
                        currentLang,
                        "en"
                      ) || "-";

                    const startingPrice = formatStartingPrice(
                      project?.project_starting_price ?? project?.starting_price
                    );

                    const priceText =
                      startingPrice?.trim() ? `${startingPrice}` : "-";

                    const handoverYear =
                      project?.project_handover ??
                      project?.handover_year ??
                      project?.handover ??
                      "";

                    const message = buildInquiryMessage({
                      projectName,
                      communityName: projectCommunity,
                      developerName: localizedName || "-",
                      price: priceText,
                    });

                    return (
                      <div
                        key={project?.id || index}
                        style={{ minHeight: 600 }}
                        onClick={() => handleProjectClick(project?.slug)}
                        className="group bg-white change_border border border-primary/20 transition-all duration-300 overflow-hidden relative flex flex-col cursor-pointer"
                      >
                        <div className="relative overflow-hidden w-full h-[300px]">
                          {project?.project_main_image ? (
                            <img
                              src={ImagesUrl(project.project_main_image)}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              alt={projectName || "Project image"}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "/src/assets/Images/Property/placeholder-property.jpg";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <div className="text-center">
                                <Icons.IoImageOutline
                                  size={48}
                                  className="text-gray-400 mx-auto mb-2"
                                />
                                <p className="text-gray-500 text-sm">
                                  {t("No images available")}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* {handoverYear ? (
                            <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-full text-xs font-semibold shadow-lg text-primary">
                              {t("Handover")}: {handoverYear}
                            </div>
                          ) : null} */}
                        </div>

                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div className="space-y-4">
                            <h1
                              className="font-semibold text-primary text-2xl"
                              style={{ marginBottom: 5 }}
                            >
                              {projectName}
                            </h1>

                            {startingPrice && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <span className="font-semibold rounded-lg text-sm transition-all duration-200 text-[#9f8151] text_styling">
                                  {t("Starting from")}: {startingPrice}
                                </span>
                              </div>
                            )}

                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Icons.CiLocationOn
                                  size={18}
                                  className="text-primary rounded-lg text-sm transition-all duration-200 !text-[#9f8151]"
                                />
                                <span className="rounded-lg text-sm transition-all duration-200 text-[#9f8151] text_styling">
                                  {projectCommunity}
                                </span>
                              </div>

                              {handoverYear ? (
                                <div className="flex items-center gap-2 md:justify-end">
                                  <MdOutlineCalendarMonth
                                    size={18}
                                    className="text-[#0b4a35]"
                                  />
                                  <span className="rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                                    {t("Handover")} {handoverYear}
                                  </span>
                                </div>
                              ) : null}
                            </div>

                            {project?.description ? (
                              <p
                                className="leading-relaxed line-clamp-3 rounded-lg text-sm transition-all duration-200 mb-1 text-gray-600"
                                dangerouslySetInnerHTML={{
                                  __html: getLocalizedValue(
                                    project?.description,
                                    currentLang,
                                    "en"
                                  ),
                                }}
                              />
                            ) : null}
                          </div>

                          {/* ✅ CONTACT BUTTONS */}
                          <div
                            className="down_direction grid gap-4 pt-4 grid-cols-3 relative z-50"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                onCallClick();
                              }}
                              className="min-w-[100px] md:min-w-[110px] flex items-center justify-center gap-2 search_btn_styling h-12 md:h-10 px-6 bg-[#f1ece0] hover:bg-[#9f8151] hover:text-white text-[#0b4a35] font-semibold transition-all duration-[.4s]"
                              style={{ borderRadius: 8 }}
                              aria-label="Call"
                            >
                              <Icons.LuPhone size={18} />
                              {t("Call")}
                            </button>

                            <button
                              type="button"
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                onWhatsAppClick(message);
                              }}
                              className="min-w-[100px] md:min-w-[110px] flex items-center justify-center gap-2 search_btn_styling h-12 md:h-10 px-6 bg-[#f1ece0] hover:bg-[#9f8151] hover:text-white text-[#0b4a35] font-semibold transition-all duration-[.4s]"
                              style={{ borderRadius: 8 }}
                              aria-label="WhatsApp"
                            >
                              <Icons.FaWhatsapp size={18} className="shrink-0" />
                              {t("WhatsApp")}
                            </button>

                            <button
                              type="button"
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEmailClick(message);
                              }}
                              className="min-w-[100px] md:min-w-[110px] flex items-center justify-center gap-2 search_btn_styling h-12 md:h-10 px-6 bg-[#f1ece0] hover:text-white hover:bg-[#9f8151] text-[#0b4a35] font-semibold transition-all duration-[.4s]"
                              style={{ borderRadius: 8 }}
                              aria-label="Email"
                            >
                              <MdOutlineEmail size={18} className="shrink-0" />
                              {t("Email")}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </section>

        <ContactForm display_name="contact-us-form-via-developers-details-page-of-website"/>
      </div>
    </>
  );
};

export default DeveloperDetails;
