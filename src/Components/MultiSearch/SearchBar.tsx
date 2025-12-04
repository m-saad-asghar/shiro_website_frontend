/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * SearchBar Component
 * Handles search input and selected filter tags
 */

import Icons from "@/Constants/Icons";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  valueSearch: any[];
  values: any;
  onSearch: (e: any) => void;
  onRemove: (item: any) => void;
}

export const SearchBar = ({
  valueSearch,
  values,
  onSearch,
  onRemove,
}: SearchBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 relative">
      <div className="flex items-center gap-2 flex-wrap min-h-[48px] px-4 py-2">
        {/* Selected Items Tags */}
        {valueSearch && valueSearch.length > 0 && (
          <>
            {valueSearch.map((item: any, index: number) => (
              <div
                key={item.uniqueId || item.id || index}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  item.type === "region"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {item.type === "region" ? (
                  <Icons.IoLocationOutline
                    size={12}
                    className="flex-shrink-0"
                  />
                ) : (
                  <Icons.IoBusiness size={12} className="flex-shrink-0" />
                )}
                <span className="truncate max-w-[120px]">
                  {item.title || item.name}
                </span>
                <button
                  onClick={() => onRemove(item)}
                  className={`ml-1 rounded-full p-0.5 transition-colors duration-200 ${
                    item.type === "region"
                      ? "hover:bg-blue-200"
                      : "hover:bg-primary/20"
                  }`}
                  aria-label={`Remove ${item.title || item.name}`}
                >
                  <Icons.FaTimes size={14} />
                </button>
              </div>
            ))}
          </>
        )}

        {/* Search Input */}
        <input
          type="text"
          value={values?.search || ""}
          placeholder={
            valueSearch && valueSearch.length > 0
              ? t("Add More...")
              : t("Search By Properties...")
          }
          onChange={onSearch}
          className="flex-1 h-8 text-gray-900 placeholder-gray-500 placeholder:text-center text-sm focus:outline-none bg-transparent min-w-[200px] pl-8"
        />
      </div>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <Icons.IoIosSearch color="#6b7280" size={16} />
      </div>
    </div>
  );
};
