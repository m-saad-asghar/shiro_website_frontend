import AreaCard from "@/Components/Developer/AreaCard";
import { Skeleton } from "@/Components/ui/skeleton";
import { useMemo, type FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type AreaItem = {
  name: string;
  main_image: string | null;
  description: string | null;
  slug: string;
};

type AllAreasProps = {
  data?: AreaItem[];
  status: "pending" | "success" | "error";
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  onClearSearch?: () => void;
};

const AllAreas: FC<AllAreasProps> = ({
  data,
  status,
  searchValue,
  onSearchChange,
  onClearSearch,
}) => {
  const { t } = useTranslation();

  const safeData: AreaItem[] = Array.isArray(data) ? data : [];
  const parentValue = typeof searchValue === "string" ? searchValue : "";

  // ✅ Local fallback input state (so typing ALWAYS works)
  const [inputValue, setInputValue] = useState<string>(parentValue);

  // ✅ Keep local input in sync if parent changes (ex: clear, pagination reset)
  useEffect(() => {
    setInputValue(parentValue);
  }, [parentValue]);

  const renderSkeltonCard = useMemo(() => {
    return [...Array(6)].map((_, index: number) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Skeleton className="h-80 w-full rounded-2xl bg-gray-200" />
      </motion.div>
    ));
  }, []);

  const renderCard = useMemo(() => {
    return safeData.map((item: AreaItem, index: number) => (
      <motion.div
        key={item.slug ?? `${item.name}-${index}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <AreaCard item={item} />
      </motion.div>
    ));
  }, [safeData]);

  const showSkeleton = status === "pending" || status === "error";

  const handleInputChange = (val: string) => {
    setInputValue(val);        // ✅ typing always works
    onSearchChange?.(val);     // ✅ triggers DB search from parent if provided
  };

  const handleClear = () => {
    setInputValue("");
    if (onClearSearch) onClearSearch();
    else onSearchChange?.(""); // fallback
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
        <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
          {t("Dubai’s Top Areas")}
        </h1>

        <p className="down_styling para_styling">
          {t(
            "Explore Dubai’s vibrant lifestyle with our detailed area guide, featuring the city’s top communities, attractions, and experiences. Discover the best restaurants, must-see destinations, and highly rated apartments, while finding the ideal community and property to match your lifestyle."
          )}
        </p>
      </motion.div>

      {/* ✅ Search Bar */}
      <div className="mb-10 flex">
        <div className="w-full md:w-1/2 bg-white border border-primary/20 change_border  px-4 py-3 md:py-4 flex items-center gap-3">
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
            placeholder={t("Search Areas...")}
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
      >
        {showSkeleton ? renderSkeltonCard : renderCard}
      </motion.div>

      {/* Empty State */}
      {status === "success" && safeData.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <h3 className="font-semibold text-primary text-xl !text-[#9f8151]">
            {t("No Area Found")}
          </h3>
          <p className="!text-[14px] text-dark leading-relaxed !text-[#0b4a35] down_styling !leading-normal">
            {t("Try adjusting your search criteria to find more areas")}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AllAreas;
