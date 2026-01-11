import Images from "@/Constants/Images";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import Icons from "@/Constants/Icons";
import { HeaderForSmallScreenItem } from "@/assets/Data/Header";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import i18nn from "../i18n";
import { useAreaUnit } from "@/Context/AreaUnitContext";
import { motion, AnimatePresence } from "framer-motion";

const HeaderForSmallScreen = () => {
  const navigate = useNavigate();

  // Translation
  const [currentLanguage, setCurrentLanguage] = useState("En");
  const { t, i18n } = useTranslation();
  // const { currentUnit, setCurrentUnit } = useAreaUnit();

  const changeLanguage = (lang: string) => {
    window.localStorage.setItem("lang", lang);
    setCurrentLanguage(lang);
    window.location.reload();
  };
  useEffect(() => {
    document.body.dir = i18n.language == "en" ? "ltr" : "rtl";
    document.body.classList.add(i18n.language);
    const lang: string = localStorage.getItem("lang") || "en";
    i18nn.changeLanguage(lang);
    setCurrentLanguage(lang);
  }, [i18nn.language]);

  // For btn my property page
  const isAuthenticated = !!Cookies.get("token");

  const [open, setOpen] = useState(false);

  const handleItemClick = () => {
    setOpen(false);
  };
  const [isHome, setIsHome] = useState<boolean>(false);
  const Location = useLocation();
  useEffect(() => {
    if (Location.pathname != "/") {
      setIsHome(false);
    } else {
      setIsHome(true);
    }
  }, [Location.pathname]);
  const [onScroll, setOnScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setOnScroll(true);
      } else {
        setOnScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ opacity: onScroll ? 1 : 1, transitionDuration: ".5s" }}
        className={`${
          isHome != true || onScroll == true
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200 text-gray-900 shadow-lg"
            : "border-b border-gray-200 bg-white/90 backdrop-blur-md"
        } w-full h-[70px] md:h-[80px] py-[10px] px-[20px] flex items-center justify-between fixed top-0 z-[9999]`}
      >
        {/* Logo */}
        <NavLink to="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-[100px] md:w-[120px] h-full cursor-pointer"
          >
            <img src={Images.Logo} className="w-full h-full object-contain" />
          </motion.div>
        </NavLink>

        {/* Burger Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-[40px] h-[40px] bg-white border border-gray-200 rounded-xl cursor-pointer flex-center text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 shadow-md"
            >
              <Icons.GiHamburgerMenu size={20} />
            </motion.button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-white w-[320px] sm:w-[380px] p-0 border-l border-gray-200 overflow-y-auto"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className={`absolute top-4 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors ${
                    i18n.language === "ar" ? "left-4" : "right-4"
                  }`}
                >
                  <Icons.LiaTimesSolid size={16} />
                </motion.button>
                {/* Mobile Image */}
                <NavLink to="/" onClick={() => setOpen(false)} >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-[100px] md:w-[120px] h-full cursor-pointer"
          >
            <img src={Images.Logo} className="w-full h-full object-contain" />
          </motion.div>
        </NavLink>
                <p className="text-[16px] text-primary font-semibold !text-[#9f8151] font-[16px]">
                  {t("Excellence Beyond Compare")}
                </p>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 p-6 space-y-2">
                <AnimatePresence>
                  {HeaderForSmallScreenItem().map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer
                        text-[16px] font-[500] rounded-lg duration-200 hover:bg-primary/10 relative group text-gray-900"
                        onClick={() => {
                          if (item.link) {
                            navigate(item.link);
                            handleItemClick();
                          }
                        }}
                      >
                        {/* <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icons.IoHomeOutline
                            size={16}
                            className="text-primary"
                          />
                        </div> */}
                        <span className="font-medium text-gray-900">
                          {item.li}
                        </span>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Additional Links */}
                {/* <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    {t("More")}
                  </h3>
                  <div className="space-y-2">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        navigate("/list-your-property");
                        handleItemClick();
                      }}
                      aria-label="List your property for sale or rent"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icons.FiPlus size={16} className="text-primary" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {t("List Your Property")}
                      </span>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        navigate("/faqs");
                        handleItemClick();
                      }}
                      aria-label="Frequently asked questions and help"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icons.IoHelpCircleOutline
                          size={16}
                          className="text-primary"
                        />
                      </div>
                      <span className="font-medium text-gray-900">
                        {t("FAQs")}
                      </span>
                    </motion.div>
                  </div>
                </div> */}
              </div>

              {/* Settings Section */}
              {/* <div className="p-6 border-t border-gray-100 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  {t("Settings")}
                </h3>

                <div className="space-y-2">
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setCurrentLanguage("ar");
                      changeLanguage("ar");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-4 bg-primary rounded-sm flex items-center justify-center text-white text-xs font-bold">
                        ع
                      </div>
                      <span className="text-sm font-medium">العربية</span>
                    </div>
                    {currentLanguage === "ar" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                      >
                        <Icons.IoCheckmark size={12} className="text-white" />
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setCurrentLanguage("en");
                      changeLanguage("en");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-4 bg-[#9d8051] rounded-sm flex items-center justify-center text-white text-xs font-bold">
                        EN
                      </div>
                      <span className="text-sm font-medium">English</span>
                    </div>
                    {currentLanguage === "en" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                      >
                        <Icons.IoCheckmark size={12} className="text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                    onClick={() => setCurrentUnit("sq ft")}
                  >
                    <div className="flex items-center gap-3">
                      <Icons.TbRuler2 size={16} className="text-primary" />
                      <span className="text-sm font-medium">{t("Sq Ft")}</span>
                    </div>
                    {currentUnit === "sq ft" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                      >
                        <Icons.IoCheckmark size={12} className="text-white" />
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                    onClick={() => setCurrentUnit("sq m")}
                  >
                    <div className="flex items-center gap-3">
                      <Icons.TbRuler2 size={16} className="text-primary" />
                      <span className="text-sm font-medium">{t("Sq M")}</span>
                    </div>
                    {currentUnit === "sq m" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                      >
                        <Icons.IoCheckmark size={12} className="text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {isAuthenticated && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4"
                  >
                    <button
                      onClick={() => {
                        navigate("/myproperty");
                        handleItemClick();
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      aria-label="Go to my property page"
                    >
                      <Icons.IoPerson size={16} />
                      {t("My Property")}
                    </button>
                  </motion.div>
                )}

                {!isAuthenticated && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4"
                  >
                    <button
                      onClick={() => {
                        navigate("/login");
                        handleItemClick();
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      aria-label="Login to your account"
                    >
                      <Icons.GoPerson size={16} />
                      {t("login")}
                    </button>
                  </motion.div>
                )}
              </div> */}
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>
    </>
  );
};

export default HeaderForSmallScreen;
