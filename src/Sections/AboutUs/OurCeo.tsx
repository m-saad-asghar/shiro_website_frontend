import ImagesUrl from "@/helpers/ImagesURL";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";

type OurCeoProps = {
  item: any;
};

const OurCeo: FC<OurCeoProps> = ({ item }) => {
  const { t } = useTranslation();

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold rounded-full px-6 py-3 mb-6">
              <Icons.IoPerson size={16} />
              <span>{t("Leadership")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {t("A Word From Our CEO")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t(
                "Discover the vision and leadership that drives our success in Dubai's real estate market"
              )}
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.IoIosArrowUp size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">20+</h3>
              <p className="text-gray-600 text-sm">{t("Years Experience")}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.IoHomeOutline size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600 text-sm">{t("Properties Sold")}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.IoPerson size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600 text-sm">{t("Happy Clients")}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.IoStar size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">98%</h3>
              <p className="text-gray-600 text-sm">{t("Success Rate")}</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column - CEO Message & Image */}
            <div className="space-y-8">
              {/* CEO Image Section */}
              <div className="relative group">
                {/* Main CEO Image - ADD YOUR IMAGE HERE */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={
                      ImagesUrl(item?.manager_image) ||
                      "/path/to/your/ceo-main-image.jpg"
                    }
                    alt={item?.manager_name || "CEO"}
                    className="w-full h-[400px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* CEO Info Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item?.manager_name || "CEO Name"}
                      </h3>
                      <p className="text-primary font-semibold text-sm uppercase tracking-wide">
                        {item?.manager_position || "Chief Executive Officer"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full opacity-50" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full opacity-30" />
              </div>

              {/* CEO Message */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icons.IoChatbubbleEllipses
                      size={24}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {t("CEO Message")}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {t("Direct from our leadership")}
                    </p>
                  </div>
                </div>

                <blockquote className="text-lg text-gray-700 leading-relaxed italic border-l-4 border-primary pl-6">
                  "
                  {item?.manager_description ||
                    "Your CEO message will appear here..."}
                  "
                </blockquote>
              </div>

              {/* CEO Achievements */}
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <Icons.IoStar size={20} className="text-primary" />
                  {t("Key Achievements")}
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-700">
                      {t("Led company to 300% growth in 5 years")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-700">
                      {t("Expanded operations to 3 new markets")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-700">
                      {t("Received 5 industry awards")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-700">
                      {t("Built team of 50+ professionals")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Our Goals */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icons.IoIosArrowUp size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {t("Our Goals")}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {t("What we strive to achieve")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {item?.Our_value &&
                  Array.isArray(item?.Our_value) &&
                  item?.Our_value.length > 0 ? (
                    item?.Our_value.map((goal: any, index: number) => (
                      <div
                        key={goal?.id || index}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">
                            {goal?.title || `Goal ${index + 1}`}
                          </h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {goal?.description ||
                              "Goal description will appear here..."}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Icons.IoIosInformationCircleOutline
                        size={48}
                        className="mx-auto mb-4 text-gray-300"
                      />
                      <p>{t("Goals will be displayed here")}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Core Values */}
              <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <Icons.IoHeartOutline size={20} className="text-primary" />
                  {t("Core Values")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Icons.IoCheckmark size={16} className="text-primary" />
                    </div>
                    <span className="text-gray-700 text-sm">
                      {t("Integrity")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Icons.IoCheckmark size={16} className="text-primary" />
                    </div>
                    <span className="text-gray-700 text-sm">
                      {t("Excellence")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Icons.IoCheckmark size={16} className="text-primary" />
                    </div>
                    <span className="text-gray-700 text-sm">
                      {t("Innovation")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Icons.IoCheckmark size={16} className="text-primary" />
                    </div>
                    <span className="text-gray-700 text-sm">{t("Trust")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Company Details */}
            <div className="space-y-8">
              {/* Mission & Vision */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icons.IoStar size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {t("Our Foundation")}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {t("Mission, Vision & Philosophy")}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="group">
                    <h5 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                      <Icons.IoIosArrowForward size={16} />
                      {t("Mission")}
                    </h5>
                    <p className="text-gray-700 leading-relaxed pl-6">
                      {item?.mission ||
                        "Your mission statement will appear here..."}
                    </p>
                  </div>

                  <div className="group">
                    <h5 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                      <Icons.IoIosArrowForward size={16} />
                      {t("Vision")}
                    </h5>
                    <p className="text-gray-700 leading-relaxed pl-6">
                      {item?.vision ||
                        "Your vision statement will appear here..."}
                    </p>
                  </div>

                  <div className="group">
                    <h5 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                      <Icons.IoIosArrowForward size={16} />
                      {t("Philosophy")}
                    </h5>
                    <p className="text-gray-700 leading-relaxed pl-6">
                      {item?.philosophy ||
                        "Your philosophy statement will appear here..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Services & Partners */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icons.IoLink size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {t("Partnerships & Services")}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {t("Our network and offerings")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("Partners")}
                    </h5>
                    <p className="text-gray-700 leading-relaxed">
                      {item?.text_partner ||
                        "Your partner information will appear here..."}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("Services")}
                    </h5>
                    <p className="text-gray-700 leading-relaxed">
                      {item?.text_services ||
                        "Your services information will appear here..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Description - Full Width */}
          <div className="mt-8 lg:mt-16">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icons.IoIosInformationCircleOutline
                    size={24}
                    className="text-primary"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {t("About Our Company")}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t("Learn more about us")}
                  </p>
                </div>
              </div>

              <div className="prose prose-gray max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      item?.description ||
                      "<p>Company description will appear here...</p>",
                  }}
                  className="text-gray-700 leading-relaxed"
                />

                {item?.sub_description && (
                  <p className="text-gray-600 mt-4 leading-relaxed">
                    {item?.sub_description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="mt-16 lg:mt-24 bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 lg:p-12 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {t("Ready to Work With Us?")}
              </h3>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                {t(
                  "Join thousands of satisfied clients who have trusted us with their real estate needs"
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary font-semibold px-8 py-3 rounded-xl hover:bg-[#9f8151] hover:text-white transition-all duration-[.4s]">
                  {t("Get Started Today")}
                </button>
                <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#9f8151] hover:border-[#9f8151] transition-all duration-[.4s]">
                  {t("Learn More")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurCeo;
