// MarketGoalsCarousel.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carousel";
import aboutImagesUrl from "@/helpers/aboutImagesURL copy";
import ServiceImagesUrl from "@/helpers/serviceImagesURL";

type Slide = {
  title: string;
  desc: string;
  img: string;
};

const slides: Slide[] = [
  {
    title: "Personal Manager",
    desc: "A dedicated specialist is assigned to you as a single point of contact. They oversee all processes, keep you informed, and resolve any issues promptly.",
    img: "personal_manager.webp",
  },
  {
    title: "Property Valuation",
    desc: "A Shiro Estate expert conducts a comprehensive assessment and calculates potential rental yield.",
    img: "property_valuation.jpg",
  },
  {
    title: "Tenant Management",
    desc: "We handle communication, tenant screening, contract signing, payment control, and deposit management. The rental process runs smoothly and without vacancies.",
    img: "tenent_management.jpg",
  },
  {
    title: "Legal Support",
    desc: "Preparation of lease agreements, assistance with EJARI registration, protection of landlord and tenant rights, and support with lease renewal or termination.",
    img: "legal_support.jpg",
  },
  {
    title: "Financial Control & Reporting",
    desc: "Monitoring of rental payments, transparent reports, and a clear income structure. You always know how much your property is earning.",
    img: "reporting.jpg",
  },
  {
    title: "Technical Maintenance",
    desc: "Prompt resolution of technical issues, coordination with contractors and tenants, and quality control—without your involvement.",
    img: "technical_maintenance.jpg",
  },
   {
    title: "Regular Inspections",
    desc: "Property condition checks during tenant move-in/move-out, photo reports, and documentation to preserve asset value.",
    img: "regular_inspection.jpg",
  },
];

const arrowClass =
  "bg-white/90 hover:bg-white text-primary border-0 z-10";

const PropertyManagementCarousel: React.FC = () => {
    const { t } = useTranslation();
  return (
    <section className="w-full">
      <div className="custom_container mx-auto px-4">


          {/* <div className="custom_container py-15 lg:py-20 !pb-0"> */}
         <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
        {t("What We Do as Your Property Management Company")}
      </h1>

      {/* </div> */}


        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full relative"
          style={{marginTop: 40}}
        >
          <CarouselContent className="-ml-4">
            {slides.map((item, idx) => (
              <CarouselItem
                key={idx}
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="group relative h-[460px] overflow-hidden change_border border border-primary/20 bg-white">
                  {/* Image */}
                  <img
                    src={ServiceImagesUrl(item.img)}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradients */}
                  <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Title */}
                  <div className="absolute left-4 right-4 top-4">
                    <h3 className="font-semibold text-primary text-2xl text-white">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="absolute left-4 right-4 bottom-4">
                    <p className="rounded-lg text-sm transition-all duration-200 mb-1 mt-1 text-[#FFFFFF] text_stying">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Arrows – clean, no shadow */}
          <CarouselPrevious
            className={`hidden md:flex absolute top-1/2 left-3 -translate-y-1/2 ${arrowClass}`}
          />
          <CarouselNext
            className={`hidden md:flex absolute top-1/2 right-3 -translate-y-1/2 ${arrowClass}`}
          />
        </Carousel>
      </div>
    </section>
  );
};

export default PropertyManagementCarousel;