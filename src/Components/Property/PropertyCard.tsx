import Icons from "../../Constants/Icons";
import { useContext, useEffect, type FC } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carousel";
import ImagesUrl from "@/helpers/ImagesURL";
import { useNavigate } from "react-router-dom";
// import Images from "@/Constants/Images";
import { FavoiteContext } from "@/Context/FavoiteContext";
import { useAreaUnit } from "@/Context/AreaUnitContext";
import { useTranslation } from "react-i18next";

type PropertyCardType = {
  item: any;
  viewMode?: "grid" | "list";
};

const PropertyCard: FC<PropertyCardType> = ({ item, viewMode = "grid" }) => {
  const { t } = useTranslation();
  // const location = useLocation();
  const navigate = useNavigate();
  const { formatArea } = useAreaUnit();

  const onClick = (name: string, number: string) => {
    if (name == "whatsapp") {
      window.open(`https://wa.me/${number}`);
    } else {
      window.open(`tel:${number}`);
    }
  };

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`);
  };

  // Helper function to check if item is a project
  const isProject = (item: any) => {
    return (
      item?.completion_date ||
      item?.handover_year ||
      item?.property_type?.name?.toLowerCase() === "off-plan" ||
      item?.type?.name?.toLowerCase() === "off-plan"
    );
  };

  // toggle isFavorite
  const { isFavorite, toggleFavoriteOptimistic, token } =
    useContext(FavoiteContext);

  useEffect(() => {
    // This effect is used to track favorite state changes
  }, [isFavorite]);

  const handleFavoite = async () => {
    if (token) {
      try {
        await toggleFavoriteOptimistic(item?.id);
      } catch (error) {
        // Error handled by context
      }
    } else {
      navigate("/login");
    }
  };

  const renderImagesCard = item?.images?.map((item: any, index: number) => {
    return (
      <CarouselItem className="p-0 m-0" key={item?.id || index}>
        <img
          src={ImagesUrl(item)}
          className="w-full h-full object-cover"
          alt={`Property image ${index + 1}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/src/assets/Images/Property/placeholder-property.jpg";
          }}
        />
      </CarouselItem>
    );
  });

  const renderContact = item?.agent?.contact_inf.map(
    (item: any, index: number) => (
      <button
        key={item?.id || index}
        onClick={() => onClick(item?.type, item?.value)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          item?.type === "phone"
            ? "bg-primary text-white hover:bg-primary/90"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
        aria-label={`Contact via ${item?.type}`}
      >
        {item?.type === "phone" ? (
          <Icons.LuPhone size={16} />
        ) : (
          <Icons.FaWhatsapp size={16} />
        )}
        {item?.type === "phone" ? t("Call") : t("WhatsApp")}
      </button>
    )
  );

  // Add email button if agent has email
  const emailButton = item?.agent?.email ? (
    <button
      onClick={() => handleEmailClick(item.agent.email)}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[#9f8151] text-white hover:bg-[#8a6f45] transition-all duration-300"
      aria-label="Send email to agent"
    >
      <Icons.MdOutlineEmail size={16} />
      {t("Email")}
    </button>
  ) : null;

  const handleCardClick = () => {
    if (isProject(item)) {
      // Navigate to project page
      navigate(`/project/${item?.slug || item?.id}`);
    } else {
      // Navigate to regular property page
      // Use slug if available, otherwise create slug from title
      const propertySlug =
        item.slug ||
        item.title
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      navigate(`/single-property/${propertySlug}`);
    }
  };

  // Generate URL based on item type
  const propertyUrl = isProject(item)
    ? `/project/${item?.slug || item?.id}`
    : `/single-property/${
        item.slug ||
        item.title
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      }`;

  if (viewMode === "list") {
    return (
      <a
        href={propertyUrl}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group block"
        onClick={handleCardClick}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
            <Carousel className="w-full h-full">
              <CarouselContent>{renderImagesCard}</CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>

              {/* Location */}
              {item.location && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Icons.CiLocationOn className="w-4 h-4" />
                  <span className="text-sm">{item.location}</span>
                </div>
              )}

              {/* Price */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-primary">
                  AED {item.price?.toLocaleString()}
                  {item.type?.id === 2 && (
                    <span className="text-sm font-normal text-gray-600">
                      {" "}
                      {item.rental_period || "per year"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                {/* Bedrooms */}
                {item.bedrooms !== undefined && item.bedrooms !== null && (
                  <div className="flex items-center gap-1">
                    <Icons.IoHomeOutline className="w-4 h-4" />
                    <span>
                      {item.bedrooms === 0 ? t("Studio") : item.bedrooms}
                    </span>
                  </div>
                )}

                {/* Bathrooms */}
                {item.bathrooms && (
                  <div className="flex items-center gap-1">
                    <Icons.IoPerson className="w-4 h-4" />
                    <span>{item.bathrooms}</span>
                  </div>
                )}

                {/* Area */}
                {item.area && (
                  <div className="flex items-center gap-1">
                    <Icons.TbRuler2 className="w-4 h-4" />
                    <span>{formatArea(item.area)}</span>
                  </div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="flex items-center gap-2">
                {renderContact}
                {emailButton}
              </div>
            </div>
          </div>
        </div>
      </a>
    );
  }

  // Grid View
  return (
    <a
      href={propertyUrl}
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group block"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <Carousel className="w-full h-full">
          <CarouselContent>{renderImagesCard}</CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Favorite Button - Only show if user is logged in */}
        {token && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFavoite();
            }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-red-500 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            aria-label={
              isFavorite?.includes(item?.id) || item?.is_favorite
                ? t("Remove from favorites")
                : t("Add to favorites")
            }
          >
            <Icons.IoMdHeart
              size={20}
              className={
                isFavorite?.includes(item?.id) || item?.is_favorite
                  ? "text-red-500"
                  : ""
              }
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {item.title}
        </h3>

        {/* Location */}
        {item.location && (
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <Icons.CiLocationOn className="w-4 h-4" />
            <span className="text-sm line-clamp-1">{item.location}</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="text-xl font-bold text-primary">
            AED {item.price?.toLocaleString()}
            {item.type?.id === 2 && (
              <span className="text-sm font-normal text-gray-600">
                {" "}
                {item.rental_period || "per year"}
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {/* Bedrooms */}
            {item.bedrooms !== undefined && item.bedrooms !== null && (
              <div className="flex items-center gap-1">
                <Icons.IoHomeOutline className="w-4 h-4" />
                <span>{item.bedrooms === 0 ? t("Studio") : item.bedrooms}</span>
              </div>
            )}

            {/* Bathrooms */}
            {item.bathrooms && (
              <div className="flex items-center gap-1">
                <Icons.IoPerson className="w-4 h-4" />
                <span>{item.bathrooms}</span>
              </div>
            )}

            {/* Area */}
            {item.area && (
              <div className="flex items-center gap-1">
                <Icons.TbRuler2 className="w-4 h-4" />
                <span>{formatArea(item.area)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {renderContact}
            {emailButton}
          </div>
        </div>
      </div>
    </a>
  );
};

export default PropertyCard;
