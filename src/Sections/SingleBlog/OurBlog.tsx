import { Bennar } from "@/Components";
import ImagesUrl from "@/helpers/ImagesURL";
import formatDate from "@/helpers/formatDate";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/Utils/Motions/motion";
import Icons from "@/Constants/Icons";
import { toast } from "sonner";
import type { FC } from "react";
import useBlogCategories from "@/hooks/useBlogCategories";

type OurBlogProps = {
  item: {
    title?: string;
    description?: string;
    created_at?: string;
    main_image?: string;
    blog_category_id?: number;
    tags?: string;
  };
};

const OurBlog: FC<OurBlogProps> = ({ item }) => {
  // If data is not available, show message
  if (!item) {
    return (
      <div className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No blog content available
            </h2>
            <p className="text-gray-600">
              The blog post content could not be loaded.
            </p>
          </div>
        </div>
      </div>
    );
  }
  const { t, i18n } = useTranslation();
  const { getCategoryName } = useBlogCategories();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Share on social media
  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const title = item?.title || "";

    let shareUrl = "";
    let message = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        message = t("Shared on Facebook successfully!");
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        message = t("Shared on X (Twitter) successfully!");
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        message = t("Shared on LinkedIn successfully!");
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          title + " " + url
        )}`;
        message = t("Shared on WhatsApp successfully!");
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        message = t("Shared on Telegram successfully!");
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        message = t("Link copied to clipboard!");
        break;
    }

    // Close share menu
    setShowShareMenu(false);

    // Show toast notification
    if (message) {
      toast(message, {
        style: {
          fontSize: "16px",
          color: "#094834",
          backgroundColor: "#ffffff",
          border: "1px solid #d3c294",
        },
        duration: 3000,
      });
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="w-full">
      <Bennar
        pathName=""
        title={item?.title || ""}
        desc={formatDate(item?.created_at || "", i18n.language)}
        conClassName="w-full max-w-4xl"
        titleClassName="text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
        hideBreadcrumb={true}
      >
        <motion.div
          initial="initial"
          whileInView="animate"
          className="w-full space-y-8"
        >
          {/* Main article image */}
          <motion.div
            variants={fadeIn}
            className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={ImagesUrl(item?.main_image || "")}
              alt={item?.title || ""}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            {/* Share button */}
            <div className="absolute top-6 right-6">
              <div className="relative" ref={shareMenuRef}>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="bg-white/90 backdrop-blur-sm hover:bg-white text-[#094834] p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  <Icons.IoShareSocial className="w-5 h-5" />
                </button>

                {/* Share menu */}
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 min-w-[200px] z-[9998]"
                  >
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-[#094834] mb-3 text-center">
                        {t("Share Article")}
                      </h4>

                      <button
                        onClick={() => shareOnSocial("facebook")}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Icons.FaFacebook className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Facebook
                        </span>
                      </button>

                      <button
                        onClick={() => shareOnSocial("twitter")}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                          <Icons.FaXTwitter className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          X (Twitter)
                        </span>
                      </button>

                      <button
                        onClick={() => shareOnSocial("linkedin")}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                          <Icons.FaLinkedin className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          LinkedIn
                        </span>
                      </button>

                      <button
                        onClick={() => shareOnSocial("whatsapp")}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Icons.FaWhatsapp className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {t("WhatsApp")}
                        </span>
                      </button>

                      <button
                        onClick={() => shareOnSocial("telegram")}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Icons.FaTelegramPlane className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Telegram
                        </span>
                      </button>

                      <div className="border-t border-gray-200 pt-3">
                        <button
                          onClick={() => shareOnSocial("copy")}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        >
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <Icons.IoLink className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {t("Copy Link")}
                          </span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Article information */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-[#094834]/5 to-[#d3c294]/10 rounded-2xl border border-[#094834]/10"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#094834]">
                <Icons.IoCalendarOutline className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {formatDate(item?.created_at || "", i18n.language)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#094834]">
                <Icons.IoTimeOutline className="w-5 h-5" />
                <span className="text-sm font-medium">5 min read</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-[#094834] text-white text-xs font-semibold px-3 py-1 rounded-full">
                {getCategoryName(item?.blog_category_id)}
              </span>
              {item?.tags && (
                <span className="bg-[#d3c294] text-[#094834] text-xs font-semibold px-3 py-1 rounded-full">
                  {item.tags.split(",")[0] || t("Property Insights")}
                </span>
              )}
            </div>
          </motion.div>

          {/* Article content */}
          <motion.div
            variants={fadeIn}
            className={`prose prose-lg max-w-none ${
              item?.description?.includes("<h3>")
                ? "text-[#094834]"
                : "text-gray-700"
            }`}
          >
            <div
              className="leading-relaxed text-base md:text-lg space-y-6"
              dangerouslySetInnerHTML={{ __html: item?.description || "" }}
            />
          </motion.div>

          {/* Bottom share bar */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-[#094834]/5 to-[#d3c294]/10 rounded-2xl border border-[#094834]/10"
          >
            <div className="flex items-center gap-2 text-[#094834]">
              <Icons.IoHeartOutline className="w-5 h-5" />
              <span className="text-sm font-medium">
                {t("Found this helpful?")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#094834]">
                {t("Share:")}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => shareOnSocial("facebook")}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer"
                >
                  <Icons.FaFacebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => shareOnSocial("twitter")}
                  className="w-10 h-10 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer"
                >
                  <Icons.FaXTwitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => shareOnSocial("linkedin")}
                  className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer"
                >
                  <Icons.FaLinkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => shareOnSocial("whatsapp")}
                  className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer"
                >
                  <Icons.FaWhatsapp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Bennar>
    </div>
  );
};

export default OurBlog;
