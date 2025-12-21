import Icons from "../../../Constants/Icons";
import { useContext, useEffect, type FC, useMemo } from "react";
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
import ListingImagesUrl from "@/helpers/listingImagesURL";

type CardType = {
  item: any;
  viewMode?: "grid" | "list";
};

const Card: FC<CardType> = ({ item, viewMode = "grid" }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { formatArea } = useAreaUnit();

  const onClick = (name: string, number: string) => {
    if (!number) return;

    const cleanNumber = String(number).replace(/\D/g, "");

    if (name == "whatsapp") {
      const ref = item?.reference || item?.reference || "";
      const title = item?.title || item?.title || "";
      const msg = encodeURIComponent(
        `Hello, I am interested in Property Reference Number ${ref}, with Title ${title}`
      );
      window.open(`https://wa.me/${number}?text=${msg}`, "_blank");
    } else {
      window.open(`tel:${cleanNumber}`);
    }
  };

  const handleEmailClick = (email: string, body?: string) => {
    if (!email) return;

    const subject = encodeURIComponent("Property Inquiry");
    const mailBody = encodeURIComponent(body || "");

    window.open(`mailto:${email}?subject=${subject}&body=${mailBody}`);
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

  const goToDetails = () => {
    navigate(`/listing/${item?.reference}`);
    // if (isProject(item)) {
    //   navigate(`/project/${item?.slug || item?.id}`);
    // } else {
    //   const propertySlug =
    //     item?.slug ||
    //     `${item?.num_bedroom}-bedroom-${
    //       item?.property_type?.name || "property"
    //     }-for-${location?.pathname.split("/")[1] || "buy"}-in-${
    //       item?.location?.replace(/\s+/g, "-") || "dubai"
    //     }`.toLowerCase();
    //   navigate(`/single-property/${propertySlug}`);
    // }
  };

  // toggle isFavorite
  const { isFavorite, toggleFavoriteOptimistic, token } =
    useContext(FavoiteContext);

  useEffect(() => {
    // track favorite state changes
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

  // ✅ NEW BACKEND: company_contact (phone/whatsapp/email)
  const contacts = useMemo(() => {
    const phone = item?.company_contact?.phone || "";
    const whatsapp = item?.company_contact?.whatsapp || "";
    const email = item?.company_contact?.email || "";
    return { phone, whatsapp, email };
  }, [item]);

  // GRID contact buttons (unchanged styles, updated data source)
  const renderContact = [
    {
      type: "phone",
      value: contacts.phone,
      label: t("Call"),
      Icon: <Icons.LuPhone size={16} />,
    },
    {
      type: "whatsapp",
      value: contacts.whatsapp,
      label: t("WhatsApp"),
      Icon: <Icons.FaWhatsapp size={16} />,
    },
  ].map((btn, index) => (
    <button
      key={index}
      onClick={() => onClick(btn.type, btn.value)}
      className={`flex items-center justify-center gap-2 search_btn_styling h-12 md:h-10 px-6 bg-[#f1ece0] hover:bg-[#9f8151] hover:text-white text-[#0b4a35] font-semibold transition-all duration-[.4s] flex items-center justify-center gap-2`}
      style={{ borderRadius: 8 }}
      aria-label={`Contact via ${btn.type}`}
      disabled={!btn.value}
    >
      {btn.Icon}
      {btn.label}
    </button>
  ));

  const emailButton = contacts.email ? (
    <button
      onClick={() =>
        handleEmailClick(
          contacts.email,
          `Hello,\n\nI am interested in Property Reference Number ${item?.reference}.\nTitle: ${item?.title}\nPrice: AED ${item?.price}\n\nPlease share more details.\n\nThanks`
        )
      }
      className="flex items-center justify-center gap-2 search_btn_styling h-12 md:h-10 px-6 bg-[#f1ece0] hover:text-white hover:bg-[#9f8151] text-[#0b4a35] font-semibold transition-all duration-[.4s] flex items-center justify-center gap-2"
      style={{ borderRadius: 8 }}
      aria-label="Send email to company"
    >
      <Icons.MdOutlineEmail size={16} />
      {t("Email")}
    </button>
  ) : null;

  // List-mode extra description (safe fallback)
  const descriptionText =
    item?.description ||
    item?.short_description ||
    item?.excerpt ||
    item?.summary ||
    "";

  const shortDesc =
    typeof descriptionText === "string"
      ? descriptionText.replace(/<\/?[^>]+(>|$)/g, "").trim()
      : "";

  const trimmedDesc =
    shortDesc.length > 120 ? `${shortDesc.slice(0, 120)}...` : shortDesc;

  return (
    <div
      className={`group bg-white change_border  border border-gray-100 overflow-hidden relative ${
        viewMode === "grid"
          ? "h-auto flex flex-col"
          : // ✅ LIST MODE RESPONSIVE (mobile stacked, desktop row)
            "flex flex-col md:flex-row w-full"
      }`}
    >
      {/* Favorite Button - Only show if user is logged in */}
      {token && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFavoite();
          }}
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

      {/* ✅ Image Section (ONLY UPDATED PART) */}
      <div
        className={`relative overflow-hidden flex-shrink-0 ${
          viewMode === "grid"
            ? "h-[280px]"
            : // LIST MODE: fixed height so ALL images are consistent + fill the left area
              "h-[280px] sm:h-[340px] md:h-[280px] lg:h-[320px] w-full md:w-[360px] lg:w-[420px]"
        }`}
      >
        {item?.images && item.images.length > 0 ? (
          <Carousel className="w-full h-full relative">
            <CarouselContent className="m-0 p-0 h-full">
              {(item?.images || []).map((imageUrl: any, index: number) => (
                <CarouselItem key={index} className="p-0 m-0 h-full">
                  <img
                    src={ListingImagesUrl(imageUrl)}
                    className="w-full h-[400px] object-cover"
                    alt={item?.title || "Property image"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "/src/assets/Images/Property/placeholder-property.jpg";
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
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Icons.IoImageOutline
                size={48}
                className="text-gray-400 mx-auto mb-2"
              />
              <p className="text-gray-500 text-sm">{t("No images available")}</p>
            </div>
          </div>
        )}

        {/* ✅ Always INSIDE image (grid + list) */}
        {item?.images && item.images.length > 0 && (
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium text-primary shadow-lg z-20">
            <Icons.IoImageOutline size={16} />
            <span>{item?.images?.length}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div
        className={`flex-1 cursor-pointer ${
          viewMode === "grid"
            ? "p-6 flex flex-col justify-between"
            : "p-4 sm:p-5 md:p-6 flex flex-col justify-between"
        }`}
        onClick={goToDetails}
      >
        {/* ===== GRID stays same (your existing blocks) ===== */}
        {viewMode === "grid" ? (
          <>
            <div className="space-y-4">
              <h3
                className="font-semibold text-primary text-xl"
                style={{ marginBottom: "5px" }}
              >
                {item?.title}
              </h3>

              <div
                className="flex items-center justify-between"
                style={{ marginBottom: "30px" }}
              >
                <div className="text-primary text_stying text-lg">
                  {item?.currency_symbol} {item?.price}
                </div>
                <div className="text-sm text-gray-500">
                  {location?.pathname.split("/")[1] === "rent"
                    ? item.rental_period
                    : " "}
                </div>
              </div>

              {/* Selling Points */}
              <div
                className="flex items-center gap-2 text-gray-600"
                style={{ marginBottom: 0 }}
              >
                <span className="font-semibold rounded-lg text-sm transition-all duration-200 mb-2 text-[#9f8151]">
                  {item?.selling_points}
                </span>
              </div>

              <div
                className="flex items-center gap-2 text-gray-600"
                style={{ marginBottom: "0px" }}
              >
                <Icons.CiLocationOn
                  size={18}
                  className="text-primary rounded-lg text-sm transition-all duration-200 mb-1 !text-[#9f8151]"
                />
                <span className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
                  {item?.location}
                </span>
              </div>

              <div className="grid gap-4 grid-cols-3">
                <div className="flex items-center gap-2">
                  <img src={Images.BedsIcons} className="w-5 h-5" alt="Beds" />
                  <div className="text-center">
                    <div className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                      {item?.num_bedroom === 0 ? t("Studio") : item?.num_bedroom}{" "}
                      {t("Bedrooms")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img src={Images.BathIcons} className="w-5 h-5" alt="Bath" />
                  <div className="text-center">
                    <div className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                      {item?.num_bathroom} {t("Bathrooms")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img src={Images.ArrowIcons} className="w-5 h-5" alt="Area" />
                  <div className="text-center">
                    <div className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                      {formatArea(item?.area)} {t("Area")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ company_contact buttons */}
            {(contacts.phone || contacts.whatsapp || contacts.email) && (
              <div
                className="grid gap-4 pt-2 grid-cols-3"
                onClick={(e) => e.stopPropagation()}
              >
                {renderContact}
                {emailButton}
              </div>
            )}
          </>
        ) : (
          // ===== LIST MODE: add content like reference image =====
          <>
            <div className="space-y-2">
              {/* Title / subtitle */}
              <div
                className="font-semibold text-primary text-xl"
                style={{ marginBottom: "5px" }}
              >
                {item?.title}
              </div>

              {/* Price */}
              <div
                className="text-primary text_stying text-lg"
                style={{ marginBottom: "10px" }}
              >
                {"Đ"} {item?.price ? Number(item.price).toLocaleString() : "0"}
              </div>

              {/* Location line */}
              <div
                className="flex items-center gap-2 text-sm text-gray-500"
                style={{ marginBottom: "5px" }}
              >
                <Icons.CiLocationOn size={16} className="!text-[#9f8151]" />
                <span className="rounded-lg text-sm transition-all duration-200 mb-1 mt-1 text-[#9f8151] text_stying">
                  {[item?.community, item?.sub_community, item?.property]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>

              {/* Selling points */}
              <div
                className="flex items-center gap-2 text-sm text-gray-500"
                style={{ marginBottom: "0px" }}
              >
                <span
                  className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]"
                  style={{ marginBottom: "0px" }}
                >
                  {item?.selling_points}
                </span>
              </div>

              {/* Apartment | bed | bath | area row */}
              <div
                className="flex items-center flex-wrap gap-6"
                style={{ marginBottom: "0px" }}
              >
                <div className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                  {item?.property_type?.name || t("Apartment")}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <img
                    src={Images.BedsIcons}
                    className="w-4 h-4"
                    alt="Beds"
                  />
                  <span className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                    {item?.bedrooms == "Studio"
                      ? t("Studio")
                      : `${item?.bedrooms} ${
                          Number(item?.bedrooms) == 1
                            ? t("Bedroom")
                            : t("Bedrooms")
                        }`}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <img
                    src={Images.BathIcons}
                    className="w-4 h-4"
                    alt="Bath"
                  />
                  <span className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                    {Number(item?.bathrooms) === 1
                      ? `1 ${t("Bathroom")}`
                      : `${item?.bathrooms} ${t("Bathrooms")}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <img
                    src={Images.ArrowIcons}
                    className="w-4 h-4"
                    alt="Area"
                  />
                  <span className="py-2 rounded-lg text-sm transition-all duration-200 text-[#0b4a35]">
                    {formatArea(item?.area)}
                  </span>
                </div>
              </div>

              {/* Description + more */}
              {trimmedDesc ? (
                <div className="text-sm text-gray-600">
                  <span className="!text-[14px] text-dark leading-relaxed !text-[#0b4a35] down_styling !leading-normal">
                    {trimmedDesc}
                  </span>{" "}
                  <button
                    className="text-primary underline font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToDetails();
                    }}
                  >
                    {t("Read More")}
                  </button>
                </div>
              ) : null}

              <div className="pt-4 mt-2" onClick={(e) => e.stopPropagation()}>
                <div className="grid grid-cols-3 gap-3">
                  {/* Email */}
                  <button
                    onClick={() =>
                      handleEmailClick(
                        contacts.email,
                        `Hello,\n\nI am interested in Property Reference Number ${item?.reference}, with Title ${item?.title}.\n\nThanks`
                      )
                    }
                    className="
                      flex items-center justify-center gap-2
                      search_btn_styling
                      h-12 md:h-10
                      px-6
                      bg-[#f1ece0]
                      hover:bg-[#9f8151]
                      hover:text-white
                      text-[#0b4a35]
                      font-semibold
                      transition-all duration-[.4s]
                      change_border
                      whitespace-nowrap
                    "
                    disabled={!contacts.email}
                  >
                    <Icons.MdOutlineEmail size={18} className="opacity-80 shrink-0" />
                    <span className="whitespace-nowrap">{t("Email")}</span>
                  </button>

                  {/* Call */}
                  <button
                    onClick={() => onClick("phone", contacts.phone)}
                    className="
                      flex items-center justify-center gap-2
                      search_btn_styling
                      h-12 md:h-10
                      px-6
                      bg-[#f1ece0]
                      hover:bg-[#9f8151]
                      hover:text-white
                      text-[#0b4a35]
                      font-semibold
                      transition-all duration-[.4s]
                      change_border
                      whitespace-nowrap
                    "
                    disabled={!contacts.phone}
                  >
                    <Icons.LuPhone size={18} className="opacity-80 shrink-0" />
                    <span className="whitespace-nowrap">{t("Call")}</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={() => onClick("whatsapp", contacts.whatsapp)}
                    className="flex items-center justify-center gap-2 search_btn_styling w-fit h-12 md:h-10 px-6 bg-[#f1ece0] hover:bg-[#9f8151] hover:text-white text-[#0b4a35] font-semibold transition-all duration-[.4s] flex items-center justify-center gap-2 change_border"
                    aria-label="WhatsApp"
                    disabled={!contacts.whatsapp}
                  >
                    <Icons.FaWhatsapp size={18} className="text-green-600" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
