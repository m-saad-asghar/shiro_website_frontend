import Images from "@/Constants/Images";
import { useTranslation } from "react-i18next";

const ServicesAgency = () => {
  const { t } = useTranslation();

  return (
    <section className="py-10 lg:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content Section */}
            <div className="space-y-8 order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold rounded-full px-6 py-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>{t("Trusted Agency")}</span>
              </div>

              {/* Main Title */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
                {t("Shiro – The Most")}
                <span className="block text-primary">
                  {t("Trusted Property Services Agency")}
                </span>
              </h2>

              {/* Description */}
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                {t(
                  "With Shiro as your partner, you can confidently navigate real estate transactions in Dubai from anywhere in the world. Whether you seek the best investment opportunities, competitive property mortgage rates, or an ideal tenant for your rental home, our dedicated team is committed to providing our clients with a hassle-free experience from A to Z."
                )}
              </p>

              {/* Features List */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    {t("Global Real Estate Expertise")}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    {t("Competitive Mortgage Rates")}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    {t("Hassle-Free Experience")}
                  </span>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                    20+
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("Years Experience")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                    1000+
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("Happy Clients")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                    98%
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("Success Rate")}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="order-1 lg:order-2">
              <div className="relative group">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={Images.imgServicesSecond}
                    alt="Shiro Property Services"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full opacity-50" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full opacity-30" />

                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-lg font-bold">★</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {t("Trusted Partner")}
                      </div>
                      <div className="text-xs text-gray-600">
                        {t("Since 2008")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesAgency;
