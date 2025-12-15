import { DeveloperCard } from "@/Components/Developer";
import { Skeleton } from "@/Components/ui/skeleton";
import { useMemo, type FC } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type AllDeveloperProps = {
  data: any;
  status: any;
};

const AllDeveloper: FC<AllDeveloperProps> = ({ data, status }) => {
  const { t } = useTranslation();

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
    return data?.map((item: any, index: number) => (
      <motion.div
        key={item?.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        // whileHover={{ y: -5 }}
      >
        <DeveloperCard item={item} />
      </motion.div>
    ));
  }, [data]);

  return (
    <div className="custom_container mx-auto px-4">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-6"
        >
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <span className="text-primary font-medium text-sm">
            {t("Developer Directory")}
          </span>
        </motion.div> */}

         <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
        {t("Our Trusted Developers")}
      </h1>

        {/* <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {t("Our Trusted Developers")}
        </h2> */}

          <p className="down_styling para_styling">
                {t(
            "Partner with Dubai's most reputable real estate developers who are committed to excellence and innovation"
          )}
</p>

        {/* <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {t(
            "Partner with Dubai's most reputable real estate developers who are committed to excellence and innovation"
          )}
        </p> */}
      </motion.div>

      {/* Developers Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
      >
        {status === "pending" || status === "error"
          ? renderSkeltonCard
          : renderCard}
      </motion.div>

      {/* Results Count */}
      {/* {data && data.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-gray-600">
            {t("Showing")}{" "}
            <span className="font-semibold text-primary">{data.length}</span>{" "}
            {t("developers")}
          </p>
        </motion.div>
      )} */}

      {/* Empty State */}
      {data && data.length === 0 && status !== "pending" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t("No Developers Found")}
          </h3>
          <p className="text-gray-600">
            {t("Try adjusting your search criteria to find more developers")}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AllDeveloper;
