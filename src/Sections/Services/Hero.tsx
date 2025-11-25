import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full h-[600px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden">
      {/* Background Image with Modern Overlay */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-hero-about bg-cover bg-center bg-no-repeat" />

        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Additional Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-20 w-24 h-24 bg-white/8 rounded-full blur-2xl" />
          <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="mb-6 lg:mb-8">
              <nav className="flex items-center space-x-2 text-sm">
                <span className="text-white/70 hover:text-white transition-colors cursor-pointer">
                  {t("Home")}
                </span>
                <span className="text-white/50">/</span>
                <span className="text-white font-medium">{t("Services")}</span>
              </nav>
            </div>

            {/* Hero Content */}
            <div className="space-y-6 lg:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-sm font-medium rounded-full px-6 py-3 border border-white/20">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span>{t("Premium Services")}</span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight">
                {t("Top-Notch Property")}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  {t("Services in Dubai")}
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed">
                {t(
                  "We provide turnkey solutions to help you reap the best returns on your investment."
                )}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 lg:mt-12">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-white text-sm font-medium">
                    {t("Expert Consultation")}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-white text-sm font-medium">
                    {t("Premium Properties")}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-white text-sm font-medium">
                    {t("24/7 Support")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
