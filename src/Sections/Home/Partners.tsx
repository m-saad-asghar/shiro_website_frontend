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
      {/* <div className="bg-white rounded-xl p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20 h-full flex flex-col justify-center items-center"> */}
        {/* <div className="relative overflow-hidden rounded-lg flex items-center justify-center h-16 md:h-20 w-full"> */}
          <img
            src={item.img}
            className="w-4/5 h-4/5 object-contain transition-transform duration-300 group-hover:scale-105"
            alt={`${
              item.name || "Partner"
            } - Official Partner | Dubai Real Estate Developer`}
            loading="lazy"
          />
        {/* </div> */}
      {/* </div> */}
    </div>
  );

  return (
    <section
      className={twMerge(
        "w-full py-12 md:py-16 lg:py-20 bg-light overflow-hidden partner_padding",
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

        {/* Two-row auto-moving carousel */}
       <div
  className="bg-[#0b4a35]"
  style={{ paddingTop: "50px", paddingBottom: "40px" }} // or className="p-[30px]"
>
         <div className="min-h-[100px] md:min-h-[120px] relative pb-2 md:pb-4 overflow-hidden">
          <div className="flex flex-col gap-6 md:gap-12">
            {/* TOP ROW – moves left ➜ right */}
            <motion.div
              className="flex items-center gap-6 md:gap-10 lg:gap-12 min-w-max"
              animate={{ x: ["-50%", "0%"] }}
              transition={{
                duration: 50, // adjust for speed
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ willChange: "transform" }}
            >
              {[...topRow, ...topRow].map((item, index) => (
                <div
                  key={`top-${item.id}-${index}`}
                  className="flex items-center justify-center shrink-0"
                >
                  {renderPartnerCard(item)}
                </div>
              ))}
            </motion.div>

            {/* BOTTOM ROW – moves right ➜ left */}
            <motion.div
              className="flex items-center gap-6 md:gap-10 lg:gap-12 min-w-max"
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
                  className="flex items-center justify-center shrink-0"
                >
                  {renderPartnerCard(item)}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
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
