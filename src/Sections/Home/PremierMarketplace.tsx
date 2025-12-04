import Icons from "@/Constants/Icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CountUp from "react-countup";

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
      icon: Icons.GoPerson,
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
    <section
      className="w-full py-12 md:py-10 lg:py-12 bg-gradient-to-br from-white via-gray-50/30 to-white"
      style={{ marginBottom: 45 }}
    >
      <div className="custom_container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <h1
            style={{ paddingBottom: 15 }}
            className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general"
          >
            {t("Dubai's Trusted Real Estate Partner")}
          </h1>

          <p className="down_styling para_styling">
            {t(
              "A premier real estate consultancy headquartered in Dubai, UAE. With 20 years of unrivaled expertise in the local and international real estate market, we are the trusted partner for individuals and corporations seeking tailored property solutions."
            )}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 md:mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;

            // split "1000+" into 1000 and "+"
            const numericValue = parseInt(stat.number.replace(/[^\d]/g, ""), 10);
            const suffix = stat.number.replace(/\d/g, "");

            return (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl mb-3 text-primary group-hover:scale-110 transition-transform duration-300">
                    <IconComponent size={32} />
                  </div>

                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2 !text-[#9f8151]">
                    <CountUp
                      end={numericValue}
                      duration={5}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                    {suffix}
                  </div>

                  <div className="text-sm text-gray-600 font-medium !text-[#0b4a35] font-semibold">
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
                  <h3 className="text-lg font-bold text-gray-900 mb-3 !text-[#9f8151]">
                    {feature.title}
                  </h3>
                  <p className="down_styling para_styling">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PremierMarketplace;
