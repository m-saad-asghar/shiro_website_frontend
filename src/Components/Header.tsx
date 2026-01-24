import { HeaderItem } from "@/assets/Data/Header";
import Images from "../Constants/Images";
import HoverCardBox from "./HoverCardBox";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import HeaderForSmallScreen from "./HeaderForSmallScreen";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import useQueryGet from "@/hooks/useQueryGet";
import StaticServices from "@/Services/StaticServices";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Header = () => {
  const { t } = useTranslation();

  const { data: AllCurrency } = useQueryGet(["currency"], StaticServices.currency);

  useEffect(() => {
    if (AllCurrency?.currency && !Cookies.get("cu")) {
      Cookies.set("cu", "AED");
    }
  }, [AllCurrency]);

  const isDesktopOrLaptop = useMediaQuery({ query: "(max-width: 1024px)" });

  const navigate = useNavigate();
  const Location = useLocation();

  useEffect(() => {
    // keeping your logic (no-op currently)
    if (Location.pathname !== "/") {
      // setIsHome(false);
    } else {
      // setIsHome(true);
    }
  }, [Location.pathname]);

  const [onScroll, setOnScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => setOnScroll(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ helper: internal vs external navigation
  const goToLink = (link?: string, external?: boolean, target?: string) => {
    if (!link) return;

    const isHttp = /^https?:\/\//i.test(link);
    const shouldOpenExternal = external || isHttp;

    if (shouldOpenExternal) {
      // open in new tab (default)
      window.open(link, target || "_blank", "noopener,noreferrer");
      return;
    }

    navigate(link);
  };

  const renderHeaderItem = HeaderItem().map((item) => (
    <li key={item.id}>
      <HoverCardBox
        title={item.li}
        content={item?.content}
        onClick={() => {
          if (item.li === t("More")) return; // no main page
          goToLink(item.link);
        }}
        href={undefined}
        onScroll={onScroll}
        className={`text-gray-900`}
        ariaLabel={
          item.li === t("More Options")
            ? "More navigation options including About Us, Services, and Contact"
            : item.li
        }
      >
        <div className="grid grid-cols-1 gap-2">
          {item.content?.option?.map((item1: any) => (
            <motion.div
              key={item1.id}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 cursor-pointer text-[14px] text-gray-900 py-2 px-3 rounded-lg hover:bg-[#9f8151] hover:text-[#ffffff] transition-all duration-200"
              onClick={() => {
                if (!item1?.link) return;

                // ✅ if property type -> internal navigation with state
                if (item1?.property_type_id) {
                  navigate(item1.link, {
                    state: {
                      property_type_id: item1.property_type_id,
                      property_name: item1.item,
                    },
                  });
                  return;
                }

                // ✅ Career (and any other external link) opens new tab
                goToLink(item1.link, item1.external, item1.target);
              }}
            >
              {item1?.icon && (
                <img
                  src={item1.icon}
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
            style={{ opacity: 1, transitionDuration: ".5s" }}
            className="bg-white/95 backdrop-blur-md text-gray-900 w-[calc(100%)] h-[87.2px] mx-auto px-[120px] flex items-center justify-between shadow-xl overflow-hidden"
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

            <div className="flex items-center" />

            <div className="flex items-center gap-8">
              <ul className="flex items-center gap-4">{renderHeaderItem}</ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
