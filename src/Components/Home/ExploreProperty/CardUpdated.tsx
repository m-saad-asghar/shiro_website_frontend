import Icons from "../../../Constants/Icons";
import { useContext, useEffect, type FC } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carousel";
import { useLocation, useNavigate } from "react-router-dom";
import Images from "@/Constants/Images";
import { FavoiteContext } from "@/Context/FavoiteContext";
import { useAreaUnit } from "@/Context/AreaUnitContext";
import { useTranslation } from "react-i18next";

type CardType = {
  item: any;
  viewMode?: "grid" | "list";
};

const CardUpdated: FC<CardType> = ({ item, viewMode = "grid" }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { formatArea } = useAreaUnit();

  const onClick = (name: string, number: string) => {
    if (name == "whatsapp") {
       const msg = encodeURIComponent(
        "Hello, I’m interested in your Real Estate Expertise. How can Shiro Estate assist me with my Next Purchase?"
      );
      window.open(`https://wa.me/${number}?text=${msg}`, "_blank");
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

  const renderImagesCard = item?.images?.map((imageUrl: any, index: number) => {
    return (
      <CarouselItem className="p-0 m-0" key={index}>
        <img
          src={imageUrl}
          className="w-full h-full object-cover"
          alt={item?.title || "Property image"}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/src/assets/Images/Property/placeholder-property.jpg";
          }}
        />
      </CarouselItem>
    );
  });

 const renderContact = item?.agent?.contact_inf?.map(
  (item: any, index: number) => (
    <button
      key={item?.id || index}
      onClick={() => onClick(item?.type, item?.value)}
      className={`flex items-center justify-center gap-2 search_btn_styling h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold transition-all duration-[.4s] flex items-center justify-center gap-2`}
      style={{borderRadius: 8}}
      aria-label={`Contact via ${item?.type}`}
    >
      {item?.type === "phone" ? (
        <Icons.LuPhone size={18} />
      ) : (
        <Icons.FaWhatsapp size={18} />
      )}
      {item?.type === "phone" ? t("Call") : t("WhatsApp")}
    </button>
  )
);


  // Add email button if agent has email
const emailButton = item?.agent?.email ? (
  <button
    onClick={() => handleEmailClick(item.agent.email)}
    className="flex items-center justify-center gap-2 search_btn_styling h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold transition-all duration-[.4s] flex items-center justify-center gap-2"
     style={{borderRadius: 8}}
    aria-label="Send email to agent"
  >
    <Icons.MdOutlineEmail size={18} />
    {t("Email")}
  </button>
) : null;


  // 🔤 Normalise property type name: "APARTMENTS" / "Apartments" -> "APARTMENT"
  const rawType = item?.property_type?.name || "";
  const propertyTypeBadge =
    rawType.toLowerCase() === "apartments" ? "APARTMENT" : rawType;

  return (
   <div
  className={`group bg-white rounded-2xl  border border-gray-100 transition-all duration-300 overflow-hidden relative ${
    viewMode === "grid"
      ? "flex flex-col h-auto"     // ✅ auto height
      : "h-[140px] flex flex-row"  // list view still fixed
  }`}
>
      {/* Favorite Button - Only show if user is logged in */}
      {token && (
        <button
          onClick={handleFavoite}
          className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 group-hover:scale-110 z-20"
          aria-label={
            isFavorite?.includes(item?.id)
              ? t("Remove from favorites")
              : t("Add to favorites")
          }
        >
          <Icons.IoMdHeart
            size={20}
            className={`${
              item?.is_favorite === true || isFavorite.includes(item.id)
                ? "text-red-500 fill-current"
                : "text-gray-400 hover:text-red-500"
            } transition-colors duration-300`}
          />
        </button>
      )}

      {/* Image Section */}
{/* Image Section */}
<div
  className={`relative overflow-hidden ${
    viewMode === "grid"
      ? "w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px]" 
      : "h-full w-[200px]"
  }`}
>
  {item?.images && item.images.length > 0 ? (
    <Carousel className="w-full h-full">
      <CarouselContent className="relative m-0 p-0 h-full">
        
        {item.images.map((imageUrl: any, index: number) => (
          <CarouselItem 
            className="p-0 m-0 h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px]" 
            key={index}
          >
            <img
              src={imageUrl}
              className="w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-cover"
              alt={item?.title || "Property image"}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/src/assets/Images/Property/placeholder-property.jpg";
              }}
            />
          </CarouselItem>
        ))}

      </CarouselContent>

      {item.images.length > 1 && (
        <>
          <CarouselPrevious className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/90 hover:bg-white text-primary border-0 shadow-lg z-10" />
          <CarouselNext className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/90 hover:bg-white text-primary border-0 shadow-lg z-10" />
        </>
      )}

    </Carousel>
  ) : (
    <div className="w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] bg-gray-200 flex items-center justify-center">
      <div className="text-center">
        <Icons.IoImageOutline size={48} className="text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">{t("No images available")}</p>
      </div>
    </div>
  )}

  {/* Image Counter */}
  {viewMode === "grid" && item?.images?.length > 0 && (
    <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium text-primary shadow-lg">
      <Icons.IoImageOutline size={16} />
      <span>{item?.images?.length}</span>
    </div>
  )}

  {/* Property Type Badge */}
  {viewMode === "grid" && (
    <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg z-10">
      {propertyTypeBadge}
    </div>
  )}
</div>




      {/* Content Section */}
      <div
        className={`flex-1 cursor-pointer ${
          viewMode === "grid"
            ? "p-6 flex flex-col justify-between"
            : "p-4 flex flex-col justify-center"
        }`}
        onClick={() => {
          if (isProject(item)) {
            // Navigate to project page
            navigate(`/project/${item?.slug || item?.id}`);
          } else {
            // Navigate to regular property page
            // Use slug if available, otherwise create descriptive slug
            const propertySlug =
              item.slug ||
              `${item?.num_bedroom}-bedroom-${
                item?.property_type?.name || "property"
              }-for-${location?.pathname.split("/")[1] || "buy"}-in-${
                item?.location?.replace(/\s+/g, "-") || "dubai"
              }`.toLowerCase();
            navigate(`/single-property/${propertySlug}`);
          }
        }}
      >
        {/* Property Info */}
        <div className={viewMode === "grid" ? "space-y-4" : "space-y-2"}>
          {/* Title */}

           <h1  className={`font-bold text-primary ${
                viewMode === "grid" ? "text-xl" : "text-lg"
              }`} style={{marginBottom: 5}}>
             {item?.title}
          </h1>

          {/* <h3
            className={`font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300 ${
              viewMode === "grid" ? "text-lg" : "text-base"
            }`}
          >
            {item?.title}
          </h3> */}

          {/* Price */}
          <div className="flex items-center justify-between" style={{marginBottom: 30}}>
            <div
              className={`font-bold text-primary ${
                viewMode === "grid" ? "text-lg" : "text-lg"
              }`}
            >
              {item?.currency_symbol} {item?.converted_price}
            </div>
            <div className="text-sm text-gray-500">
              {location?.pathname.split("/")[1] === "rent"
                ? item.rental_period
                : " "}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600" style={{marginBottom: 0}}>
            <Icons.CiLocationOn
              size={viewMode === "grid" ? 18 : 16}
              className="text-primary rounded-lg text-sm transition-all duration-200 mb-1 text-[#0b4a35]"
            />
            <span className="rounded-lg text-sm transition-all duration-200 mb-1 text-[#0b4a35]">{item?.location}</span>
          </div>

          {/* Property Features */}
          <div
            className={`grid gap-4 ${
              viewMode === "grid" ? "grid-cols-3" : "grid-cols-3"
            }`}
          >
            {viewMode === "grid" ? (
              <>
                <div className="flex items-center gap-2">
                  <img
                    src={Images.BedsIcons}
                    className="w-5 h-5"
                    alt="Bedrooms icon"
                  />
                  <div className="text-center">
                    <div className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                     {item?.num_bedroom === 0
  ? t("Studio")
  : item?.num_bedroom === 1
  ? `${item?.num_bedroom} ${t("Bedroom")}`
  : `${item?.num_bedroom} ${t("Bedrooms")}`}

                    </div>
                    {/* <div className="text-xs text-gray-500">{t("Bedrooms")}</div> */}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={Images.BathIcons}
                    className="w-5 h-5"
                    alt="Bathrooms icon"
                  />
                  <div className="text-center">
                    <div className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                     {item?.num_bathroom === 1
  ? `${item?.num_bathroom} ${t("Bathroom")}`
  : `${item?.num_bathroom} ${t("Bathrooms")}`}

                    </div>
                    {/* <div className="text-xs text-gray-500">
                      {t("Bathrooms")}
                    </div> */}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={Images.ArrowIcons}
                    className="w-5 h-5"
                    alt="Area icon"
                  />
                  <div className="text-center">
                    <div className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                      {formatArea(item?.area)}
                    </div>
                    {/* <div className="text-xs text-gray-500">{t("Area")}</div> */}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <img
                    src={Images.BedsIcons}
                    className="w-4 h-4"
                    alt="Bedrooms icon"
                  />
                  <span className="text-xs text-gray-600">
                    {item?.num_bedroom === 0 ? t("Studio") : item?.num_bedroom}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <img
                    src={Images.BathIcons}
                    className="w-4 h-4"
                    alt="Bathrooms icon"
                  />
                  <span className="text-xs text-gray-600">
                    {item?.num_bathroom}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <img
                    src={Images.ArrowIcons}
                    className="w-4 h-4"
                    alt="Area icon"
                  />
                  <span className="text-xs text-gray-600">
                    {formatArea(item?.area)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contact Buttons */}
        {viewMode === "grid" && item?.agent && (
          <div
            className={`grid gap-4 pt-2 ${
              viewMode === "grid" ? "grid-cols-3" : "grid-cols-3"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {renderContact}
            {emailButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardUpdated;
