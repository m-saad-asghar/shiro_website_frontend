import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Icons from "@/Constants/Icons";

type AvailableOptionsProps = {
  sectionType?: "buy" | "rent" | "projects";
};

const AvailableOptions = ({ sectionType }: AvailableOptionsProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  // Determine section type from URL if not provided
  const currentSection =
    sectionType ||
    (location.pathname.split("/")[1] as "buy" | "rent" | "projects");

  // Content based on section
  const getSectionContent = () => {
    switch (currentSection) {
      case "buy":
        return {
          icon: Icons.IoHomeOutline,
          title: t("Luxury Properties for Sale in Dubai"),
          subtitle: t("Discover Premium Real Estate Investment Opportunities"),
          description: t(
            "Dubai has become synonymous with luxury living and is one of the world's most desirable cities to invest in real estate. Known for its gleaming skyscrapers, ultra-modern developments, and high-end lifestyle, Dubai offers a wealth of luxury properties for sale that appeal to both international investors and local residents."
          ),
          features: [
            t("Exquisite beachfront villas"),
            t("Opulent penthouses with skyline views"),
            t("Prime locations like Palm Jumeirah"),
            t("State-of-the-art amenities"),
          ],
          additionalInfo: t(
            "From spacious villas with private pools to premium penthouses with panoramic views of the Arabian Gulf and Dubai's iconic landmarks, the city's real estate market has become an investment hotspot due to its unique blend of luxury, innovation, and global connectivity."
          ),
          ctaText: t("Explore Properties for Sale"),
        };

      case "rent":
        return {
          icon: Icons.IoTimeOutline,
          title: t("Premium Rental Properties in Dubai"),
          subtitle: t("Find Your Perfect Home in the Heart of Innovation"),
          description: t(
            "Dubai's rental market offers an exceptional range of properties that cater to diverse lifestyles and preferences. From modern apartments in bustling city centers to luxurious villas in exclusive communities, Dubai provides rental options that combine comfort, convenience, and world-class amenities."
          ),
          features: [
            t("Fully furnished luxury apartments"),
            t("Family-friendly villa communities"),
            t("Business district office spaces"),
            t("Flexible lease terms available"),
          ],
          additionalInfo: t(
            "Whether you're seeking a temporary residence, establishing a business presence, or looking for a long-term home, Dubai's rental market provides unmatched variety in prime locations with access to international schools, healthcare facilities, and entertainment hubs."
          ),
          ctaText: t("Browse Rental Properties"),
        };

      case "projects":
        return {
          icon: Icons.IoStar,
          title: t("Off-Plan Projects in Dubai"),
          subtitle: t("Invest in Tomorrow's Architectural Marvels Today"),
          description: t(
            "Dubai's off-plan projects represent the future of urban living, featuring innovative designs, cutting-edge technology, and sustainable development practices. These projects offer investors the opportunity to secure premium properties at pre-construction prices with attractive payment plans."
          ),
          features: [
            t("Innovative architectural designs"),
            t("Smart home technology integration"),
            t("Sustainable development practices"),
            t("Flexible payment plans available"),
          ],
          additionalInfo: t(
            "From waterfront developments to sky-high towers, Dubai's off-plan projects are developed by renowned international developers, ensuring world-class quality and promising significant appreciation potential for early investors."
          ),
          ctaText: t("Discover New Projects"),
        };

      default:
        return {
          icon: Icons.IoHomeOutline,
          title: t("Luxury Properties for Sale in Dubai"),
          subtitle: t("Discover Premium Real Estate Investment Opportunities"),
          description: t(
            "Dubai has become synonymous with luxury living and is one of the world's most desirable cities to invest in real estate."
          ),
          features: [
            t("Exquisite beachfront villas"),
            t("Opulent penthouses with skyline views"),
            t("Prime locations like Palm Jumeirah"),
            t("State-of-the-art amenities"),
          ],
          additionalInfo: t(
            "From spacious villas with private pools to premium penthouses with panoramic views of the Arabian Gulf and Dubai's iconic landmarks."
          ),
          ctaText: t("Explore Properties"),
        };
    }
  };

  const content = getSectionContent();
  const IconComponent = content.icon;

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 md:py-10 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
              <IconComponent size={16} />
              <span>{t("Why Choose Dubai")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {content.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {content.subtitle}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {content.description}
                </p>

                {/* Features List */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {t("Key Features")}:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {content.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                {content.additionalInfo}
              </p>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-white">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <IconComponent size={32} className="text-white" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      {t("Ready to Get Started?")}
                    </h3>
                    <p className="text-white/90 mb-6 leading-relaxed">
                      {t(
                        "Connect with our expert team to find the perfect property that matches your needs and investment goals."
                      )}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 py-6 border-t border-white/20">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">1000+</div>
                      <div className="text-sm text-white/80">
                        {t("Properties")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">20+</div>
                      <div className="text-sm text-white/80">{t("Years")}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">98%</div>
                      <div className="text-sm text-white/80">
                        {t("Satisfied")}
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-white text-primary font-semibold py-3 px-6 rounded-xl hover:bg-[#9f8151] hover:text-white transition-all duration-[.4s]">
                    {content.ctaText}
                  </button>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-primary font-semibold cursor-pointer group hover:gap-3 transition-all duration-300">
              <span>{t("Learn More About Dubai Real Estate")}</span>
              <Icons.IoIosArrowForward
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailableOptions;
