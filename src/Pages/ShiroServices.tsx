import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import ServiceImagesUrl from "@/helpers/serviceImagesURL";
import ImagesUrl from "@/helpers/ImagesURL";
import { useNavigate } from "react-router-dom";
import ServicesContent from "./ServicesContent";
import { ContactForm } from "@/Sections/Home";

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
      <section className="relative w-full h-[91vh]">
        <img
          src={ImagesUrl("services_main_image.jpeg")}
          alt="Services Banner"
          className="w-full h-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

        <div
          className="
            custom_container
            absolute bottom-14 left-1/2 -translate-x-1/2
            flex flex-col items-center text-center gap-5 text-white
            md:bottom-28 md:left-0 md:translate-x-0 md:items-start md:text-left
          "
        >
          <h1 className="hidden md:block project_text font-bold !text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {t("UAE Expertise. Global Reach")}
          </h1>

          <p className="text-sm sm:text-base">
            <span className="text-white text-xl">
              {t(
                "Premium Real Estate Done Right — Smart and Secure with Shiro Estate"
              )}
            </span>
          </p>

          <button
              onClick={() => {
  const section = document.getElementById("list_with_us");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}}
            className="w-fit bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 shadow-lg transition"
          >
            {t("Enquire Now")}
          </button>
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
          </div>

          {/* Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                    className="transition-transform duration-500 group-hover:scale-110 w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-cover"
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
        <ContactForm />
      </div>
    </>
  );
};

export default ShiroServices;