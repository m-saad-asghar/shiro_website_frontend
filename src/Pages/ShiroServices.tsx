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

  // SERVICES DATA WITH LINKS
  const services = [
    {
      title: "Property For Sale",
      image: "properties_for_sale.jpg",
      link: "/buy/properties-for-sale",
    },
     {
      title: "Property For Rent",
      image: "properties_for_rent.jpg",
      link: "/rent/properties-for-rent",
    },
     {
      title: "List With Us",
      image: "list_with_us.webp",
      link: "/list-your-property",
    },
    {
      title: "Property Management",
      image: "property_management.webp",
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

        <div
          className="
            custom_container
            develop_heading_styling
          "
        >
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

          {/* <button
              onClick={() => {
  const section = document.getElementById("list_with_us");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}}
            className="w-fit bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 shadow-lg transition"
          >
            {t("Enquire Now")}
          </button> */}
        </div>
      </section>

      {/* ================= SERVICES INTRO (BELOW HERO) ================= */}
      <div className="custom_container">
        <ServicesContent />
      </div>

      {/* ================= SERVICES GRID (BELOW INTRO) ================= */}
      <section
        className="w-full"
        style={{ marginBottom: 0, paddingBottom: 0 }}
      >
        <div className="custom_container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="hidden md:block text-[24px] sm:text-[28px] md:text-[32px] lg:text-[40px] font-bold text-white tracking-wide leading-tight content_general">
              {t("Our Services")}
            </h2>
            <p className="down_styling para_styling">
              Ready to turn your goals into tangible assets? Shiro Estate offers a full spectrum of professional solutions for both private and corporate clients, including:
              </p>
          </div>

          {/* Services Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
  {services.map((service, index) => (
    <div
      key={`${service.title}-${index}`}
      onClick={() => navigate(service.link)}
      className="group bg-white change_border border border-primary/20 overflow-hidden h-full flex flex-col transition-transform duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="overflow-hidden relative">
        <img
          src={ServiceImagesUrl(service.image)}
          alt={service.title}
          className="
            transition-transform duration-500 group-hover:scale-110
            w-full object-cover
            h-[220px]
            sm:h-[260px]
            md:h-[300px]
            xl:h-[260px]
          "
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Title */}
      <div className="p-4 md:p-5">
        <h3 className="font-semibold text-primary text-xl">
          {t(service.title)}
        </h3>
      </div>
    </div>
  ))}
</div>

        </div>
      </section>
      <div id="list_with_us" className="services_form_styling">
        <ContactForm display_name="contact-us-form-via-services-page-of-website"/>
      </div>
    </>
  );
};

export default ShiroServices;