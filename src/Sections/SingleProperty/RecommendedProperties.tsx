import { Card } from "@/Components/Home/ExploreProperty";
import { Skeleton } from "@/Components/ui/skeleton";
import UseQueryPost from "@/hooks/useQueryPost";
import PropertiesServices from "@/Services/PropertiesServices";
import { useMemo, type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

type RecommendedPropertiesProps = {
  currentPropertyId: string;
  propertyType?: string;
  location?: string;
};

const RecommendedProperties: FC<RecommendedPropertiesProps> = ({
  currentPropertyId,
}) => {
  const { t } = useTranslation();

  // Fetch all properties using Search endpoint
  const {
    mutateAsync,
    data: allProperties,
    status,
  } = UseQueryPost(["recommendedProperties"], PropertiesServices.Search);

  // Fetch properties when component loads
  useEffect(() => {
    mutateAsync({
      per_page: 10, // Fetch 10 properties to choose from
      is_sale: true, // Only available properties
    });
  }, [mutateAsync]);

  // Filter recommended properties
  const recommendedProperties = useMemo(() => {
    const properties =
      allProperties?.data?.data?.properties ||
      allProperties?.data?.properties ||
      [];

    if (!properties || properties.length === 0) return [];

    // Exclude current property and exclude projects (Off-plan) and unavailable properties
    const filteredProperties = properties.filter(
      (property: any) =>
        property.id !== parseInt(currentPropertyId) &&
        property.type_id !== 4 && // Exclude Off-plan
        property.is_sale === true // Only available properties
    );

    if (filteredProperties.length === 0) return [];

    // Random selection - 3 properties
    const shuffled = [...filteredProperties].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [allProperties, currentPropertyId]);

  // Show skeleton while loading
  const renderSkeleton = useMemo(() => {
    return [...Array(3)].map((_, index) => (
      <Skeleton
        key={index}
        className="h-[320px] w-full md:h-[450px] rounded-[8px] bg-[#ebebeb] border border-blue-100 shadow-sm"
      />
    ));
  }, []);

  return (
    <div className="">
      <div className="mb-6">
        <h2 className="font-semibold text-primary text-xl">
          {t("Recommended Properties")}
        </h2>
        <p className="text-primary text_stying text-sm">
          {t("Discover more properties you might like")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[32px]">
        {status === "pending"
          ? renderSkeleton
          : recommendedProperties.length > 0
          ? recommendedProperties.map((property: any) => (
              <Card key={property.id} item={property} />
            ))
          : renderSkeleton}
      </div>
    </div>
  );
};

export default RecommendedProperties;
