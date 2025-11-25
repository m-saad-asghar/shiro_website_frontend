import { lazy } from "react";

// Lazy load the Card component
const Card = lazy(() =>
  import("../../Components/Home/ExploreProperty").then((module) => ({
    default: module.Card,
  }))
);

// Lazy load the ProjectCard component
const ProjectCard = lazy(() => import("../../Components/Property/ProjectCard"));
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carousel";
import UseQueryPost from "@/hooks/useQueryPost";
import PropertiesServices from "@/Services/PropertiesServices";
import { useContext, useMemo, useState, useEffect } from "react";
import { TypesContext } from "@/Context/TypesContext";
import { Skeleton } from "@/Components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface TypeItem {
  id: number;
  name: string;
  for_agent: boolean;
  for_developer: boolean;
}

const ExploreProperty = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const { data, status } = useContext(TypesContext);
  const [id, setId] = useState<undefined | number>(undefined);

  const renderTypes = useMemo(() => {
    return data?.types?.map((item: TypeItem) => (
      <button
        onClick={() => setId(item?.id)}
        key={item?.id}
        className={`
          px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-200 
          border-2 hover:scale-105 active:scale-95 cursor-pointer
                     ${
                       item?.id === id
                         ? "bg-[#094834] border-[#094834] text-white shadow-lg"
                         : "bg-white border-[#094834]/30 text-[#094834] hover:border-[#094834] hover:bg-[#094834]/5"
                     }
          ${isRTL ? "rtl:px-4 rtl:md:px-6" : "ltr:px-4 ltr:md:px-6"}
        `}
        aria-label={`Select ${item?.name} property type`}
      >
        {item?.name}
      </button>
    ));
  }, [data, id, isRTL]);

  const onSubmit = () => {
    if (id) {
      // If a specific category is selected
      if (data?.types[0]?.id == id) {
        navigate("/buy/properties-for-sale");
      } else if (data?.types[1]?.id == id) {
        navigate("/rent/properties-for-rent");
      } else if (data?.types[2]?.id == id) {
        navigate("/new-projects");
      } else {
        navigate("/new-projects");
      }
    } else {
      // If no category selected, go to buy page
      navigate("/buy/properties-for-sale");
    }
  };

  const renderSkelton = useMemo(() => {
    return [...Array(3)].map((_, index: number) => (
      <Skeleton
        className="h-[46px] w-[88px] md:w-[120px] rounded-xl bg-gray-200"
        key={index}
      />
    ));
  }, []);

  const renderSkeltonCard = useMemo(() => {
    return [...Array(3)].map((_, index: number) => (
      <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={index}>
        <Skeleton className="w-full h-[320px] md:h-[450px] rounded-xl bg-gray-200" />
      </CarouselItem>
    ));
  }, []);

  // Optimize data fetching - fetch properties for main display
  const {
    mutateAsync,
    data: AllProperties,
    status: propertiesStatus,
  } = UseQueryPost(["HomeProperties", id || "all"], PropertiesServices.Search);

  // Fetch properties when component loads or category changes
  useEffect(() => {
    const searchParams = {
      is_home: 1,
      is_sale: true,
      per_page: 6,
      ...(id && { type_id: id }),
    };
    mutateAsync(searchParams);
  }, [id, mutateAsync]);

  const renderCard = useMemo(() => {
    // Check if properties exist and have data
    const allProperties =
      AllProperties?.data?.data?.properties ||
      AllProperties?.data?.properties ||
      [];

    // Filter properties: only show if is_home = true AND is_sale = true
    const properties = allProperties.filter(
      (property: { is_home?: boolean; is_sale?: boolean }) =>
        property.is_home === true && property.is_sale === true
    );

    if (properties.length === 0) {
      return (
        <CarouselItem className="w-full">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {t("No properties available at the moment")}
            </p>
          </div>
        </CarouselItem>
      );
    }

    return properties.map(
      (
        item: {
          id: string;
          type_id?: number;
          [key: string]: unknown;
        },
        index: number
      ) => {
        // Off-plan projects have type_id = 4
        const isOffPlan = item?.type_id === 4;

        return (
          <CarouselItem
            className="md:basis-1/2 lg:basis-1/3"
            key={item?.id || index}
          >
            {isOffPlan ? (
              <ProjectCard item={item} viewMode="grid" />
            ) : (
              <Card item={item} />
            )}
          </CarouselItem>
        );
      }
    );
  }, [AllProperties, t]);

  return (
    <section className="w-full py-12 md:py-4 lg:py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
              <span className="text-[#094834] font-medium text-sm">
                {t("Property Search")}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 md:mb-8">
              {t("Explore Property in Dubai.")}
            </h2>

            {/* Buttons Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                {status === "pending" || status === "error"
                  ? renderSkelton
                  : renderTypes}
              </div>

              {/* View More Button */}
              <div className="hidden md:block">
                <button
                  onClick={onSubmit}
                  className="inline-flex items-center justify-center px-8 py-3 bg-[#094834] text-white font-semibold rounded-xl hover:bg-[#9f8151] transition-all duration-[.4s] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {id ? t("View more") : t("View all properties")}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="relative">
            <Carousel
              dir={isRTL ? "rtl" : ""}
              className="w-full"
              opts={{
                loop: false, // Remove auto loop
                align: "start",
                skipSnaps: false, // Improve navigation
              }}
            >
              <CarouselContent className={isRTL ? "flex-row-reverse" : ""}>
                {propertiesStatus === "pending" || propertiesStatus === "error"
                  ? renderSkeltonCard
                  : renderCard}
              </CarouselContent>

              {/* Custom Navigation Buttons - Optimized */}
              <CarouselNext
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-[#094834]/30 text-[#094834] hover:bg-[#094834] hover:text-white hover:border-[#094834] rounded-full shadow-lg transition-all duration-200 cursor-pointer z-10"
                aria-label="Next properties"
              />
              <CarouselPrevious
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-[#094834]/30 text-[#094834] hover:bg-[#094834] hover:text-white hover:border-[#094834] rounded-full shadow-lg transition-all duration-200 cursor-pointer z-10"
                aria-label="Previous properties"
              />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreProperty;
