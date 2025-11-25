import { Skeleton } from "@/Components/ui/skeleton";
import useQueryGet from "@/hooks/useQueryGet";
import StaticServices from "@/Services/StaticServices";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ImagesUrl from "@/helpers/ImagesURL";
import Icons from "@/Constants/Icons";
import Images from "@/Constants/Images";

const OurTeam = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

  // Fetch brokers only from team API
  const { data: teamData, status } = useQueryGet(["brokers"], () =>
    StaticServices.OurTeam({ team_type: "brokers" })
  );

  // Calculate slides per view based on screen size
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3); // Desktop: 3 brokers
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2); // Tablet: 2 brokers
      } else {
        setSlidesPerView(1); // Mobile: 1 broker
      }
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  // Get brokers from team data
  const brokers = useMemo(() => {
    if (teamData?.team_by_type?.brokers) {
      return teamData.team_by_type.brokers;
    }
    if (Array.isArray(teamData?.team)) {
      return teamData.team.filter(
        (member: any) => member.team_type === "brokers"
      );
    }
    return [];
  }, [teamData]);

  const totalSlides = Math.ceil((brokers?.length || 0) / slidesPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const handleCardClick = (brokerId: number) => {
    // Find broker name to create slug
    const broker = brokers?.find((b: any) => b.id === brokerId);
    // Create slug from name only - no ID needed
    const slug =
      broker?.name
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "team-member";
    navigate(`/team-member/${slug}`);
  };

  const getVisibleBrokers = () => {
    const startIndex = currentSlide * slidesPerView;
    return brokers?.slice(startIndex, startIndex + slidesPerView) || [];
  };

  const renderSkeletonCards = useMemo(() => {
    return [...Array(3)].map((_, index: number) => (
      <div key={index} className="flex flex-col items-center text-center">
        <Skeleton className="w-32 h-32 rounded-full mb-4" />
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    ));
  }, []);

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 md:py-10 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            <Icons.IoPerson size={16} />
            <span>{t("Our Expert Brokers")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t("Meet Our Professional Brokers")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t(
              "Connect with our licensed real estate brokers who are dedicated to helping you find your perfect property in Dubai"
            )}
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {status === "pending" || status === "error" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderSkeletonCards}
            </div>
          ) : (
            <>
              {/* Brokers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {getVisibleBrokers().map(
                  (broker: {
                    id: number;
                    name: string;
                    image?: string;
                    image_url?: string;
                    position?: string;
                  }) => (
                    <div
                      key={broker.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                      onClick={() => handleCardClick(broker.id)}
                    >
                      {/* Broker Image Container */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={broker.image_url || ImagesUrl(broker.image)}
                          alt={broker.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = Images.unknownPerson;
                          }}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Contact Info Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                            <div className="flex items-center justify-center gap-3">
                              <button className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#9f8151] transition-all duration-[.4s]">
                                <Icons.LuPhone size={16} />
                                {t("Contact")}
                              </button>
                              <button className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-[#9f8151] transition-all duration-[.4s]">
                                <Icons.FaWhatsapp size={16} />
                                {t("WhatsApp")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Broker Info */}
                      <div className="p-6">
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                            {broker.name}
                          </h3>
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <p className="text-primary font-semibold text-sm">
                              {broker.position || t("Real Estate Broker")}
                            </p>
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          </div>
                        </div>

                        {/* View Profile Button */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <button className="w-full px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-[#9f8151] hover:text-white transition-all duration-[.4s]">
                            {t("View Profile")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Navigation Controls */}
              {totalSlides > 1 && (
                <div className="flex flex-col items-center space-y-6">
                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-6">
                    <button
                      onClick={prevSlide}
                      className="group p-3 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-[#9f8151] hover:text-white hover:border-[#9f8151] transition-all duration-[.4s] disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={totalSlides <= 1}
                    >
                      <Icons.IoIosArrowBack className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    </button>

                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-100">
                      <span className="text-sm font-semibold text-gray-900">
                        {currentSlide + 1}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-sm text-gray-600">
                        {totalSlides}
                      </span>
                    </div>

                    <button
                      onClick={nextSlide}
                      className="group p-3 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-[#9f8151] hover:text-white hover:border-[#9f8151] transition-all duration-[.4s] disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={totalSlides <= 1}
                    >
                      <Icons.IoIosArrowForward className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    </button>
                  </div>

                  {/* Dots Indicators */}
                  <div className="flex space-x-3">
                    {Array.from({ length: totalSlides }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? "bg-primary scale-125"
                            : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="text-center mt-12">
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">
                    {t("Ready to Find Your Dream Property?")}
                  </h3>
                  <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                    {t(
                      "Our expert team is here to guide you through every step of your real estate journey in Dubai"
                    )}
                  </p>
                  <button
                    onClick={() => navigate("/contact")}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-[#9f8151] hover:text-white transition-all duration-[.4s]"
                  >
                    <Icons.IoChatbubbleEllipses size={20} />
                    {t("Get Started Today")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
