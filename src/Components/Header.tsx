import { HeaderItem } from "@/assets/Data/Header";
import Images from "../Constants/Images";
import HoverCardBox from "./HoverCardBox";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import Icons from "@/Constants/Icons";
import { useMediaQuery } from "react-responsive";
import HeaderForSmallScreen from "./HeaderForSmallScreen";
import MainDropdown from "./MainDropdown";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import useQueryGet from "@/hooks/useQueryGet";
import StaticServices from "@/Services/StaticServices";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import i18nn from "../i18n";
// import { useAreaUnit } from "@/Context/AreaUnitContext";
import { motion } from "framer-motion";

const Header = () => {
  // For btn my property page
  // const isAuthenticated = !!Cookies.get("token");

  // Translation
  const { t, i18n } = useTranslation();
  // const { currentUnit, setCurrentUnit } = useAreaUnit();

  // const changeLanguage = (lang: string) => {
  //   window.localStorage.setItem("lang", lang);
  //   setCurrentLanguage(lang);
  //   window.location.reload();
  // };
  // useEffect(() => {
  //   document.body.dir = i18n.language == "en" ? "ltr" : "rtl";
  //   document.body.classList.add(i18n.language);
  //   const lang: string = localStorage.getItem("lang") || "en";
  //   i18nn.changeLanguage(lang);
  //   setCurrentLanguage(lang);
  // }, [i18nn.language]);
  // currency
  const { data: AllCurrency } = useQueryGet(
    ["currency"],
    StaticServices.currency
  );

  // Set default currency to AED if not set
  useEffect(() => {
    if (AllCurrency?.currency && !Cookies.get("cu")) {
      Cookies.set("cu", "AED");
    }
  }, [AllCurrency]);

  // language
  // const [currentLanguage, setCurrentLanguage] = useState("En");
  // for small screen and tablet
  const isDesktopOrLaptop = useMediaQuery({
    query: "(max-width: 1024px)",
  });

  const navigate = useNavigate();
  // const [isHome, setIsHome] = useState<boolean>(false);
  const Location = useLocation();
  useEffect(() => {
    if (Location.pathname != "/") {
      // setIsHome(false);
    } else {
      // setIsHome(true);
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

  // render hover Card && Links
  const renderHeaderItem = HeaderItem().map((item) => (
    <li key={item.id}>
      <HoverCardBox
        title={item.li}
        content={item?.content}
        onClick={() => {
          // For items with dropdown, allow navigation on click
          if (item.li === t("More Options")) {
            return; // More Options has no main page
          } else {
            navigate(item.link);
          }
        }}
        href={undefined} // Never use href to keep SPA behavior
        onScroll={onScroll}
        className={`text-gray-900`}
        ariaLabel={
          item.li === t("More Options")
            ? "More navigation options including About Us, Services, and Contact"
            : item.li
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {item.content &&
            item?.content?.option?.map((item1: any) => (
              <motion.div
                key={item1.id}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 cursor-pointer text-[14px] font-[600] text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
                onClick={() => {
                  if (item1?.link) {
                    // For projects with property type, pass state
                    if (item1?.property_type_id) {
                      navigate(item1.link, {
                        state: {
                          property_type_id: item1.property_type_id,
                          property_name: item1.item,
                        },
                      });
                    } else {
                      navigate(item1.link);
                    }
                  }
                }}
              >
                {item1?.icon && (
                  <img
                    src={item1?.icon}
                    alt={item1?.name || "Icon"}
                    className="w-5 h-5 object-contain"
                  />
                )}
                <span className="text-[14px] lg:text-[15px]">{item1.item}</span>
              </motion.div>
            ))}
        </div>
      </HoverCardBox>
    </li>
  ));
  return (
    <>
      {isDesktopOrLaptop ? (
        <HeaderForSmallScreen />
      ) : (
        <div className="w-full fixed z-[9999]">
          <div
            style={{ opacity: onScroll ? 1 : 1, transitionDuration: ".5s" }}
            className={`bg-white/95 backdrop-blur-md text-gray-900 w-[calc(100%)] h-[87.2px] mx-auto px-[120px] flex items-center justify-between shadow-xl overflow-hidden`}
          >
            <NavLink to="/">
              <div className="md:w-[120px] md:h-[50px] flex-center cursor-pointer">
                <img
                  src={Images.Logo}
                  className="w-full h-full object-contain"
                  alt="Shiro Real Estate Logo"
                />
              </div>
            </NavLink>
            <div className="flex items-center">
              {/* <ul className="flex items-center gap-8">{renderHeaderItem}</ul> */}
            </div>

            <div className="flex items-center gap-8">
              <ul className="flex items-center gap-4">{renderHeaderItem}</ul>
              {/* <div>
                <MainDropdown
                  title={<Icons.IoSettingsOutline size={20} />}
                  showIcon={true}
                  triggerClass={`text-gray-700 border-gray-200 hover:bg-gray-100 bg-white/90 font-semibold rounded-xl px-3 py-2 text-sm border transition-all duration-200`}
                >
                  <DropdownMenuItem className="bg-white rounded-xl p-2">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">
                        {t("Language")}
                      </h3>
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-between cursor-pointer text-[14px] font-semibold text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200 capitalize group"
                        onClick={() => {
                          setCurrentLanguage("ar");
                          changeLanguage("ar");
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-4 bg-[#094834] rounded-sm flex items-center justify-center text-white text-xs font-bold">
                            ع
                          </div>
                          <span>العربية</span>
                        </div>
                        {currentLanguage === "ar" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 bg-[#094834] rounded-full flex items-center justify-center"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <polyline points="20,6 9,17 4,12" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.div>
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-between cursor-pointer text-[14px] font-semibold text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200 capitalize group"
                        onClick={() => {
                          setCurrentLanguage("en");
                          changeLanguage("en");
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-4 bg-[#9d8051] rounded-sm flex items-center justify-center text-white text-xs font-bold">
                            EN
                          </div>
                          <span>English</span>
                        </div>
                        {currentLanguage === "en" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 bg-[#9d8051] rounded-full flex items-center justify-center"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <polyline points="20,6 9,17 4,12" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">
                        {t("Area Unit")}
                      </h3>
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-between cursor-pointer text-[14px] font-semibold text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200 capitalize group"
                        onClick={() => setCurrentUnit("sq ft")}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-4 bg-[#094834] rounded-sm flex items-center justify-center text-white font-bold text-xs">
                            ft²
                          </div>
                          <span>{t("Sq Ft")}</span>
                        </div>
                        {currentUnit === "sq ft" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 bg-[#094834] rounded-full flex items-center justify-center"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <polyline points="20,6 9,17 4,12" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.div>
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-between cursor-pointer text-[14px] font-semibold text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200 capitalize group"
                        onClick={() => setCurrentUnit("sq m")}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-4 bg-[#9d8051] rounded-sm flex items-center justify-center text-white font-bold text-xs">
                            m²
                          </div>
                          <span>{t("Sq M")}</span>
                        </div>
                        {currentUnit === "sq m" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 bg-[#094834] rounded-full flex items-center justify-center"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <polyline points="20,6 9,17 4,12" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </DropdownMenuItem>
                </MainDropdown>
              </div> */}

              {/* Currency Dropdown */}
              <div>
                <MainDropdown
                  title={
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {AllCurrency?.currency?.find(
                          (item: any) =>
                            Cookies.get("cu") === item?.title?.toUpperCase()
                        )?.title || "AED"}
                      </span>
                    </div>
                  }
                  showIcon={true}
                  triggerClass={`text-gray-700 border-gray-200 hover:bg-gray-100 bg-white/90 font-semibold rounded-xl px-3 py-2 text-sm border transition-all duration-200`}
                >
                  <DropdownMenuItem className="bg-white rounded-xl p-2">
                    <div className="space-y-2">
                      {AllCurrency?.currency?.map((item: any) => (
                        <motion.div
                          key={item.title}
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex items-center justify-between cursor-pointer text-[14px] font-semibold text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200 capitalize group"
                          onClick={() => {
                            Cookies.set("cu", item?.title?.toUpperCase());
                            navigate(0);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-4 bg-gray-100 rounded-sm flex items-center justify-center text-gray-700 font-bold text-xs">
                              {item.symbol}
                            </div>
                            <span>{item.title}</span>
                          </div>
                          {Cookies.get("cu") === item?.title?.toUpperCase() && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-4 h-4 bg-[#094834] rounded-full flex items-center justify-center"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <polyline points="20,6 9,17 4,12" />
                              </svg>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </DropdownMenuItem>
                </MainDropdown>
              </div>

              {/* {isAuthenticated ? (
                <button
                  className="transition-all duration-[.4s] cursor-pointer text-white bg-[#094834] border-[#094834] hover:bg-[#9f8151] font-semibold rounded-xl px-3 py-2 text-sm border flex items-center justify-center"
                  onClick={() => navigate("/myproperty")}
                >
                  <Icons.GoPerson size={20} />
                </button>
              ) : (
                <button
                  className="transition-all duration-[.4s] cursor-pointer text-white bg-[#094834] border-[#094834] hover:bg-[#9f8151] font-semibold rounded-xl px-3 py-2 text-sm border flex items-center justify-center"
                  onClick={() => navigate("/login")}
                >
                  <span>{t("login")}</span>
                </button>
              )} */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
