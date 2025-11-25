import { useEffect, useState, useMemo, useCallback } from "react";
import { DeveloperPartners } from "@/assets/Data/Home";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

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
  const [activeGroup, setActiveGroup] = useState(0);
  const [direction, setDirection] = useState(0);

  // Memoize partners data to prevent unnecessary re-renders
  const allPartners = useMemo(() => DeveloperPartners(), []);

  // Generate Schema markup for SEO
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
  const partnersPerGroup = useMemo(
    () => Math.ceil(allPartners.length / 3),
    [allPartners.length]
  );

  const groups = useMemo(
    () => [
      allPartners.slice(0, partnersPerGroup),
      allPartners.slice(partnersPerGroup, partnersPerGroup * 2),
      allPartners.slice(partnersPerGroup * 2),
    ],
    [allPartners, partnersPerGroup]
  );

  // Smooth group switching with direction
  const switchGroup = useCallback(
    (newGroup: number) => {
      setDirection(newGroup > activeGroup ? 1 : -1);
      setActiveGroup(newGroup);
    },
    [activeGroup]
  );

  // Auto switch between groups every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextGroup = (activeGroup + 1) % 3;
      switchGroup(nextGroup);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeGroup, switchGroup]);

  const renderPartners = useMemo(
    () =>
      groups[activeGroup].map((item, index) => (
        <motion.div
          key={item?.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
            delay: index * 0.05, // Reduced stagger effect
          }}
          className="group relative cursor-pointer"
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
          <div className="bg-white rounded-xl p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20 h-full flex flex-col justify-center items-center">
            <div className="relative overflow-hidden rounded-lg flex items-center justify-center h-16 md:h-20 w-full">
              <img
                src={item.img}
                className="w-4/5 h-4/5 object-contain transition-transform duration-300 group-hover:scale-105"
                alt={`${
                  item.name || "Partner"
                } - Official Partner | Dubai Real Estate Developer`}
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      )),
    [groups, activeGroup]
  );

  return (
    <section
      className={twMerge(
        "w-full py-12 md:py-16 lg:py-20 bg-light overflow-hidden",
        conClass
      )}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <p className="text-[14px] md:text-[16px] text-dark font-[500] tracking-[.12em]">
            {t("Partners with")} {t("Dubai's leading developers")}
          </p>
          <p className="sr-only">
            {t(
              "Trusted partnerships with Dubai's top real estate developers including EMAAR, DAMAC, SOBHA, AZIZI, Binghatti, and more established companies in the UAE property market."
            )}
          </p>
        </div>

        {/* Group Navigation */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="flex space-x-1 md:space-x-2 bg-gray-100 rounded-lg p-1">
            {[0, 1, 2].map((groupIndex) => (
              <motion.button
                key={groupIndex}
                onClick={() => switchGroup(groupIndex)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeGroup === groupIndex
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {groupIndex + 1}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Partners Grid with Smooth Transitions */}
        <div className="min-h-[100px] md:min-h-[120px] relative pb-2 md:pb-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGroup}
              initial={{
                opacity: 0,
                x: direction * 30,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: -direction * 30,
                scale: 0.98,
              }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
                type: "spring",
                stiffness: 120,
                damping: 20,
              }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6"
            >
              {renderPartners}
            </motion.div>
          </AnimatePresence>
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
