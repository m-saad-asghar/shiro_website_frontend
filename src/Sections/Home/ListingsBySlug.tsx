import { lazy } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carousel";
import { Skeleton } from "@/Components/ui/skeleton";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Lazy load CardUpdatedListings
const CardUpdatedListings = lazy(() =>
  import("../../Components/Home/ExploreProperty/CardUpdatedListings").then((module) => ({
    default: module.default,
  }))
);

type ListingBySlugProps = {
  community_name: string; // ✅ comes from parent now
};

const ListingBySlug = ({ community_name }: ListingBySlugProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [apiData, setApiData] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">(
    "idle"
  );

  useEffect(() => {
    const fetchListings = async () => {
      if (!community_name) return;

      try {
        setStatus("pending");

        const base = (import.meta as any).env?.VITE_API_URL || "";

const params = new URLSearchParams({
  community_name,
});

const url = `${base.replace(/\/$/, "")}/listings_by_slug?${params.toString()}`;

const res = await fetch(url, {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
});

        // const base = (import.meta as any).env?.VITE_API_URL || "";
        // const url = `${base.replace(/\/$/, "")}/listings_by_slug`;

        // const res = await fetch(url, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ community_name }),
        // });

        const json = await res.json();
        setApiData(json);
        setStatus("success");
      } catch (err) {
        console.log("[ListingBySlug] Request failed", err);
        setStatus("error");
      }
    };

    fetchListings();
  }, [community_name]);

  const renderSkeletonCard = useMemo(() => {
    return [...Array(3)].map((_, index: number) => (
      <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={index}>
        <Skeleton className="w-full h-[320px] md:h-[450px] change_border bg-gray-200" />
      </CarouselItem>
    ));
  }, []);

  const renderCards = useMemo(() => {
    const listings =
      apiData?.data?.listings ||
      apiData?.data?.data?.listings ||
      apiData?.listings ||
      [];

    if (!Array.isArray(listings) || listings.length === 0) {
      return (
        <CarouselItem className="w-full">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {t("No Listings Available at the Moment")}
            </p>
          </div>
        </CarouselItem>
      );
    }

    return listings.map((item: any, index: number) => (
      <CarouselItem
        className="md:basis-1/2 lg:basis-1/3"
        key={item?.id || index}
      >
        <CardUpdatedListings item={item} />
      </CarouselItem>
    ));
  }, [apiData, t]);

  return (
    <section className="w-full py-6 md:py-6 lg:py-6 explore_properties_styling">
      <div className="custom_container mx-auto px-4">
        <div className="mx-auto">
          <div className="mb-6 md:mb-8">
            <h2 className="w-full text-[22px] sm:text-[26px] md:text-[34px] lg:text-[44px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
              {t("Properties in {{community_name}}", { community_name })}
            </h2>
          </div>

          <div className="relative">
            <Carousel
              dir={isRTL ? "rtl" : ""}
              className="w-full"
              opts={{
                loop: false,
                align: "start",
                skipSnaps: false,
              }}
            >
              <CarouselContent className={isRTL ? "flex-row-reverse" : ""}>
                {status === "pending" || status === "error"
                  ? renderSkeletonCard
                  : renderCards}
              </CarouselContent>

              {/* navigation */}
              <div
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <CarouselNext
                  className="w-12 h-12 bg-white border-2 border-[#094834]/30 text-[#094834] hover:bg-[#094834] hover:text-white hover:border-[#094834] rounded-full shadow-lg transition-all duration-200 cursor-pointer"
                  aria-label="Next listings"
                />
              </div>

              <div
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <CarouselPrevious
                  className="w-12 h-12 bg-white border-2 border-[#094834]/30 text-[#094834] hover:bg-[#094834] hover:text-white hover:border-[#094834] rounded-full shadow-lg transition-all duration-200 cursor-pointer"
                  aria-label="Previous listings"
                />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListingBySlug;