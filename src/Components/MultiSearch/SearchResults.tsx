/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * SearchResults Component
 * Displays search results dropdown with regions and properties
 */

import Icons from "@/Constants/Icons";
import { useTranslation } from "react-i18next";

interface SearchResultsProps {
  show: boolean;
  valueSearch: any[];
  filteredRegions: any[];
  properties: any[];
  onAddValue: (item: any, type: "property" | "region") => void;
}

export const SearchResults = ({
  show,
  valueSearch,
  filteredRegions,
  properties,
  onAddValue,
}: SearchResultsProps) => {
  const { t } = useTranslation();

  if (!show) return null;

  // Get already selected items to exclude them
  const selectedItems = (valueSearch || []).map((item: any) => item.uniqueId);

  // Filter regions - exclude already selected
  const availableRegions = filteredRegions.filter(
    (region: any) => !selectedItems.includes(`region_${region.id}`)
  );

  // Filter properties - exclude already selected
  const filteredProperties = properties.filter(
    (item: any) => !selectedItems.includes(`property_${item?.id}`)
  );

  const hasRegions = availableRegions.length > 0;
  const hasProperties = filteredProperties.length > 0;
  const hasResults = hasRegions || hasProperties;

  return (
    <div className="w-full max-w-md max-h-80 rounded-xl bg-white border border-gray-200 shadow-xl absolute top-full mt-2 z-[9999] overflow-y-auto">
      {!hasResults ? (
        <p className="text-sm font-medium text-gray-500 flex-center py-4">
          {t("no data found")}
        </p>
      ) : (
        <>
          {/* Regions Section - Show First */}
          {hasRegions && (
            <div className="region-results">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  {t("Regions")}
                </p>
              </div>
              {availableRegions.map((region: any) => (
                <div
                  key={`region_${region.id}`}
                  className="w-full py-3 px-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200 flex items-center gap-3"
                  onClick={() => onAddValue(region, "region")}
                >
                  <div className="flex-shrink-0">
                    <Icons.IoLocationOutline
                      size={18}
                      className="text-blue-600"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {region?.name}
                    </p>
                    <p className="text-xs text-gray-500">{t("Region")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Properties Section - Show Second */}
          {hasProperties && (
            <div className="property-results">
              {hasRegions && (
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase">
                    {t("Properties")}
                  </p>
                </div>
              )}
              {filteredProperties.map((item: any) => (
                <div
                  key={`property_${item.id}`}
                  className="w-full py-3 px-4 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200 flex items-center gap-3"
                  onClick={() => onAddValue(item, "property")}
                >
                  <div className="flex-shrink-0">
                    <Icons.IoBusiness size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {item?.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item?.region?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
