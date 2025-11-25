import Icons from "@/Constants/Icons";
import Images from "@/Constants/Images";
import ImagesUrl from "@/helpers/ImagesURL";
import UseQueryPost from "@/hooks/useQueryPost";
import FavouritesServices from "@/Services/FavouritesServices";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type FavoriteCardProps = {
  item: any;
};

const FavoriteCard: FC<FavoriteCardProps> = ({ item }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync } = UseQueryPost(
    ["deleteItem"],
    FavouritesServices.ToggleFavourite,
    undefined,
    ["allFavorites"],
    { success: t("done") }
  );

  const handelSubmit = (id: any) => {
    mutateAsync({
      property_id: id,
    });
  };

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`);
  };

  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleWhatsAppClick = (whatsapp: string) => {
    window.open(`https://wa.me/${whatsapp}`);
  };

  // Get contact info from agent
  const phoneContact = item?.agent?.contact_inf?.find(
    (contact: any) => contact.type === "phone"
  );
  const whatsappContact = item?.agent?.contact_inf?.find(
    (contact: any) => contact.type === "whatsapp"
  );

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {item?.images && item.images.length > 0 ? (
          <img
            src={ImagesUrl(item?.images[0])}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            alt={item?.title || "Favorite property image"}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "/src/assets/Images/Property/placeholder-property.jpg";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Icons.IoImageOutline
                size={32}
                className="text-gray-400 mx-auto mb-2"
              />
              <p className="text-gray-500 text-xs">No image</p>
            </div>
          </div>
        )}

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg">
          {item?.property_type?.name}
        </div>

        {/* Remove Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handelSubmit(item?.id);
          }}
          className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transition-all duration-300 z-10"
        >
          <Icons.LiaTimesSolid size={18} />
        </motion.button>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
      </div>

      {/* Content Section */}
      <div
        className="flex-1 p-6 flex flex-col justify-between cursor-pointer"
        onClick={() => {
          // Use slug if available, otherwise create descriptive slug
          const propertySlug =
            item.slug ||
            `${item?.num_bedroom}-bedroom-${
              item?.property_type?.name || "property"
            }-for-sale-in-${
              item?.location?.replace(/\s+/g, "-") || "dubai"
            }`.toLowerCase();
          navigate(`/single-property/${propertySlug}`);
        }}
      >
        {/* Property Info */}
        <div className="space-y-3">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
            {item?.title}
          </h3>

          {/* Price */}
          <div className="text-xl font-bold text-primary">
            {item?.currency_symbol} {item?.converted_price}
          </div>

          {/* Property Type */}
          <p className="text-sm text-gray-600">
            {item?.num_bedroom === 0 ? t("Studio") : item?.num_bedroom} bedroom{" "}
            {item?.property_type?.name} for sale
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <Icons.CiLocationOn size={16} className="text-primary" />
            <span className="text-sm font-medium">{item?.location}</span>
          </div>
        </div>

        {/* Property Features */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img src={Images.BedsIcons} className="w-4 h-4" alt="Bedrooms" />
            <div className="text-center">
              <div className="text-sm font-semibold text-primary">
                {item?.num_bedroom === 0 ? t("Studio") : item?.num_bedroom}
              </div>
              <div className="text-xs text-gray-500">{t("Bedrooms")}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src={Images.BathIcons} className="w-4 h-4" alt="Bathrooms" />
            <div className="text-center">
              <div className="text-sm font-semibold text-primary">
                {item?.num_bathroom}
              </div>
              <div className="text-xs text-gray-500">{t("Bathrooms")}</div>
            </div>
          </div>
        </div>

        {/* Contact Buttons */}
        <div
          className="flex justify-center gap-2 pt-4 border-t border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {phoneContact && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePhoneClick(phoneContact.value)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-all duration-300"
            >
              <Icons.LuPhone size={16} />
              {t("Call")}
            </motion.button>
          )}
          {whatsappContact && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleWhatsAppClick(whatsappContact.value)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-all duration-300"
            >
              <Icons.FaWhatsapp size={16} />
              {t("WhatsApp")}
            </motion.button>
          )}
          {item?.agent?.email && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEmailClick(item.agent.email)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[#9f8151] text-white hover:bg-[#8a6f45] transition-all duration-300"
            >
              <Icons.MdOutlineEmail size={16} />
              {t("Email")}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FavoriteCard;
