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

type Slide = {
  title: string;
  desc: string;
  img: string;
};

const slides: Slide[] = [
  {
    title: "Strengthening Market Leadership",
    desc: "To become the unquestioned benchmark of trust and expertise in Dubai and international real estate.",
    img: "leadership.jpg",
  },
  {
    title: "Driving Innovation",
    desc: "Implementing advanced strategies and digital tools within the property sector.",
    img: "driving.jpg",
  },
  {
    title: "Shaping the Future of the Market",
    desc: "Actively contributing to the development of new standards in quality, transparency, and service across the region.",
    img: "future.jpg",
  },
  {
    title: "Expanding Our Client Network",
    desc: "Building strong, long-term relationships through consistently successful transactions.",
    img: "expand.jpg",
  },
  {
    title: "Developing a Strategic Partner Network",
    desc: "Through a mutually beneficial referral program, we empower professionals with new income opportunities while strengthening our market presence.",
    img: "developing.jpg",
  },
  {
    title: "Access to Exclusive Opportunities",
    desc: "Providing clients with privileged access to the most liquid and high-yield investment assets.",
    img: "access.jpg",
  },
];

const arrowClass =
  "bg-white/90 hover:bg-white text-primary border-0 z-10";

const MarketGoalsCarousel: React.FC = () => {
    const { t } = useTranslation();
  return (
    <section className="w-full">
      <div className="custom_container mx-auto px-4">


          {/* <div className="custom_container py-15 lg:py-20 !pb-0"> */}
         <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
        {t("Our Goals")}
      </h1>
       <p className="down_styling para_styling">
                {t(
            "Your success is our priority. From the first consultation to post-purchase support, we make the process smooth, transparent, and rewarding, so you achieve a result that truly works for you."
          )}
</p>

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
                    src={aboutImagesUrl(item.img)}
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

export default MarketGoalsCarousel;