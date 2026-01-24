import { FooterItem, FooterSocialMedia } from "../assets/Data/Footer";
import { useMediaQuery } from "react-responsive";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import Icons from "@/Constants/Icons";
import Images from "@/Constants/Images";
import useQueryGet from "@/hooks/useQueryGet";
import StaticServices from "@/Services/StaticServices";

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  // Fetch contact information
  const { data: contact } = useQueryGet(["contact"], StaticServices.contact);
  const rawPhone = String(contact?.contact_info?.phone ?? "");
  const spacedPhone = rawPhone.replace(
    /^(\+\d{3})(\d)(\d{3})(\d{4})$/,
    "$1 $2 $3 $4"
  );

  // ✅ helper: internal vs external navigation (Career opens correct)
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

  // ✅ Get footer items once
  const footerItems = FooterItem();

  // ✅ Collect ONLY "Popular Searches" options from all footer sections
  const popularSearchOptions = footerItems.flatMap((section) => section.option);

  const renderItem = (
    <div className={isMobile ? "" : "space-y-4"}>
      {isMobile ? (
        <Accordion
          type="single"
          collapsible
          className="border-b border-white/10 py-4"
        >
          <AccordionItem value="popular-searches" className="border-none">
            <AccordionTrigger className="footer_text_styling text-md font-semibold text-white hover:text-[#d3c294] transition-colors duration-300 py-2">
              Popular Searches
            </AccordionTrigger>

            <AccordionContent className="mt-2 space-y-2">
              {popularSearchOptions.map((li: any) => (
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="footer_text_styling footer_text_styling_hover text-sm text-gray-300 list-none font-normal hover:text-[#d3c294] duration-300 cursor-pointer transition-all py-1"
                  key={li.id}
                  onClick={() => {
                    // ✅ property type navigation (internal)
                    if (li?.property_type_id) {
                      navigate(li.link, {
                        state: {
                          property_type_id: li.property_type_id,
                          property_name: li.item,
                        },
                      });
                      return;
                    }

                    // ✅ external/open-new-tab support (Career)
                    goToLink(li.link, li.external, li.target);
                  }}
                >
                  {li.item}
                </motion.li>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <>
          <h3 className="text-md font-semibold uppercase tracking-wider footer_text_styling">
            Popular Searches
          </h3>

          <ul className="grid grid-flow-col grid-rows-5 lg:grid-rows-5 gap-y-2 gap-x-10">
            {popularSearchOptions.map((li: any) => (
              <li
                className="footer_text_styling footer_text_styling_hover text-sm text-gray-300 font-normal capitalize hover:text-[#d3c294] duration-300 cursor-pointer transition-all"
                key={li.id}
                onClick={() => {
                  // ✅ property type navigation (internal)
                  if (li?.property_type_id) {
                    navigate(li.link, {
                      state: {
                        property_type_id: li.property_type_id,
                        property_name: li.item,
                      },
                    });
                    return;
                  }

                  // ✅ external/open-new-tab support (Career)
                  goToLink(li.link, li.external, li.target);
                }}
              >
                {li.item}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  const renderSocialMedia = FooterSocialMedia().map((item) => (
    <motion.div
      key={item.id}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-300 group"
      onClick={() => window.open(item.link, "_blank", "noopener,noreferrer")}
    >
      <div className="text-white group-hover:text-white transition-colors duration-300">
        {item.icons}
      </div>
    </motion.div>
  ));

  const handleContactClick = (type: string, value?: string) => {
    if (type === "whatsapp" && value) {
      window.open(`https://wa.me/${value}`);
    } else if (type === "phone" && value) {
      window.open(`tel:${value}`);
    } else if (type === "email" && value) {
      window.open(`mailto:${value}`);
    } else if (type === "location") {
      window.open("https://maps.app.goo.gl/uEsbMoYojDkhCpVw7");
    }
  };

  return (
    <footer className="bg-[#094834] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d3c294] to-transparent"></div>
      </div>

      <div className="relative">
        <div className="custom_container mx-auto px-4 py-12 lg:py-16 remove_extra_margin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-8 lg:gap-12">
            <div className="lg:col-span-4 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center cursor-pointer centerize_mobile"
                onClick={() => navigate("/")}
              >
                <img
                  src={Images.LogoGold}
                  alt="Shiro Real Estate - Homepage"
                  className="h-10 md:h-12"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-3"
                style={{ width: "fit-content" }}
              >
                <div className="flex down_position">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="footer_text_styling footer_text_styling_hover flex items-center gap-3 hover:text-[#d3c294] cursor-pointer transition-colors duration-300 down_phone_spacing"
                    onClick={() =>
                      handleContactClick("phone", contact?.contact_info?.phone)
                    }
                  >
                    <Icons.LuPhone className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">
                      {spacedPhone || "—"}
                    </span>
                  </motion.div>
                  <div className="separator_styling hidden_styling">|</div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="footer_text_styling footer_text_styling_hover flex items-center gap-3 hover:text-[#d3c294] cursor-pointer transition-colors duration-300"
                    onClick={() =>
                      handleContactClick("email", contact?.contact_info?.email)
                    }
                  >
                    <Icons.MdOutlineEmail className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">
                      {contact?.contact_info?.email}
                    </span>
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="footer_text_styling footer_text_styling_hover flex items-start gap-3 hover:text-[#d3c294] cursor-pointer transition-colors duration-300"
                  onClick={() => handleContactClick("location")}
                >
                  <Icons.CiLocationOn
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: "#ffffff" }}
                  />
                  <span className="text-sm leading-relaxed">
                    {contact?.contact_info?.address ||
                      "Boulevard Plaza Tower 1 - Downtown - Office No. 2101 - 21st Floor - Dubai"}
                  </span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-white font-semibold mb-4 text-md uppercase tracking-wider footer_text_styling">
                  {t("Follow Us")}
                </h4>
                <div className="flex items-center gap-3 centerize_mobile">
                  {renderSocialMedia}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-6 lg:gap-8">{renderItem}</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="custom_container mx-auto px-4 py-6 lg:py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center lg:text-left"
              >
                <p className="text-gray-400 text-sm footer_text_styling">
                  © {new Date().getFullYear()} Shiro Real Estate.{" "}
                  {t("All Rights Reserved")}.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
