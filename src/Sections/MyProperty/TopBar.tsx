import Icons from "@/Constants/Icons";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const TopBar = () => {
  const username = Cookies.get("username");
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between px-6 py-4 lg:px-8 lg:py-6">
        {/* Page Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icons.IoHomeOutline size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              {t("My Property")}
            </h1>
            <p className="text-sm text-gray-600">
              {t("Manage your favorite properties")}
            </p>
          </div>
        </div>

        {/* User Profile */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-all duration-200"
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {username?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{username}</p>
            <p className="text-xs text-gray-500">{t("Account")}</p>
          </div>
          <Icons.IoIosArrowDown size={16} className="text-gray-500" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TopBar;
