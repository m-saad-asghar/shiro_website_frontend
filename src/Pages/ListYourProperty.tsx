import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ContactForm } from "@/Components";
import Icons from "@/Constants/Icons";
import { Helmet } from "react-helmet";
import { OurClients } from "@/Sections/Home";

const ListYourProperty = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>List Your Property - Shiro Estate</title>
        <meta
          name="description"
          content="List your property with Shiro Estate and reach thousands of potential buyers. Professional real estate services in Dubai."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 overflow-hidden pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold"
                >
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  {t("Professional Real Estate Services")}
                </motion.div>

                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {t("List Your Property")}
                  <span className="block text-primary">
                    {t("With Confidence")}
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  {t(
                    "Join thousands of satisfied property owners who trust Shiro Estate to showcase their properties to the right buyers. Get maximum exposure and professional marketing."
                  )}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-[#094834] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icons.IoEyeOutline size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("Maximum Exposure")}
                    </h3>
                    <p className="text-gray-600">
                      {t(
                        "Reach thousands of potential buyers through our extensive network"
                      )}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-[#094834] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icons.IoShieldCheckmarkOutline
                      size={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("Professional Service")}
                    </h3>
                    <p className="text-gray-600">
                      {t(
                        "Expert guidance throughout the entire selling process"
                      )}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-[#094834] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icons.IoTrendingUpOutline
                      size={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("Best Market Value")}
                    </h3>
                    <p className="text-gray-600">
                      {t("Get the best possible price for your property")}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-[#094834] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icons.IoSpeedometerOutline
                      size={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("Fast Process")}
                    </h3>
                    <p className="text-gray-600">
                      {t("Quick listing and efficient property management")}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="List Your Property"
                  className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
              </div>

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute top-8 right-8 bg-white rounded-2xl p-6 shadow-xl border border-gray-100 z-20"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    500+
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("Properties Listed")}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t("Why Choose Shiro Estate?")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t(
                "We provide comprehensive real estate services that ensure your property gets the attention it deserves"
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Icons.IoGlobeOutline size={32} />,
                title: t("Global Reach"),
                description: t("Access to international buyers and investors"),
              },
              {
                icon: <Icons.IoCameraOutline size={32} />,
                title: t("Professional Photography"),
                description: t("High-quality photos and virtual tours"),
              },
              {
                icon: <Icons.IoAnalyticsOutline size={32} />,
                title: t("Market Analysis"),
                description: t("Detailed market insights and pricing strategy"),
              },
              {
                icon: <Icons.IoPeopleOutline size={32} />,
                title: t("Negotiation Support"),
                description: t("Expert negotiation to get the best deal"),
              },
              {
                icon: <Icons.IoDocumentTextOutline size={32} />,
                title: t("Legal Assistance"),
                description: t("Complete legal support throughout the process"),
              },
              {
                icon: <Icons.IoHeadsetOutline size={32} />,
                title: t("24/7 Support"),
                description: t("Round-the-clock customer service"),
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 bg-[#094834] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {t("Ready to List Your Property?")}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t(
                    "Fill out the form below and our team will contact you within 24 hours to discuss your property listing."
                  )}
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icons.IoCheckmark size={16} className="text-white" />
                  </div>
                  <span className="text-gray-700">
                    {t("Free property valuation")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icons.IoCheckmark size={16} className="text-white" />
                  </div>
                  <span className="text-gray-700">
                    {t("Professional marketing materials")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icons.IoCheckmark size={16} className="text-white" />
                  </div>
                  <span className="text-gray-700">
                    {t("Dedicated property manager")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icons.IoCheckmark size={16} className="text-white" />
                  </div>
                  <span className="text-gray-700">
                    {t("Regular market updates")}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <ContactForm
                title={t("List Your Property")}
                message={t(
                  "Hello, I have a property that I would like to list with you."
                )}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <OurClients />
    </>
  );
};

export default ListYourProperty;
