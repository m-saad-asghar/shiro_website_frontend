import { motion } from "framer-motion";

interface LoaderSkeletonProps {
  count?: number;
  className?: string;
}

const LoaderSkeleton: React.FC<LoaderSkeletonProps> = ({
  count = 1,
  className = "h-64 w-full",
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className={`bg-gray-200 rounded-2xl animate-pulse ${className}`}
        >
          <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl"></div>
        </motion.div>
      ))}
    </>
  );
};

export default LoaderSkeleton;
