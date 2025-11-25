import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";

interface PropertyMapProps {
  property: {
    title?: string;
    map_embed_url?: string;
    latitude?: number;
    longitude?: number;
    google_maps_link?: string;
    location?: string;
  };
}

const PropertyMap: React.FC<PropertyMapProps> = ({ property }) => {
  const { t } = useTranslation();

  // If no location data is available, don't render the map
  if (!property?.map_embed_url && !property?.latitude && !property?.longitude) {
    return null;
  }

  const handleViewInMaps = () => {
    if (property.google_maps_link) {
      window.open(property.google_maps_link, "_blank");
    } else if (property.latitude && property.longitude) {
      window.open(
        `https://www.google.com/maps?q=${property.latitude},${property.longitude}`,
        "_blank"
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t("Location & Map")}
          </h3>
          {property.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <Icons.CiLocationOn className="w-5 h-5 text-primary" />
              <span className="text-base font-medium">{property.location}</span>
            </div>
          )}
        </div>

        {(property.google_maps_link ||
          (property.latitude && property.longitude)) && (
          <button
            onClick={handleViewInMaps}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors duration-200 font-medium"
          >
            <Icons.CiLocationOn className="w-4 h-4" />
            {t("View in Maps")}
          </button>
        )}
      </div>

      <div className="map-container">
        {/* Embedded Map */}
        {property.map_embed_url ? (
          <div className="rounded-xl overflow-hidden shadow-md">
            <iframe
              src={property.map_embed_url}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${property.title}`}
              className="w-full"
            />
          </div>
        ) : property.latitude && property.longitude ? (
          <div className="rounded-xl overflow-hidden shadow-md">
            <iframe
              src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${property.title}`}
              className="w-full"
            />
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center">
              <Icons.CiLocationOn className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                {t("Map not available")}
              </p>
              <p className="text-sm text-gray-500">
                {t("Location coordinates not provided")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Location Info */}
      {property.latitude && property.longitude && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">
                {t("Latitude")}:
              </span>
              <span className="ml-2 text-gray-600">{property.latitude}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                {t("Longitude")}:
              </span>
              <span className="ml-2 text-gray-600">{property.longitude}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
