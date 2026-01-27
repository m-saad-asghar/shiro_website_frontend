import ImagesUrl from "@/helpers/ImagesURL";
import Icons from "@/Constants/Icons";
import { useMemo, type FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/Components/ui/skeleton";
import { MdOutlineCalendarMonth, MdOutlineEmail } from "react-icons/md";

type ProjectItem = {
  id?: number;
  name: any;
  slug: string;
  description?: any;
  project_main_image?: string | null;
  project_community_name?: any;
  project_starting_price?: any;
  project_handover?: any;

  // fallback keys
  main_image?: string | null;
  community_name?: any;
  starting_price?: any;
  handover?: any;
};

type AllProjectsProps = {
  // ✅ can be: ProjectItem[] OR { projects: ProjectItem[] }
  data?: any;
  status: "pending" | "success" | "error" | "loading" | "idle";
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  onClearSearch?: () => void;
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

const cleanPhoneForWhatsApp = (phone: string) => phone.replace(/[^\d]/g, "");

const AllProjects: FC<AllProjectsProps> = ({
  data,
  status,
  searchValue,
  onSearchChange,
  onClearSearch,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // ✅ Normalize API response to an array
  const safeData: ProjectItem[] = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.projects)) return data.projects;
    if (Array.isArray(data?.data?.projects)) return data.data.projects; // in case wrapper exists
    return [];
  }, [data]);

  const parentValue = typeof searchValue === "string" ? searchValue : "";
  const [inputValue, setInputValue] = useState<string>(parentValue);

  useEffect(() => {
    setInputValue(parentValue);
  }, [parentValue]);

  const currentLang = useMemo(
    () => (i18n.language || "en").split("-")[0],
    [i18n.language]
  );

  // ✅ Fixed contact destinations
  const CALL_NUMBER = "+97145776496";
  const WHATSAPP_NUMBER = "+971588888461";
  const EMAIL_TO = "enquiry@shiroestate.ae";
  const EMAIL_SUBJECT = "Project Inquiry";

  const onCallClick = () => {
    window.location.href = `tel:${CALL_NUMBER}`;
  };

  const onWhatsAppClick = (message: string) => {
    const number = cleanPhoneForWhatsApp(WHATSAPP_NUMBER);
    const msg = encodeURIComponent(message);
    window.open(
      `https://wa.me/${number}?text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const onEmailClick = (message: string) => {
    const subject = encodeURIComponent(EMAIL_SUBJECT);
    const body = encodeURIComponent(message);
    const mailto = `mailto:${EMAIL_TO}?subject=${subject}&body=${body}`;
    window.open(mailto, "_blank", "noopener,noreferrer");
  };

  const handleProjectClick = (projectSlug: string) => {
    if (!projectSlug) return;
    navigate(`/projects/${projectSlug}`);
  };

  const buildInquiryMessage = (params: {
    projectName: string;
    communityName: string;
    developerName: string;
    price: string;
  }) => {
    const { projectName, communityName, developerName, price } = params;
    return `Hello, I am interested in Project ${projectName} in ${communityName} by ${developerName} with price ${price}`;
  };

  // ✅ More robust skeleton condition
  const showSkeleton = status !== "success";

  const renderSkeltonCard = useMemo(() => {
    return [...Array(8)].map((_, index: number) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        <Skeleton className="h-80 w-full rounded-2xl bg-gray-200" />
      </motion.div>
    ));
  }, []);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    onSearchChange?.(val);
  };

  const handleClear = () => {
    setInputValue("");
    if (onClearSearch) onClearSearch();
    else onSearchChange?.("");
  };

  return (
    <div className="custom_container mx-auto px-4">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <h1 style={{paddingBottom: 15}} className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
          {t("Exclusive Property Projects")}
        </h1>

        <p className="down_styling para_styling">
          {t(
            "Explore Dubai’s dynamic real estate landscape through our curated projects, highlighting the city’s most sought-after communities, key landmarks, and lifestyle amenities. Discover premium residential developments and find the ideal property that matches your lifestyle and investment goals."
          )}
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="mb-10 flex">
        <div className="w-full md:w-1/2 bg-white border border-primary/20 change_border px-4 py-3 md:py-4 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m1.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t("Search Projects...")}
            className="w-full text-sm md:text-base outline-none bg-transparent"
          />

          {inputValue.length > 0 && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 px-2"
              aria-label="Clear search"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {showSkeleton ? (
          renderSkeltonCard
        ) : (
          safeData.map((project: ProjectItem, index: number) => {
            const projectName =
              getLocalizedValue(project?.name, currentLang, "en") || "-";

            const projectCommunity =
              getLocalizedValue(
                project?.project_community_name ?? project?.community_name,
                currentLang,
                "en"
              ) || "-";

            const startingPrice = formatStartingPrice(
              project?.project_starting_price ?? project?.starting_price
            );

            const priceText = startingPrice?.trim() ? `${startingPrice}` : "-";

            const handoverYear =
              project?.project_handover ?? project?.handover ?? "";

            const projectImage =
              project?.project_main_image ?? project?.main_image ?? null;

            const message = buildInquiryMessage({
              projectName,
              communityName: projectCommunity,
              developerName: "Shiro Real Estate",
              price: priceText,
            });

            return (
              <div
                key={project?.id || project?.slug || index}
                style={{ minHeight: 600 }}
                onClick={() => handleProjectClick(project?.slug)}
                className="group bg-white change_border border border-primary/20 transition-all duration-300 overflow-hidden relative flex flex-col cursor-pointer"
              >
                <div className="relative overflow-hidden w-full h-[300px]">
                  {projectImage ? (
                    <img
                      src={ImagesUrl(projectImage)}
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
          })
        )}
      </div>

      {/* Empty State */}
      {status === "success" && safeData.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <h3 className="font-semibold text-primary text-xl !text-[#9f8151]">
            {t("No Projects Found")}
          </h3>
          <p className="!text-[14px] text-dark leading-relaxed !text-[#0b4a35] down_styling !leading-normal">
            {t("Try adjusting your search criteria to find more projects")}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AllProjects;