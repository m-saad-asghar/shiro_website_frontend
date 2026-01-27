import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import ServiceImagesUrl from "@/helpers/serviceImagesURL";
import ImagesUrl from "@/helpers/ImagesURL";
import { useNavigate } from "react-router-dom";
import ServicesContent from "./ServicesContent";
import { ContactForm } from "@/Sections/Home";
import EnquireNowReactModal from "@/Components/Home/ContactForm/EnquireNowReactModal";

const ShiroServices = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
   * ✅ You will have TWO images per card:
   * - bgImage: background photo
   * - overlayImage: gold icon+text transparent image (png/webp)
   *
   * Put overlay images inside your same "services" images folder
   * e.g. properties_for_sale_overlay.png
   */
  const services = [
    {
      title: "Property For Sale",
      bgImage: "properties_for_sale.jpg",
      overlayImage: "properties_for_sale_overlay.png",
      link: "/buy/properties-for-sale",
    },
    {
      title: "Property For Rent",
      bgImage: "properties_for_rent.jpg",
      overlayImage: "properties_for_rent_overlay.png",
      link: "/rent/properties-for-rent",
    },
    {
      title: "List With Us",
      bgImage: "list_with_us.jpg",
      overlayImage: "list_with_us_overlay.png",
      link: "/list-your-property",
    },
    {
      title: "Property Management",
      bgImage: "property_management.jpg",
      overlayImage: "property_management_overlay.png",
      link: "/property-management",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Shiro Estate Services | Shiro Real Estate</title>
        <meta
          name="description"
          content="Learn about Shiro Real Estate, Dubai's premier property agency. Our experienced team provides exceptional real estate services with expertise and dedication."
        />
      </Helmet>

      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[91vh] overflow-hidden developer_listing_styling">
        <img
          src={ImagesUrl("services_main_image.jpg")}
          alt="Services Banner"
          className="w-full h-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

        <div className="custom_container develop_heading_styling">
          <h1 className="hidden md:block project_text font-bold !text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {t("Comprehensive Services in the UAE and Beyond")}
          </h1>

          <p className="text-sm sm:text-base">
            <span className="text-white text-xl">
              {t(
                "At Shiro Estate, we help private and corporate clients maximize returns and minimize risks in one of the world’s most dynamic property markets. We don’t just design tailored strategies for buying, selling, renting, or investing — we fully manage every project, from initial analysis and property selection to transaction execution and ongoing asset management."
              )}
            </span>
          </p>

          <EnquireNowReactModal
            title={t("ENQUIRE NOW")}
            display_name="enquire-now-button-click-from-services-page"
            project_name=""
            origin={t("Click | Enquire Now Button | Services Page")}
            showSuccessToast={true}
            showErrorToast={true}
            closeOnSuccess={true}
            trigger={(open) => (
              <button
                type="button"
                onClick={open}
                className="w-fit bg-[#094834] hover:bg-[#9f8151] change_border text-white font-semibold py-4 px-6 shadow-lg transition"
              >
                {t("Enquire Now")}
              </button>
            )}
          />
        </div>
      </section>

      {/* ================= SERVICES INTRO (BELOW HERO) ================= */}
      <div className="custom_container">
        <ServicesContent />
      </div>

      {/* ================= SERVICES GRID (BELOW INTRO) ================= */}
      <section className="w-full" style={{ marginBottom: 0, paddingBottom: 0 }}>
        <div className="custom_container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 style={{paddingBottom: 15}} className="hidden md:block text-[24px] sm:text-[28px] md:text-[32px] lg:text-[40px] font-bold text-white tracking-wide leading-tight content_general">
              {t("Our Services")}
            </h2>
            <p className="down_styling para_styling">
              {t(
                "Ready to turn your goals into tangible assets? Shiro Estate offers a full spectrum of professional solutions for both private and corporate clients, including:"
              )}
            </p>
          </div>

          {/* ✅ Services Cards (BG + Mask + Overlay Image) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {services.map((service, index) => (
              <div
                key={`${service.title}-${index}`}
                onClick={() => navigate(service.link)}
                className="group relative overflow-hidden change_border border border-primary/20 rounded-2xl cursor-pointer"
                style={{ height: 320 }}
              >
                {/* Background image */}
                <img
                  src={ServiceImagesUrl(service.bgImage)}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Black mask */}
                <div className="absolute inset-0 bg-black/45" />

                {/* Overlay gold icon+text image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={ServiceImagesUrl(service.overlayImage)}
                    alt={`${service.title} overlay`}
                    className="max-w-[100%] max-h-[100%] object-contain"
                    draggable={false}
                  />
                </div>

                {/* Optional hover glow */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="list_with_us" className="services_form_styling">
        <ContactForm display_name="contact-us-form-via-services-page-of-website" />
      </div>
    </>
  );
};

export default ShiroServices;
