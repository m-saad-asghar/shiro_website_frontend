import { FooterItem, FooterSocialMedia } from "../assets/Data/Footer";
import { useMediaQuery } from "react-responsive";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

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

  const renderItem = FooterItem().map((item) => (
    <div key={item.id}>
      {isMobile ? (
        <Accordion
          type="single"
          collapsible
          className="border-b border-white/10 py-4"
        >
          <AccordionItem value={`item-${item.id}`} className="border-none">
            <AccordionTrigger className="text-sm font-semibold text-white hover:text-[#d3c294] transition-colors duration-300 py-2">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="mt-2 space-y-2">
              {item.option.map((li) => (
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-gray-300 list-none font-normal hover:text-[#d3c294] duration-300 cursor-pointer transition-all py-1"
                  key={li.id}
                  onClick={() => {
                    if ((li as any)?.property_type_id) {
                      navigate(li?.link, {
                        state: {
                          property_type_id: (li as any).property_type_id,
                          property_name: li.item,
                        },
                      });
                    } else {
                      navigate(li?.link);
                    }
                  }}
                >
                  {li.item}
                </motion.li>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <div key={item.id} className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            {item.title}
          </h3>
          <ul className="space-y-2">
            {item.option.map((li) => (
              <li
                className="text-sm text-gray-300 font-normal capitalize hover:text-[#d3c294] duration-300 cursor-pointer transition-all"
                key={li.id}
                onClick={() => {
                  if ((li as any)?.property_type_id) {
                    navigate(li?.link, {
                      state: {
                        property_type_id: (li as any).property_type_id,
                        property_name: li.item,
                      },
                    });
                  } else {
                    navigate(li?.link);
                  }
                }}
              >
                {li.item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ));

  const renderSocialMedia = FooterSocialMedia().map((item) => (
    <motion.div
      key={item.id}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 bg-white/10 hover:bg-[#9c8050] rounded-xl border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-300 group"
      onClick={() => window.open(item.link, "_blank")}
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
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d3c294] to-transparent"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Logo & Description Section */}
            <div className="lg:col-span-4 space-y-6">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center cursor-pointer"
                onClick={() => navigate("/")}
              >
                <img
                  src={Images.logoLight}
                  alt="Shiro Real Estate - Homepage"
                  className="h-10 md:h-12"
                />
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-3"
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-gray-300 hover:text-[#d3c294] cursor-pointer transition-colors duration-300"
                  onClick={() =>
                    handleContactClick("phone", contact?.contact_info?.phone)
                  }
                >
                  <Icons.LuPhone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">
                    {contact?.contact_info?.phone}
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-gray-300 hover:text-[#d3c294] cursor-pointer transition-colors duration-300"
                  onClick={() =>
                    handleContactClick("email", contact?.contact_info?.email)
                  }
                >
                  <Icons.MdOutlineEmail className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">
                    {contact?.contact_info?.email}
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 text-gray-300 hover:text-[#d3c294] cursor-pointer transition-colors duration-300"
                  onClick={() => handleContactClick("location")}
                >
                  <Icons.CiLocationOn className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">
                    {contact?.contact_info?.address || "Dubai, UAE"}
                  </span>
                </motion.div>
              </motion.div>

              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                  {t("Follow Us")}
                </h4>
                <div className="flex items-center gap-3">
                  {renderSocialMedia}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {renderItem}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-6 lg:py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6">
              {/* Copyright */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center lg:text-left"
              >
                <p className="text-gray-400 text-sm">
                  © 2025 Shiro Real Estate. {t("All Rights Reserved")}.
                </p>
              </motion.div>

              {/* Legal Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-sm"
              >
                <Link
                  to="/privacy-policy"
                  className="text-gray-400 hover:text-[#d3c294] cursor-pointer transition-colors duration-300"
                >
                  {t("Privacy Policy")}
                </Link>
                <Link
                  to="/terms-conditions"
                  className="text-gray-400 hover:text-[#d3c294] cursor-pointer transition-colors duration-300"
                >
                  {t("Terms & Conditions")}
                </Link>
                <a
                  href="/sitemap.xml"
                  className="text-gray-400 hover:text-[#d3c294] cursor-pointer transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("Sitemap")}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
