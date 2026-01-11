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

/**
 * ✅ Parent will pass these 3 values (from current listing detail page)
 * reference: listing reference to find base listing
 * property_category: must match
 * project_status: used to check Off Plan rule
 */
type ExplorePropertyWithTypeProps = {
  reference: string;
  property_category: string;
  project_status?: string; // optional
};

const ExplorePropertyWithType = ({
  reference,
  property_category,
  project_status = "",
}: ExplorePropertyWithTypeProps) => {
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

  // ✅ POST to new route: /show_featured_properties_with_type
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Guard: do not call backend without required props
        if (!reference || !property_category) {
          console.warn(
            "[ExplorePropertyWithType] Missing required props: reference/property_category"
          );
          setAllProperties(null);
          setPropertiesStatus("success");
          return;
        }

        setPropertiesStatus("pending");

        const base = (import.meta as any).env?.VITE_API_URL || "";
        const url = `${base.replace(/\/$/, "")}/show_featured_properties_with_type`;

        const payload = {
          reference,
          property_category,
          project_status,
        };

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();

        console.log(
          "[ExplorePropertyWithType] Received response from show_featured_properties_with_type",
          json?.data?.featured_listings
        );

        setAllProperties(json);
        setPropertiesStatus("success");
      } catch (error) {
        console.log(
          "[ExplorePropertyWithType] Request to show_featured_properties_with_type failed",
          error
        );
        setPropertiesStatus("error");
      }
    };

    fetchFeatured();
    // ✅ refetch if any of these change
  }, [reference, property_category, project_status, id]);

  const renderCard = useMemo(() => {
  const allProperties =
    AllProperties?.data?.featured_listings ||
    AllProperties?.data?.data?.featured_listings ||
    [];

  console.log("ALL properties from API:", allProperties);
  console.log("Count:", allProperties.length);

  if (!Array.isArray(allProperties) || allProperties.length === 0) {
    return (
      <CarouselItem className="w-full">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {t("No Properties Available at the Moment")}
          </p>
        </div>
      </CarouselItem>
    );
  }

  return allProperties.map(
    (
      item: { id?: string | number; type_id?: number; [key: string]: unknown },
      index: number
    ) => (
      <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={item?.id ?? index}>
        <CardUpdated item={item} />
      </CarouselItem>
    )
  );
}, [AllProperties, t]);


  return (
    <section className="w-full py-2 md:py-4 lg:py-6 explore_properties_styling">
      <div className="custom_container mx-auto px-4">
        <div className="mx-auto">
          <div className="mb-8 md:mb-8">
            <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
              {t("Explore More Properties")}
            </h1>
          </div>

          <div className="relative">
            <Carousel
              dir={isRTL ? "rtl" : ""}
              className="w-full"
              opts={{ loop: false, align: "start", skipSnaps: false }}
            >
              <CarouselContent className={isRTL ? "flex-row-reverse" : ""}>
                {propertiesStatus === "pending" || propertiesStatus === "error"
                  ? renderSkeltonCard
                  : renderCard}
              </CarouselContent>

              <div
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <CarouselNext
                  className="w-12 h-12 bg-white border-2 border-[#094834]/30 text-[#094834] hover:bg-[#094834] hover:text-white hover:border-[#094834] rounded-full shadow-lg transition-all duration-200 cursor-pointer"
                  aria-label="Next properties"
                />
              </div>

              <div
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20"
                onClick={(e) => e.stopPropagation()}
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

export default ExplorePropertyWithType;