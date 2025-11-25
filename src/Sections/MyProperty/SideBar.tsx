import { SideBarItem } from "@/assets/Data/MayProperty";
import Images from "@/Constants/Images";
import type { SideBarItemType } from "@/Types";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const SideBar = () => {
  const { t } = useTranslation();

  const renderItem = SideBarItem().map(
    (item: SideBarItemType, index: number) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group w-full"
        onClick={item.link}
      >
        <div className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl cursor-pointer transition-all duration-300 group-hover:translate-x-2">
          <div className="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors duration-300">
            {item.icons}
          </div>
          <p className="text-sm font-semibold capitalize group-hover:text-primary transition-colors duration-300">
            {t(item.title)}
          </p>
        </div>
      </motion.div>
    )
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full bg-white shadow-xl border-r border-gray-100 flex flex-col"
    >
      {/* Logo Section */}
      <div className="p-8 border-b border-gray-100">
        <div className="w-40 h-12">
          <img
            src={Images.Logo}
            alt="Shiro Estate"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-6 space-y-2">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
            {t("Navigation")}
          </h3>
        </div>
        {renderItem}
      </div>

      {/* Footer Section */}
      <div className="p-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">{t("Shiro Estate")}</p>
          <p className="text-xs text-gray-400">
            {t("Your trusted real estate partner")}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SideBar;
