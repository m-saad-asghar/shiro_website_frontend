import { lazy } from "react";

// Lazy load the Card component
const Card = lazy(() =>
  import("../../Components/Home/ExploreProperty").then((module) => ({
    default: module.Card,
  }))
);
const CardUpdated = lazy(() =>
  import("../../Components/Home/ExploreProperty/CardUpdated").then((module) => ({
    default: module.default,
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
          px-6 py-3 change_border font-semibold text-sm md:text-base transition-all duration-200 
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
        className="h-[46px] w-[88px] md:w-[120px] change_border bg-gray-200"
        key={index}
      />
    ));
  }, []);

  const renderSkeltonCard = useMemo(() => {
    return [...Array(3)].map((_, index: number) => (
      <CarouselItem className="md:basis-1/3 lg:basis-1/4" key={index}>
        <Skeleton className="w-full h-[320px] md:h-[450px] change_border bg-gray-200" />
      </CarouselItem>
    ));
  }, []);

  // Local state to hold fetched properties and status
  const [AllProperties, setAllProperties] = useState<any>(null);
  const [propertiesStatus, setPropertiesStatus] = useState<string>("idle");

  // Fetch properties when component loads or category changes using fetch
  useEffect(() => {
    const fetchFeatured = async () => {
      // const searchParams = {
      //   is_home: 1,
      //   is_sale: true,
      //   per_page: 6,
      //   ...(id && { type_id: id }),
      // };

      try {
        setPropertiesStatus("pending");

        // Build URL from environment base or relative path
        const base = (import.meta as any).env?.VITE_API_URL || "";
        const url = `${base.replace(/\/$/, "")}/show_featured_properties`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify(searchParams),
        });

        const data = await res.json();
        console.log("[ExploreProperty] Received response from show_featured_properties", data.data.featured_listings);
        // Keep the original variable shape so render logic remains unchanged
        setAllProperties(data);
        setPropertiesStatus("success");
      } catch (error) {
        console.log("[ExploreProperty] Request to show_featured_properties failed", error);
        setPropertiesStatus("error");
      }
    };

    fetchFeatured();
  }, [id]);

  const renderCard = useMemo(() => {
    // Check if properties exist and have data
    const allProperties =
      AllProperties?.data?.data?.featured_listings ||
      AllProperties?.data?.featured_listings ||
      [];


    // Filter properties: only show if is_home = true AND is_sale = true
    const properties = allProperties.filter(
      (property: { active?: number; is_featured?: number }) =>
        property.active == 1 && property.is_featured == 1
    );

    if (properties.length === 0) {
      return (
        <CarouselItem className="w-full">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {t("No Featured Properties Available at the Moment")}
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
            <CardUpdated item={item} />
            {/* {isOffPlan ? (
              <ProjectCard item={item} viewMode="grid" />
            ) : (
              <CardUpdated item={item} />
            )} */}
          </CarouselItem>
        );
      }
    );
  }, [AllProperties, t]);

  return (
    <section className="w-full py-2 md:py-4 lg:py-6 explore_properties_styling">
      <div className="custom_container mx-auto px-4">
        <div className="mx-auto">
          {/* Header Section */}
          <div className="mb-8 md:mb-8">
            {/* <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
              <span className="text-[#094834] font-medium text-sm">
                {t("Property Search")}
              </span>
            </div> */}

            {/* <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 md:mb-8">
              {t("Explore Property in Dubai.")}
            </h2> */}
             <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {t("Featured Properties")}
          </h1>

            
            {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                {status === "pending" || status === "error"
                  ? renderSkelton
                  : renderTypes}
              </div>

              <div className="hidden md:block">
                <button
                  onClick={onSubmit}
                  className="inline-flex items-center justify-center px-8 py-3 bg-[#094834] text-white font-semibold change_border hover:bg-[#9f8151] transition-all duration-[.4s] cursor-pointer"
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
            </div> */}
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
                           {/* Custom Navigation Buttons - wrapped to block clicks from reaching cards */}
              <div
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <CarouselNext
                  className="w-12 h-12 bg-white border-2 border-[#094834]/30 text-[#094834] hover:bg-[#094834] hover:text-white hover:border-[#094834] rounded-full shadow-lg transition-all duration-200 cursor-pointer"
                  aria-label="Next properties"
                />
              </div>

              <div
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <CarouselPrevious
                  className="w-12 h-12 bg-white border-2 border-[#094834]/30 text-[#094834] hover:bg-[#094834] hover:text-white hover:border-[#094834] rounded-full shadow-lg transition-all duration-200 cursor-pointer"
                  aria-label="Previous properties"
                />
              </div>

            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreProperty;
