import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import ServiceImagesUrl from "@/helpers/serviceImagesURL";
import ImagesUrl from "@/helpers/ImagesURL";
import { useNavigate } from "react-router-dom";
import ServicesContent from "./ServicesContent";
import { ContactForm } from "@/Sections/Home";
import PropertyManagementContent from "./PropertyManagementContent";
import Icons from "@/Constants/Icons";
import { motion } from "framer-motion";
import PropertyManagementCarousel from "@/Components/PropertyManagementCarousel";
import PropertyManagementWhyUs from "./PropertyManagementWhyUs";
import ProjectFaq from "./ProjectFaq";

const PropertyManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const property_management_faqs = [
  {
    id: 1,
    question: "How do I choose a property management company in Dubai?",
    answer:
      "Look at experience, reputation, service scope, reporting transparency, and knowledge of local legislation. Client reviews are also important.",
  },
  {
    id: 2,
    question: "Do you handle legal matters?",
    answer:
      "Yes. We manage lease agreements, assist with EJARI registration, and ensure full compliance with UAE property laws.",
  },
  {
    id: 3,
    question: "How much does property management cost?",
    answer:
      "The fee depends on the property type and service scope. Typically, it ranges from 5–10% of rental income.",
  },
];


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
          src={ServiceImagesUrl("property_management_main_image.avif")}
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
            {t("Shiro Estate delivers management for luxury properties in UAE and beyond.")}
          </h1>

          <p className="text-sm sm:text-base">
            <span className="text-white text-xl">
              {t(
                "At Shiro Estate, we help private and corporate clients maximize returns and minimize risks in one of the world’s most dynamic property markets. We don’t just design tailored strategies for buying, selling, renting, or investing — we fully manage every project, from initial analysis and property selection to transaction execution and ongoing asset management."
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
        <PropertyManagementContent />
      </div>

      <div className="custom_container mx-auto py-12 lg:py-15 pt-0 lg:pt-0">
         <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
                  {t("Property Management Services by Shiro Estate")}
                </h2>
                <p className="down_styling para_styling">
                  {t(
                    "Owning rental property requires time, expertise, and constant oversight. Tenant communication, legal matters, maintenance, inspections, and payments can quickly become stressful."
                  )}
                </p>
                 <p className="down_styling para_styling">
                  {t(
                    "We take this burden off the owner."
                  )}
                </p>
                 <p className="down_styling para_styling">
                  {t(
                    "As a professional real estate agency in Dubai, we provide a full management cycle and protect your interests at every stage."
                  )}
                </p>
                <p className="down_styling para_styling">
                  {t(
                    "You receive:"
                  )}
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icons.IoCheckmark size={16} className="text-white" />
                  </div>
                  <span className="tfont-semibold text-primary text-xl">
                    {t("Stable Income")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icons.IoCheckmark size={16} className="text-white" />
                  </div>
                  <span className="tfont-semibold text-primary text-xl">
                    {t("Transparent Reporting")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icons.IoCheckmark size={16} className="text-white" />
                  </div>
                  <span className="tfont-semibold text-primary text-xl">
                    {t("Property Preservation")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icons.IoCheckmark size={16} className="text-white" />
                  </div>
                  <span className="tfont-semibold text-primary text-xl">
                    {t("Confidence in Full Compliance with UAE Regulations")}
                  </span>
                </div>
              </div>
            </motion.div>
      </div>

    <PropertyManagementCarousel/>

    <div className="custom_container">
        <PropertyManagementWhyUs />
      </div>

      <div className="custom_container mx-auto py-12 lg:py-15 pt-0 lg:pt-0">
         <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
                  {t("Frequently Asked Questions")}
                </h2>
              </div>

              <div className="pb-0 lg:pb-5">
                <ProjectFaq faqs={property_management_faqs || []} />
              </div>

            </motion.div>
      </div>

      <div id="list_with_us" className="services_form_styling">
        <ContactForm />
      </div>
    </>
  );
};

export default PropertyManagement;