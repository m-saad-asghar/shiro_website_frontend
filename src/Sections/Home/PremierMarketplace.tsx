import Icons from "@/Constants/Icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PremierMarketplace = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stats = [
    {
      number: "20+",
      label: t("Years Experience"),
      icon: Icons.IoTimeOutline,
    },
    {
      number: "1000+",
      label: t("Happy Clients"),
      icon: Icons.IoPerson,
    },
    {
      number: "500+",
      label: t("Properties Sold"),
      icon: Icons.IoHomeOutline,
    },
    {
      number: "50+",
      label: t("Expert Consultants"),
      icon: Icons.GoPerson,
    },
  ];

  const features = [
    {
      icon: Icons.IoCheckmark,
      title: t("Tailored Solutions"),
      description: t(
        "Personalized property solutions for individuals and corporations"
      ),
    },
    {
      icon: Icons.HiOutlineGlobeAlt,
      title: t("Global Expertise"),
      description: t("Unrivaled expertise in local and international markets"),
    },
    {
      icon: Icons.IoChatbubbleEllipses,
      title: t("Trusted Partnership"),
      description: t(
        "Building lasting relationships with credibility and dedication"
      ),
    },
    {
      icon: Icons.IoStar,
      title: t("Industry Leader"),
      description: t(
        "One of the most important consultancy firms in the industry"
      ),
    },
  ];

  return (
    <section className="w-full py-12 md:py-10 lg:py-12 bg-gradient-to-br from-white via-gray-50/30 to-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full px-6 py-3 mb-6">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-primary font-semibold text-sm">
              {t("Premier Real Estate Consultancy")}
            </span>
          </div>

          <h2 className="text-[28px] md:text-[36px] lg:text-[48px] text-gray-900 font-bold mb-6 leading-tight">
            {t("Dubai's Trusted Real Estate Partner")}
          </h2>

          <p className="text-[16px] md:text-[18px] text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t(
              "A premier real estate consultancy headquartered in Dubai, UAE. With 20 years of unrivaled expertise in the local and international real estate market, we are the trusted partner for individuals and corporations seeking tailored property solutions."
            )}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 md:mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl mb-3 text-primary group-hover:scale-110 transition-transform duration-300">
                    <IconComponent size={32} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="text-4xl mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                    <IconComponent size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 md:mt-12">
          <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t("Ready to Start Your Real Estate Journey?")}
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              {t(
                "Let our expert consultants guide you through Dubai's dynamic real estate market with personalized solutions tailored to your needs."
              )}
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="bg-white text-primary font-semibold px-8 py-3 rounded-xl hover:bg-[#9f8151] hover:text-white transition-all duration-[.4s] cursor-pointer"
            >
              {t("Get Started Today")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremierMarketplace;
