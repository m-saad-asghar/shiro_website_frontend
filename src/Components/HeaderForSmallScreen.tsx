import Images from "@/Constants/Images";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import Icons from "@/Constants/Icons";
import { HeaderForSmallScreenItem } from "@/assets/Data/Header";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import i18nn from "../i18n";
import { motion, AnimatePresence } from "framer-motion";

const HeaderForSmallScreen = () => {
  const navigate = useNavigate();

  // Translation
  const [currentLanguage, setCurrentLanguage] = useState("En");
  const { t, i18n } = useTranslation();

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
    setIsHome(Location.pathname === "/");
  }, [Location.pathname]);

  const [onScroll, setOnScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => setOnScroll(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ FIX: internal vs external navigation (Career opens in new tab)
  const goToLink = (link?: string, external?: boolean, target?: string) => {
    if (!link) return;

    const isHttp = /^https?:\/\//i.test(link);
    const shouldOpenExternal = external || isHttp;

    if (shouldOpenExternal) {
      window.open(link, target || "_blank", "noopener,noreferrer");
      return;
    }

    navigate(link);
  };

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ opacity: 1, transitionDuration: ".5s" }}
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
                <NavLink to="/" onClick={() => setOpen(false)}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-[100px] md:w-[120px] h-full cursor-pointer"
                  >
                    <img
                      src={Images.Logo}
                      className="w-full h-full object-contain"
                    />
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
                          if (!item.link) return;

                          // ✅ FIXED: external opens new tab, internal uses navigate
                          goToLink(item.link, (item as any).external, (item as any).target);

                          handleItemClick();
                        }}
                      >
                        <span className="font-medium text-gray-900">
                          {item.li}
                        </span>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>
    </>
  );
};

export default HeaderForSmallScreen;
