import { motion } from "framer-motion";
import { Loader } from "./";

interface LoaderPageProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const LoaderPage: React.FC<LoaderPageProps> = ({
  message = "Loading...",
  size = "lg",
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pt-28 md:pt-32 lg:pt-36"
      >
        <Loader message={message} size={size} />
      </motion.div>
    </div>
  );
};

export default LoaderPage;
