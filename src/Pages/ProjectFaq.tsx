"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import Icons from "@/Constants/Icons";

export type FAQ = {
  id: number | string;
  question: string;
  answer?: string | null;
};

type ProjectFaqProps = {
  faqs: FAQ[];
};

export default function ProjectFaq({ faqs }: ProjectFaqProps) {
  const { t } = useTranslation();
  const [openFAQ, setOpenFAQ] = useState<FAQ["id"] | null>(null);

  const toggleFAQ = (id: FAQ["id"]) => {
    setOpenFAQ((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-white" id="faqs">
      <div>
        <div className="max-w-full mx-auto">
          <div className="space-y-6">
            {faqs.map((faq: FAQ, index: number) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white change_border border border-primary/20 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-3 lg:p-4 text-left focus:outline-none focus:ring-2 focus:ring-primary/20 change_border"
                  type="button"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-xl text-[#9f8151]">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      <motion.div
                        animate={{ rotate: openFAQ === faq.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"
                      >
                        <Icons.IoChevronDown size={20} className="text-primary" />
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
                      <div className="px-3 lg:px-4 pb-3 lg:pb-4">
                        <div className="pt-4 border-t border-gray-100">
                          <div
                            className="down_styling para_styling"
                            dangerouslySetInnerHTML={{
                              __html: faq.answer || "",
                            }}
                          />
                          {!faq.answer && (
                            <p className="down_styling para_styling">{t("No answer available.")}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
