import { lazy, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carousel";
import { Skeleton } from "@/Components/ui/skeleton";
import { useTranslation } from "react-i18next";

// Lazy load card
const CardUpdated = lazy(() =>
  import("../../Components/Home/ExploreProperty/CardUpdated").then((m) => ({
    default: m.default,
  }))
);

type AgentPropertiesProps = {
  listings: any[];
};

const AgentProperties = ({ listings }: AgentPropertiesProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const renderSkeleton = useMemo(
    () =>
      [...Array(3)].map((_, i) => (
        <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
          <Skeleton className="w-full h-[320px] md:h-[450px] change_border bg-gray-200" />
        </CarouselItem>
      )),
    []
  );

  const renderCards = useMemo(() => {
    if (!Array.isArray(listings) || listings.length === 0) {
      return (
        <CarouselItem className="w-full">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {t("No Properties Available")}
            </p>
          </div>
        </CarouselItem>
      );
    }

    return listings.map((item, index) => (
      <CarouselItem
        key={item?.id || index}
        className="md:basis-1/2 lg:basis-1/3"
      >
        <CardUpdated item={item} />
      </CarouselItem>
    ));
  }, [listings, t]);

  return (
    <section className="w-full py-6 explore_properties_styling">
      <div className="custom_container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
          {t("Listings")}
        </h2>

        <div className="relative">
          <Carousel
            dir={isRTL ? "rtl" : "ltr"}
            opts={{ align: "start", loop: false }}
          >
            <CarouselContent className={isRTL ? "flex-row-reverse" : ""}>
              {listings ? renderCards : renderSkeleton}
            </CarouselContent>

            {/* Navigation */}
            <CarouselNext className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2" />
            <CarouselPrevious className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default AgentProperties;