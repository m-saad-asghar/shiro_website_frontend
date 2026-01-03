import { useMemo } from "react";
import { DeveloperPartners } from "@/assets/Data/Home";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// TypeScript declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params: Record<string, unknown>
    ) => void;
  }
}

type PartnersProps = {
  conClass?: string;
};

const Partners: React.FC<PartnersProps> = ({ conClass }) => {
  const { t } = useTranslation();

  // All partners from data
  const allPartners = useMemo(() => DeveloperPartners(), []);

  // Schema markup for SEO
  const partnerSchema = useMemo(() => {
    const partnersWithWebsites = allPartners.filter(
      (partner) => partner.website
    );
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Shiro Estate",
      url: "https://shiroestate.com",
      description:
        "Leading real estate agency in Dubai with partnerships with top developers",
      partners: partnersWithWebsites.map((partner) => ({
        "@type": "Organization",
        name: partner.name,
        url: partner.website,
      })),
    };
  }, [allPartners]);

  // Split partners into two rows
  const half = Math.ceil(allPartners.length / 2);
  const topRow = allPartners.slice(0, half);
  const bottomRow = allPartners.slice(half);

  // Helper to render a single partner card
  const renderPartnerCard = (item: any) => (
    <div
      className="group relative cursor-pointer w-[120px] md:w-[150px] lg:w-[170px]"
      onClick={() => {
        if (item.website) {
          // Track partner click for analytics
          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "partner_click", {
              partner_name: item.name,
              partner_url: item.website,
            });
          }

          // Open with SEO-safe attributes
          const link = document.createElement("a");
          link.href = item.website;
          link.target = "_blank";
          link.rel = "nofollow noopener noreferrer";
          link.click();
        }
      }}
    >
      <img
        src={item.img}
        className="w-4/5 h-4/5 object-contain transition-transform duration-300 group-hover:scale-105"
        alt={`${
          item.name || "Partner"
        } - Official Partner | Dubai Real Estate Developer`}
        loading="lazy"
      />
    </div>
  );

  return (
    <section
      className={twMerge(
        "w-full py-8 md:py-16 lg:py-20 bg-light overflow-hidden partner_padding",
        conClass
      )}
    >
      <div className="custom_container mx-auto px-4">
        <div className="mb-6 md:mb-8">
          <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {t("Partners with")} {t("Dubai's leading developers")}
          </h1>
          <p className="sr-only">
            {t(
              "Trusted partnerships with Dubai's top real estate developers including EMAAR, DAMAC, SOBHA, AZIZI, Binghatti, and more established companies in the UAE property market."
            )}
          </p>
        </div>
      </div>

      {/* Two-row auto-moving carousel */}
      <div
        className="bg-[#0b4a35]"
        // style={{ paddingTop: "30px", paddingBottom: "30px" }}
      >
        <div className="relative overflow-hidden">
          {/* TOP ROW – moves left ➜ right (centered vertically) */}
          <motion.div
            className="flex items-center justify-center gap-6 md:gap-10 lg:gap-12 min-w-max h-[80px] md:h-[90px]"
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          >
            {[...topRow, ...topRow].map((item, index) => (
              <div
                key={`top-${item.id}-${index}`}
                className="flex items-center justify-center shrink-0 h-full"
              >
                {renderPartnerCard(item)}
              </div>
            ))}
          </motion.div>

          {/* ✅ WHITE GAP (5px) */}
          <div className="h-[5px] bg-white w-full" />

          {/* BOTTOM ROW – moves right ➜ left (centered vertically) */}
          <motion.div
            className="flex items-center justify-center gap-6 md:gap-10 lg:gap-12 min-w-max h-[80px] md:h-[90px]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          >
            {[...bottomRow, ...bottomRow].map((item, index) => (
              <div
                key={`bottom-${item.id}-${index}`}
                className="flex items-center justify-center shrink-0 h-full"
              >
                {renderPartnerCard(item)}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(partnerSchema),
        }}
      />
    </section>
  );
};

export default Partners;
