import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";

interface PropertyMapProps {
  property?: {
    title?: string;
    location?: string;
    latitude?: number | string;
    longitude?: number | string;
    google_maps_link?: string;
  };
}

const toNumber = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : null;
};

const PropertyMap: React.FC<PropertyMapProps> = ({ property }) => {
  const { t } = useTranslation();

  if (!property) return null;

  const lat = toNumber(property.latitude);
  const lng = toNumber(property.longitude);

  const hasCoords = lat !== null && lng !== null; // allows 0 values too
  const hasLocationText = typeof property.location === "string" && property.location.trim().length > 0;
  const canOpenMaps = !!property.google_maps_link || hasCoords || hasLocationText;

  if (!hasCoords && !hasLocationText) return null;

  const handleViewInMaps = () => {
    if (property.google_maps_link) {
      window.open(property.google_maps_link, "_blank", "noopener,noreferrer");
      return;
    }

    if (hasCoords) {
      window.open(
        `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    if (hasLocationText) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location!)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  // ✅ Reliable embed source
  const iframeSrc = hasCoords
    ? `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=15&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(property.location!)}&z=15&output=embed`;

  return (
    <div className="bg-white change_border shadow-lg p-6 md:p-8 map_styling">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-primary text-xl key_information_heading">
            {t("Location & Map")}
          </h3>

          {hasLocationText && (
            <div className="flex items-center gap-2 text-gray-600">
              <Icons.CiLocationOn className="w-5 h-5 !text-[#9f8151]" />
              <span className="font-semibold text-lg text-[#9f8151]">
                {property.location}
              </span>
            </div>
          )}
        </div>

        {canOpenMaps && (
          <button
            onClick={handleViewInMaps}
            className="search_btn_styling change_border rounded-[4px] font-NeueHaasGrotesk !text-[16px] md:text-[14px] capitalize flex-center cursor-pointer search_btn_styling h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold change_border transition-all duration-[.4s] flex items-center justify-center gap-2 flex-center w-fit min-h-[50px] min-w-[200px]"
          >
            <Icons.CiLocationOn className="w-4 h-4" />
            {t("View in Google Map")}
          </button>
        )}
      </div>

      <div className="rounded-xl overflow-hidden shadow-md">
        <iframe
          src={iframeSrc}
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          title={`Map of ${property.title ?? "property"}`}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PropertyMap;
