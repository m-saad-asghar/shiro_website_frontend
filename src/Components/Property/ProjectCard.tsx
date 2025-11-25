import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";
import Images from "@/Constants/Images";
import { useAreaUnit } from "@/Context/AreaUnitContext";
import ImagesUrl from "@/helpers/ImagesURL";

interface ProjectCardProps {
  item: any; // Use any to match the backend data structure
  viewMode?: "grid" | "list";
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  item,
  viewMode = "grid",
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatArea } = useAreaUnit();

  // Debug: Log the item data

  const handleCardClick = () => {
    navigate(`/project/${item.slug || item.id}`);
  };

  // Format price function (currently unused)
  // const formatPrice = (price: number) => {
  //   if (price >= 1000000) {
  //     return `AED ${(price / 1000000).toFixed(1)}M`;
  //   } else if (price >= 1000) {
  //     return `AED ${(price / 1000).toFixed(0)}K`;
  //   }
  //   return `AED ${price.toLocaleString()}`;
  // };

  // Format area for display
  const formatAreaDisplay = (area: number) => {
    return formatArea(area);
  };

  // Get the first image from images array or use main_image
  const getMainImage = () => {
    const image =
      item?.images && item.images.length > 0
        ? item.images[0]
        : item?.main_image || item?.image;

    // Debug: Log image data

    return image;
  };

  // Get max values for ranges
  const getMaxBedrooms = () => {
    const bedrooms =
      item?.num_bedroom ||
      item?.bedroom_max ||
      item?.bedrooms ||
      item?.max_bedrooms;

    // Debug: Log bedrooms data

    return bedrooms;
  };

  const getMaxBathrooms = () => {
    const bathrooms =
      item?.num_bathroom ||
      item?.bathroom_max ||
      item?.bathrooms ||
      item?.max_bathrooms;

    // Debug: Log bathrooms data

    return bathrooms;
  };

  const getMaxArea = () => {
    const area = item?.area || item?.area_max || item?.max_area;

    // Debug: Log area data

    return area;
  };

  // Get completion date
  const getCompletionDate = () => {
    const completionDate = item?.completion_date;

    // Debug: Log completion date data

    return completionDate;
  };

  // Get location from various possible fields
  const getLocation = () => {
    const location =
      item?.location ||
      item?.address ||
      item?.neighborhood ||
      item?.district ||
      item?.city ||
      item?.region ||
      item?.emirate ||
      item?.full_address ||
      item?.street_address ||
      "Dubai, UAE"; // Fallback location

    // Debug: Log location data

    return location;
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleCardClick}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group block"
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
            <img
              src={getMainImage()}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%239ca3af'%3ENo Image Available%3C/text%3E%3C/svg%3E";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            {/* Developer Logo */}
            {item.developer?.logo && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                <img
                  src={ImagesUrl(item.developer.logo)}
                  alt={item.developer.name}
                  className="h-8 w-auto object-contain"
                />
              </div>
            )}

            {/* Property Type Badge */}
            {item.property_type?.name && (
              <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg z-10">
                {item.property_type.name}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>

              {/* Location */}
              {(() => {
                const location = getLocation();
                return (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Icons.CiLocationOn className="w-4 h-4" />
                    <span className="text-sm">{location}</span>
                  </div>
                );
              })()}

              {/* Developer */}
              {item.developer?.name && (
                <div className="text-sm text-gray-600 mb-4">
                  <span className="font-medium text-primary">
                    {t("Developer")}:
                  </span>{" "}
                  {item.developer.name}
                </div>
              )}

              {/* Price */}
              {/* <div className="mb-4">
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(item.price)}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {t("Starting price")}
                </div>
              </div> */}
            </div>

            {/* Details */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                {/* Bedrooms */}
                {getMaxBedrooms() && (
                  <div className="flex items-center gap-1">
                    <img
                      src={Images.BedsIcons}
                      className="w-4 h-4"
                      alt="Bedrooms icon"
                    />
                    <span>1-{getMaxBedrooms()}</span>
                  </div>
                )}

                {/* Bathrooms */}
                {getMaxBathrooms() && (
                  <div className="flex items-center gap-1">
                    <img
                      src={Images.BathIcons}
                      className="w-4 h-4"
                      alt="Bathrooms icon"
                    />
                    <span>1-{getMaxBathrooms()}</span>
                  </div>
                )}

                {/* Area */}
                {getMaxArea() && (
                  <div className="flex items-center gap-1">
                    <img
                      src={Images.ArrowIcons}
                      className="w-4 h-4"
                      alt="Area"
                    />
                    <span>
                      {t("Up to")} {formatAreaDisplay(getMaxArea())}
                    </span>
                  </div>
                )}
              </div>

              {/* Completion Date */}
              {getCompletionDate() && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Icons.IoCalendarOutline className="w-3 h-3" />
                  <span>{new Date(getCompletionDate()).getFullYear()}</span>
                </div>
              )}

              {/* Status */}
              {item.status && (
                <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {item.status}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group block"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={getMainImage()}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%239ca3af'%3ENo Image Available%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Developer Logo */}
        {item.developer?.logo && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
            <img
              src={ImagesUrl(item.developer.logo)}
              alt={item.developer.name}
              className="h-8 w-auto object-contain"
            />
          </div>
        )}

        {/* Property Type Badge */}
        {item.property_type?.name && (
          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg z-10">
            {item.property_type.name}
          </div>
        )}

        {/* Status Badge */}
        {item.status && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-primary/90 text-white text-xs font-semibold rounded-full">
            {item.status}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {item.title}
        </h3>

        {/* Location */}
        {(() => {
          const location = getLocation();
          return (
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Icons.CiLocationOn className="w-4 h-4" />
              <span className="text-sm line-clamp-1">{location}</span>
            </div>
          );
        })()}

        {/* Developer */}
        {item.developer?.name && (
          <div className="text-sm text-gray-600 mb-4">
            <span className="font-medium text-primary">{t("Developer")}:</span>{" "}
            {item.developer.name}
          </div>
        )}

        {/* Price */}
        {/* <div className="mb-4">
          <div className="text-xl font-bold text-primary">
            {formatPrice(item.price)}
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {t("Starting price")}
          </div>
        </div> */}

        {/* Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {/* Bedrooms */}
            {getMaxBedrooms() && (
              <div className="flex items-center gap-1">
                <img
                  src={Images.BedsIcons}
                  className="w-4 h-4"
                  alt="Bedrooms icon"
                />
                <span>1-{getMaxBedrooms()}</span>
              </div>
            )}

            {/* Bathrooms */}
            {getMaxBathrooms() && (
              <div className="flex items-center gap-1">
                <img
                  src={Images.BathIcons}
                  className="w-4 h-4"
                  alt="Bathrooms icon"
                />
                <span>1-{getMaxBathrooms()}</span>
              </div>
            )}

            {/* Area */}
            {getMaxArea() && (
              <div className="flex items-center gap-1">
                <img
                  src={Images.ArrowIcons}
                  className="w-4 h-4"
                  alt="Area icon"
                />
                <span>
                  {t("Up to")} {formatAreaDisplay(getMaxArea())}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Completion Date */}
        {getCompletionDate() && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icons.IoCalendarOutline className="w-4 h-4" />
              <span>
                {t("Completion")}: {new Date(getCompletionDate()).getFullYear()}
              </span>
            </div>
          </div>
        )}

        {/* Status */}
        {item.status && (
          <div className="mt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>{item.status}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
