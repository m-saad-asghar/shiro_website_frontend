import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImagesUrl from "@/helpers/ImagesURL";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";
import { MdOutlineCalendarMonth, MdOutlineEmail } from "react-icons/md";

type ProjectsByCommunityProps = {
  community_name: string; // ✅ comes from parent
  title?: string; // optional section title override
};

const ProjectsByCommunityServices = {
  async fetchProjectsByCommunityName(community_name: string) {
    const baseUrl = import.meta.env.VITE_API_URL;

    const params = new URLSearchParams({
      community_name,
    });

    const url = `${baseUrl.replace(/\/$/, "")}/fetch_projects_from_community?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch projects, Status Code: ${response.status}`
      );
    }

    return await response.json();
  },
};

// const ProjectsByCommunityServices = {
//   async fetchProjectsByCommunityName(community_name: string) {
//     const baseUrl = import.meta.env.VITE_API_URL;
//     const url = `${baseUrl.replace(/\/$/, "")}/fetch_projects_from_community`;

//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ community_name }), // ✅ send same key
//     });

//     if (!response.ok) {
//       throw new Error(
//         `Failed to fetch projects, Status Code: ${response.status}`
//       );
//     }

//     return await response.json();
//   },
// };

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

const cleanPhoneForWhatsApp = (phone: string) => phone.replace(/[^\d]/g, "");

const ProjectsByCommunity = ({ community_name, title }: ProjectsByCommunityProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  const [apiData, setApiData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentLang = useMemo(
    () => (i18n.language || "en").split("-")[0],
    [i18n.language]
  );

  // Contact destinations
  const CALL_NUMBER = "+97145776496";
  const WHATSAPP_NUMBER = "+971588888461";
  const EMAIL_TO = "enquiry@shiroestate.ae";
  const EMAIL_SUBJECT = "Project Inquiry";

  const handleProjectClick = (projectSlug: string) => {
    if (!projectSlug) return;
    navigate(`/projects/${projectSlug}`);
  };

  const buildInquiryMessage = (params: {
    projectName: string;
    communityName: string;
    price: string;
  }) => {
    const { projectName, communityName, price } = params;
    return `Hello, I am interested in Project ${projectName} in ${communityName} with price ${price}`;
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

  // ✅ fetch on community_name change
  useEffect(() => {
    if (!community_name) return;

    setLoading(true);
    setError(null);

    ProjectsByCommunityServices.fetchProjectsByCommunityName(community_name)
      .then((data) => setApiData(data))
      .catch((err: any) => {
        console.error("Error fetching projects:", err);
        setError(err.message || "Something went wrong");
      })
      .finally(() => setLoading(false));
  }, [community_name]);

  if (loading) {
    return (
      <div className="w-full py-10 flex items-center justify-center">
        <span className="text-gray-600 text-lg">{t("Loading Projects…")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-10 flex items-center justify-center">
        <span style={{color: "#9f8151"}} className="text-lg">
          {t("Error")}: {error}
        </span>
      </div>
    );
  }

  const community = apiData?.data?.community || apiData?.community;
  const projects = apiData?.data?.projects || apiData?.projects || [];

  if (!Array.isArray(projects) || projects.length === 0) return null;

  const communityDisplayName =
    getLocalizedValue(community?.name, currentLang, "en") ||
    community?.name ||
    community_name;

  const sectionTitle = title || `${t("Off-Plan Projects in")} ${communityDisplayName}`;

  return (
    <section
      className={`w-full py-12 md:py-4 lg:py-6 explore_properties_styling ${
        isRTL ? "rtl text-right" : "ltr text-left"
      }`}
      style={{ marginBottom: 0, paddingBottom: 0 }}
    >
      <div className="mx-auto">
        <div className="mb-8 md:mb-8">
          <h2 className="hidden md:block w-full lg:w-[100%] text-[24px] sm:text-[28px] md:text-[32px] lg:text-[40px] font-bold text-white tracking-wide leading-tight content_general">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project: any, index: number) => {
            const projectName =
              getLocalizedValue(project?.name, currentLang, "en") || "-";

            const projectCommunity =
              getLocalizedValue(
                project?.project_community_name ?? project?.community_name,
                currentLang,
                "en"
              ) || communityDisplayName;

            const startingPrice = formatStartingPrice(
              project?.project_starting_price ?? project?.starting_price
            );

            const priceText = startingPrice?.trim() ? `${startingPrice}` : "-";

            const handoverYear =
              project?.project_handover ??
              project?.handover_year ??
              project?.handover ??
              "";

            const message = buildInquiryMessage({
              projectName,
              communityName: projectCommunity,
              price: priceText,
            });

            const imgSrc = project?.project_main_image
              ? ImagesUrl(project.project_main_image)
              : "";

            return (
              <div
                key={project?.id || index}
                style={{ minHeight: 600 }}
                onClick={() => handleProjectClick(project?.slug)}
                className="group bg-white change_border border border-primary/20 transition-all duration-300 overflow-hidden relative flex flex-col cursor-pointer"
              >
                <div className="relative overflow-hidden w-full h-[300px]">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={projectName || "Project image"}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
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
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h1 className="font-semibold text-primary text-2xl" style={{ marginBottom: 5 }}>
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
                          <MdOutlineCalendarMonth size={18} className="text-[#0b4a35]" />
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
                          __html: getLocalizedValue(project?.description, currentLang, "en"),
                        }}
                      />
                    ) : null}
                  </div>

                  {/* CONTACT BUTTONS */}
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
  );
};

export default ProjectsByCommunity;