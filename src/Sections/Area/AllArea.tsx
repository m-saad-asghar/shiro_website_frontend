import { AreaCard } from "@/Components/Area";
import { LoaderSkeleton } from "@/Components";
import { useMemo, type FC } from "react";
import { motion } from "framer-motion";

type AllAreaProps = {
  data: any;
  status: any;
};

const AllArea: FC<AllAreaProps> = ({ data, status }) => {
  const renderSkeletonCard = useMemo(() => {
    return <LoaderSkeleton count={8} className="h-80 w-full" />;
  }, []);

  const renderCardArea = useMemo(() => {
    return data?.map((item: any, index: number) => (
      <motion.div
        key={item?.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <AreaCard item={item} />
      </motion.div>
    ));
  }, [data]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 lg:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 items-stretch"
      >
        {status == "pending" || status == "error"
          ? renderSkeletonCard
          : renderCardArea}
      </motion.div>
    </div>
  );
};

export default AllArea;
