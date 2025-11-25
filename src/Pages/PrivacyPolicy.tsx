import { Loader } from "@/Components";
import { Helmet } from "react-helmet";
import useQueryGet from "@/hooks/useQueryGet";
import StaticServices from "@/Services/StaticServices";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const { data, status } = useQueryGet(["privacy"], StaticServices.privacy);

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Shiro Real Estate Dubai</title>
        <meta
          name="description"
          content="Read Shiro Real Estate's privacy policy. Learn how we protect your personal information and respect your privacy when using our services."
        />
      </Helmet>
      {status == "pending" || status == "error" ? (
        <Loader message={t("Loading...")} size="lg" />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-28 md:pt-32 lg:pt-36"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center mb-12"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {data?.privacy?.name || t("Privacy Policy")}
                </h1>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 lg:p-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: data?.privacy?.description,
                }}
                style={
                  {
                    "--tw-prose-headings": "#094834",
                    "--tw-prose-links": "#094834",
                    "--tw-prose-bold": "#094834",
                  } as React.CSSProperties
                }
              />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default PrivacyPolicy;
