import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import useQueryGet from "@/hooks/useQueryGet";
import OurServices from "@/Services/OurServices";
import ImagesUrl from "@/helpers/ImagesURL";
import Icons from "@/Constants/Icons";

const SingleService = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();

  // Extract ID from slug (ID is at the end, separated by underscore or hyphen)
  // Example: "property-management_1" or "service-5"
  const extractIdFromSlug = (slug: string | undefined): string | undefined => {
    if (!slug) return undefined;

    // Try underscore separator first (current format)
    const partsByUnderscore = slug.split("_");
    const lastPartUnderscore = partsByUnderscore[partsByUnderscore.length - 1];

    if (
      lastPartUnderscore &&
      !isNaN(Number(lastPartUnderscore)) &&
      lastPartUnderscore.trim() !== ""
    ) {
      return lastPartUnderscore;
    }

    // Fallback: try hyphen separator
    const partsByHyphen = slug.split("-");
    const lastPartHyphen = partsByHyphen[partsByHyphen.length - 1];

    if (
      lastPartHyphen &&
      !isNaN(Number(lastPartHyphen)) &&
      lastPartHyphen.trim() !== ""
    ) {
      return lastPartHyphen;
    }

    // Fallback: try to find number at the end
    const match = slug.match(/(?:[_-]|^)(\d+)$/);
    if (match && match[1]) {
      return match[1];
    }

    return undefined;
  };

  const id = extractIdFromSlug(slug);

  // Fetch all services to find the specific one
  const { data: servicesData, status } = useQueryGet(
    ["allServices"],
    OurServices.AllServices
  );

  // Find the specific service by ID
  const service = servicesData?.services?.find(
    (s: {
      id: number;
      title_main?: string;
      title?: string;
      description: string;
      image_main?: string;
      image?: string;
    }) => s.id === Number(id)
  );

  // Get the actual title and image from the service
  const actualServiceTitle = service?.title_main || service?.title || "Service";
  const serviceImage = service?.image_main || service?.image || "";

  const handleBackClick = () => {
    navigate(-1);
  };

  if (status === "pending") {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error" || !service) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.IoAlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {t("Service Not Found")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t(
                  "The service you're looking for doesn't exist or has been removed."
                )}
              </p>
              <button
                onClick={handleBackClick}
                className="inline-flex items-center gap-2 bg-primary hover:bg-[#9f8151] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-[.4s]"
              >
                <Icons.IoIosArrowBack size={20} />
                {t("Go Back")}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{actualServiceTitle} - Shiro Estate</title>
        <meta name="description" content={service.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onClick={handleBackClick}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold mb-8 transition-colors duration-200"
            >
              <Icons.IoIosArrowBack size={20} />
              {t("Back to Services")}
            </motion.button>

            {/* Service Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              {/* Hero Image */}
              <div className="relative w-full h-64 lg:h-96 overflow-hidden">
                <img
                  src={ImagesUrl(serviceImage)}
                  alt={actualServiceTitle}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "/src/assets/Images/Property/placeholder-property.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Service Badge */}
                <div className="absolute top-6 left-6">
                  <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-primary shadow-lg">
                    <Icons.IoGridOutline size={16} />
                    {t("Service")}
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-8 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {actualServiceTitle}
                  </h1>

                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg mb-8">
                      {service.description}
                    </p>
                  </div>

                  {/* Service Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icons.IoShieldCheckmarkOutline
                          size={24}
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {t("Professional Service")}
                        </h3>
                        <p className="text-gray-600">
                          {t(
                            "Expert guidance and professional support throughout the process"
                          )}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icons.IoTimeOutline
                          size={24}
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {t("Fast & Efficient")}
                        </h3>
                        <p className="text-gray-600">
                          {t(
                            "Quick turnaround times and efficient service delivery"
                          )}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icons.IoPeopleOutline
                          size={24}
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {t("Dedicated Support")}
                        </h3>
                        <p className="text-gray-600">
                          {t(
                            "Personalized attention and dedicated customer support"
                          )}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icons.IoStar size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {t("Quality Guaranteed")}
                        </h3>
                        <p className="text-gray-600">
                          {t(
                            "High-quality service with guaranteed satisfaction"
                          )}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* CTA Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-12 p-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20"
                  >
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {t("Ready to Get Started?")}
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        {t(
                          "Contact our team today to learn more about this service and how we can help you achieve your goals."
                        )}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={() => navigate("/contact")}
                          className="inline-flex items-center gap-2 bg-primary hover:bg-[#9f8151] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-[.4s]"
                        >
                          <Icons.IoMailOutline size={20} />
                          {t("Contact Us")}
                        </button>
                        <button
                          onClick={() => navigate("/property-services")}
                          className="inline-flex items-center gap-2 bg-white hover:bg-[#9f8151] hover:text-white text-primary border-2 border-primary hover:border-[#9f8151] font-semibold py-4 px-8 rounded-xl transition-all duration-[.4s]"
                        >
                          <Icons.IoGridOutline size={20} />
                          {t("View All Services")}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleService;
