import { useTranslation } from "react-i18next";
import Images from "../../Constants/Images";
import File from "../../assets/PDF/SHIRO ESTATE - Company Profile.pdf";
import { saveAs } from "file-saver";

const Box = () => {
  const { t } = useTranslation();

  const handleDownload = () => {
    saveAs(File, "SHIRO-Company-Profile.pdf");
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="p-6 md:p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Content Section */}
              <div className="space-y-6 order-2 lg:order-1">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-6 py-3 mb-6">
                    <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
                    <span className="text-[#094834] font-medium text-sm">
                      {t("Company Profile")}
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {t(
                      "Shiro Top Branded Real Estate Agency In The UAE Company Profile"
                    )}
                  </h2>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-lg">
                    {t(
                      "The leading agency for premium real estate in the UAE. Explore our vision, services, and portfolio in the official Shiro company profile."
                    )}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#094834] text-white font-semibold rounded-xl hover:bg-[#9f8151] transition-all duration-[.4s] cursor-pointer w-full"
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {t("Download Our Profile")}
                    </span>
                  </button>
                </div>
              </div>

              {/* Image Section - Updated with larger size and overflow effect */}
              <div className="relative order-1 lg:order-2 overflow-hidden">
                <div className="flex items-center justify-center lg:justify-end">
                  <div className="relative transform scale-105 lg:scale-115 translate-x-4 lg:translate-x-8">
                    <img
                      src={Images.imgBox1}
                      alt="SHIRO Company Profile"
                      className="w-full h-auto max-w-md mx-auto lg:max-w-none lg:w-[500px] lg:h-[350px] object-cover shadow-xl"
                    />
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

export default Box;
