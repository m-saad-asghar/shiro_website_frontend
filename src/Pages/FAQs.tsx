import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import useQueryGet from "@/hooks/useQueryGet";
import StaticServices from "@/Services/StaticServices";
import Icons from "@/Constants/Icons";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const FAQs = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Fetch FAQs from backend
  const { data: faqsData, status } = useQueryGet(["faqs"], StaticServices.FAQs);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <>
      <Helmet>
        <title>
          Frequently Asked Questions | Shiro Real Estate Agency In Dubai
        </title>
        <meta
          name="description"
          content="Find answers to common questions about Shiro Estate services, property listings, and real estate in Dubai."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] bg-gradient-to-br from-primary/10 via-white to-primary/5 overflow-hidden pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <Icons.IoHelpCircleOutline size={20} />
              {t("Frequently Asked Questions")}
            </motion.div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t("How Can We")}
              <span className="block text-primary">{t("Help You?")}</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {t(
                "Find answers to the most common questions about our real estate services, property listings, and everything you need to know about Shiro Estate."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {status === "pending" ? (
              // Loading skeleton
              <div className="space-y-6">
                {[...Array(6)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-2xl p-6 animate-pulse"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : status === "error" ? (
              // Error state
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icons.IoAlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {t("Error loading FAQs")}
                </h3>
                <p className="text-gray-600">{t("Please try again later")}</p>
              </motion.div>
            ) : faqsData?.faqs?.length > 0 ? (
              // FAQs content
              <div className="space-y-6">
                {faqsData.faqs.map((faq: FAQ, index: number) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 lg:p-8 text-left focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-2xl"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg lg:text-xl font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        <div className="flex-shrink-0">
                          <motion.div
                            animate={{ rotate: openFAQ === faq.id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"
                          >
                            <Icons.IoChevronDown
                              size={20}
                              className="text-primary"
                            />
                          </motion.div>
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {openFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                            <div className="pt-4 border-t border-gray-100">
                              <div
                                className="text-gray-700 leading-relaxed text-base lg:text-lg prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html: faq.answer || "",
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              // No FAQs available
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icons.IoDocumentTextOutline className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {t("No FAQs Available")}
                </h3>
                <p className="text-gray-600">
                  {t(
                    "We're working on adding frequently asked questions. Please check back later."
                  )}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.IoMailOutline size={32} className="text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t("Still Have Questions?")}
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {t(
                  "Can't find the answer you're looking for? Our team is here to help you with any questions about our services."
                )}
              </p>
              <button
                className="inline-flex items-center gap-2 bg-primary hover:bg-[#9f8151] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-[.4s]"
                onClick={handleContactClick}
              >
                <Icons.IoChatbubbleOutline size={20} />
                {t("Contact Our Team")}
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQs;
