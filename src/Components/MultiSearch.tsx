import Icons from "@/Constants/Icons";
import { ValueContext } from "@/Context/ValueContext";
import PropertiesServices from "@/Services/PropertiesServices";
import { useContext, useEffect, useMemo, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { TypesContext } from "@/Context/TypesContext";
import Btn from "./Btn";
import { useNavigate, useLocation } from "react-router-dom";
import useQueryGet from "@/hooks/useQueryGet";
import MainDropdown from "./MainDropdown";
import { useTranslation } from "react-i18next";
import { getPropertyTypeSlug } from "@/helpers/propertyTypeHelper";

const MultiSearch = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState<undefined | string>(undefined);

  // track focus state of the search input (controls dropdown)
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const { data: filter } = useQueryGet(["filter"], PropertiesServices.filters);
  const filterPropertyTypes = filter?.property_types;

  // for search (existing global values, but we do NOT store selected options in redux/context)
  const { values, setValues } = useContext(ValueContext);

  // ✅ NEW: local-only state for dropdown options + selected items
  const [listingOptions, setListingOptions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [isTypingLoading, setIsTypingLoading] = useState(false);

  // ✅ Add option (multi select, no duplicates)
  const handleAddOption = (item: any) => {
    const uniqueId = `${item.type}_${item.id}`;

    const alreadyExists = selectedOptions.some(
      (s: any) => `${s.type}_${s.id}` === uniqueId
    );
    if (alreadyExists) return;

    setSelectedOptions((prev: any) => [...prev, { ...item, uniqueId }]);

    // clear input after selection (same UX)
    setValues((prev: any) => ({
      ...prev,
      search: "",
    }));
    setListingOptions([]);
  };

  const handleRemoveOption = (uniqueId: string) => {
    setSelectedOptions((prev: any) => prev.filter((x: any) => x.uniqueId !== uniqueId));
  };

  type PropertyTypeItem = { id: number; name: string; slug: string, code: string };
const [propertyTypes, setPropertyTypes] = useState<PropertyTypeItem[]>([]);

useEffect(() => {
  const controller = new AbortController();

  (async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_BASE_URL}/fetch_property_types`, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      const json = await res.json();
      setPropertyTypes(Array.isArray(json?.data) ? json.data : []);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        console.error("fetch_property_types error:", e);
      }
      setPropertyTypes([]);
    }
  })();

  return () => controller.abort();
}, []);

  useEffect(() => {
    const text = (values?.search || "").trim();

    if (!text) {
      setListingOptions([]);
      return;
    }

    const controller = new AbortController();

    const tmr = setTimeout(async () => {
      try {
setIsTypingLoading(true);
const API_BASE_URL = import.meta.env.VITE_API_URL;


const params = new URLSearchParams({
search_text: text,
});


const res = await fetch(
`${API_BASE_URL}/get_listing_options?${params.toString()}`,
{
method: "GET",
headers: {
Accept: "application/json",
},
signal: controller.signal,
}
);


const json = await res.json();
setListingOptions(Array.isArray(json?.data) ? json.data : []);
}
      // try {
      //   setIsTypingLoading(true);
      // const API_BASE_URL = import.meta.env.VITE_API_URL;
      //   const res = await fetch(`${API_BASE_URL}/get_listing_options`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Accept: "application/json",
      //     },
      //     body: JSON.stringify({ search_text: text }),
      //     signal: controller.signal,
      //   });

      //   const json = await res.json();
      //   setListingOptions(Array.isArray(json?.data) ? json.data : []);
      // } 
      catch (e: any) {
        if (e?.name !== "AbortError") {
          console.error("get_listing_options error:", e);
        }
        setListingOptions([]);
      } finally {
        setIsTypingLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(tmr);
    };
  }, [values?.search, setValues]);

  const onSearch = (e: any) => {
    setValues((prev: any) => {
      return {
        ...prev,
        search: e.target.value,
      };
    });
  };

  // render Btn
  const { data, status } = useContext(TypesContext);

  useEffect(() => {
    if (data != undefined && location.pathname === "/") {
      setValues({
        type_id: data?.types[0]?.id,
        type_name: "buy/properties-for-sale",
      });
    }
  }, [data, location.pathname, setValues]);

  const renderTypes = useMemo(() => {
    return data?.types?.map((item: any) => (
      <Btn
        key={item?.id}
        text={item?.name}
        type="outLine"
        onclick={() => {
          // Reset all search values when switching between types
          setValues({
            type_id: item?.id,
            type_name:
              item?.name == "Off-plan"
                ? "new-projects"
                : 
                item?.name == "Buy"
                ? "buy/properties-for-sale"
                : "rent/properties-for-rent",
            search: "",
            property_name: undefined,
            property_type_id: undefined,
            price_min: undefined,
            price_max: undefined,
            selected_bedrooms: [],
            selected_bathrooms: [],
            area_min: undefined,
            area_max: undefined,
            developer_id: undefined,
            developer_name: undefined,
            sort: undefined,
            sort_name: undefined,
            property_ids: undefined,
          });

          // ✅ clear local selections too
          setSelectedOptions([]);
          setListingOptions([]);

          setId(item?.id);
        }}
        conClass={`${
          item?.id == values?.type_id
            ? "bg-[#094834] text-white border-[#094834] shadow-lg"
            : "text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 backdrop-blur-sm bg-white/90"
        } font-semibold border min-w-[120px] ${
          item?.name === "Off-plan"
            ? "pt-0.5 w-[80px] sm:w-[90px] md:w-[110px]"
            : "w-[60px] sm:w-[70px] md:w-[90px]"
        } h-[40px] sm:h-[40px] md:h-[40px] rounded-xl transition-all duration-300 text-xs sm:text-sm px-2 sm:px-0`}
      />
    ));
  }, [data, id, values, setValues]);

  const renderSkelton = useMemo(() => {
    return [...Array(3)].map((_, index: number) => (
      <Skeleton
        className={`h-[40px] rounded-xl bg-gray-200 border border-gray-300 ${
          index === 2
            ? "w-[80px] sm:w-[90px] md:w-[110px]"
            : "w-[60px] sm:w-[70px] md:w-[90px]"
        }`}
        key={index}
      />
    ));
  }, []);

  // Helper toggles for bedrooms/bathrooms to support multi-select arrays
  const toggleBedroom = (val: number | "Studio" | "7+") => {
    const current = values?.selected_bedrooms || [];
    const exists = current.includes(val);
    const next = exists
      ? current.filter((v: any) => v !== val)
      : [...current, val];

    setValues((prev: any) => ({
      ...prev,
      selected_bedrooms: next,
      min_bedrooms: undefined,
      max_bedrooms: undefined,
      min_bathrooms: undefined,
      max_bathrooms: undefined,
    }));
  };

  const toggleBathroom = (val: number | "7+") => {
    const current = values?.selected_bathrooms || [];
    const exists = current.includes(val);
    const next = exists
      ? current.filter((v: any) => v !== val)
      : [...current, val];

    setValues((prev: any) => ({
      ...prev,
      selected_bathrooms: next,
      min_bathrooms: undefined,
      max_bathrooms: undefined,
      min_bedrooms: undefined,
      max_bedrooms: undefined,
    }));
  };

 const onSubmit = () => {

  if (values?.type_name && values?.type_id) {
    const params = new URLSearchParams();

    // ✅ SEARCH (only if selectedOptions has values)
    const searchValues = (selectedOptions || [])
      .map((item: any) => item?.slug || item?.name)
      .filter((v: any) => typeof v === "string" && v.trim().length > 0);

    searchValues.forEach((v: string) => params.append("search", v));

    // ✅ PRICE (always present as empty string if not set)

    if (values?.price_min !== undefined && values?.price_min !== null && values?.price_min !== "") {
    params.set("min_price", String(values.price_min));
  }

  if (values?.price_max !== undefined && values?.price_max !== null && values?.price_max !== "") {
    params.set("max_price", String(values.price_max));
  }

  if ((values as any)?.property_type_code) {
  params.set("property_type", String((values as any).property_type_code));
}

    // -------- TYPE --------
    // if (values?.property_name) {
    //   params.set("type", getPropertyTypeSlug(values.property_name));
    // }

    // ✅ BEDROOMS (array -> repeated params)
    (values?.selected_bedrooms || []).forEach((bed: number | string) => {
      const normalized =
        bed === "7+" ? "7plus" : bed === "Studio" ? "Studio" : String(bed);
      params.append("bedrooms", normalized);
    });

    // ✅ BATHROOMS (array -> repeated params)
    (values?.selected_bathrooms || []).forEach((bath: number | string) => {
      const normalized = bath === "7+" ? "7plus" : String(bath);
      params.append("bathrooms", normalized);
    });

    const queryString = params.toString();

    let basePath = "";
    if (values?.type_name === "buy/properties-for-sale") {
      basePath = "/buy/properties-for-sale";
    } else if (values?.type_name === "rent/properties-for-rent") {
      basePath = "/rent/properties-for-rent";
    } else {
      basePath = "/new-projects";
    }

    navigate(`${basePath}${queryString ? `?${queryString}` : ""}`);
  }
};



  return (
    <div className="text-light flex-col gap-[20px] md:gap-[24px] lg:gap-[32px] absolute left-4 right-4 md:left-auto md:right-auto">
      <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content !mt-0">
        {t("Excellence beyond compare")}
      </h1>

      {/* Google Flights Style Search Bar */}
      <div className="w-full">
        <div className="border-radius flex gap-[8px] sm:gap-[12px] md:gap-[20px] flex-wrap md:justify-start mb-6 mobile_btns">
          {status == "pending" || status == "error" ? renderSkelton : renderTypes}
        </div>

        <div className="bg-white/95 backdrop-blur-md border-radius shadow-xl p-2 md:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-2 search_bar_style">
          {/* Search Input with Selected Filters */}
          <div className="flex-1 relative">
            <div className="flex gap-2 flex-wrap min-h-[48px] px-4 py-2">
              {/* Selected Items Tags (inside input) */}
              {selectedOptions && selectedOptions.length > 0 && (
                <span className="extra_margin">
                  {(() => {
                    const firstItem = selectedOptions[0];
                    const remainingItems = selectedOptions.slice(1);
                    const remainingCount = remainingItems.length;

                    return (
                      <>
                        <div
                          key={firstItem.uniqueId || firstItem.id || 0}
                          className={`selected_badge flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            firstItem.type === "community" ||
                            firstItem.type === "sub_community"
                              ? "bg-blue-100 text-900"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {firstItem.type === "community" ||
                          firstItem.type === "sub_community" ? (
                            <Icons.IoLocationOutline size={12} className="flex-shrink-0" />
                          ) : (
                            <Icons.IoBusiness size={12} className="flex-shrink-0" />
                          )}

                          <span className="truncate max-w-[120px]">
                            {firstItem.name}
                          </span>

                          <button
                            onClick={() => handleRemoveOption(firstItem.uniqueId)}
                            className={`ml-1 rounded-full p-0.5 transition-colors duration-200 ${
                              firstItem.type === "community" ||
                              firstItem.type === "sub_community"
                                ? "hover:bg-blue-200"
                                : "hover:bg-primary/20"
                            }`}
                            aria-label={`Remove ${firstItem.name}`}
                          >
                            <Icons.FaTimes size={14} />
                          </button>
                        </div>

                        {remainingCount > 0 && (
                          <div className="selected_badge flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                            <span className="truncate max-w-[120px]">
                              {remainingCount} items
                            </span>
                            <button
                              onClick={() => {
                                setSelectedOptions((prev: any) => {
                                  if (!prev || prev.length === 0) return prev;
                                  return [prev[0]];
                                });
                              }}
                              className="ml-1 rounded-full p-0.5 transition-colors duration-200 hover:bg-primary/20"
                              aria-label="Remove pending items"
                            >
                              <Icons.FaTimes size={14} />
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </span>
              )}

              {/* Search Input */}
              <input
                type="text"
                value={values?.search || ""}
                placeholder={
                  selectedOptions && selectedOptions.length > 0
                    ? ""
                    : t("Search By Properties...")
                }
                onChange={onSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  setTimeout(() => setIsSearchFocused(false), 150);
                }}
                className={`flex-1 h-8 text-[#5E5C59] placeholder-gray-400 placeholder-16 input_text focus:outline-none bg-transparent min-w-[100px] 
                  ${selectedOptions && selectedOptions.length > 0 ? "" : "pl-8"}
                `}
              />
            </div>

            {/* Search icon */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none mobie_version_icon">
              <Icons.IoIosSearch color="#6b7280" size={16} />
            </div>

            {/* Dropdown under search */}
          
{isSearchFocused && (
  <div
    className="w-full max-w-md max-h-80 rounded-xl bg-white border border-gray-200 shadow-xl absolute left-0 right-0 top-full mt-2 z-[9999] overflow-y-auto"
    // ✅ prevents input blur when clicking inside dropdown
    onMouseDown={(e) => e.preventDefault()}
  >
    {(() => {
      const selectedIds = (selectedOptions || []).map((x: any) => x.uniqueId);

      const availableOptions = (listingOptions || []).filter(
        (x: any) => !selectedIds.includes(`${x.type}_${x.id}`)
      );

      const hasSelected = (selectedOptions || []).length > 0;
      const hasOptions = availableOptions.length > 0;

      if (!hasSelected && !hasOptions) {
        return (
          <p className="text-sm font-medium text-gray-500 flex-center py-4">
            {isTypingLoading ? t("Loading...") : t("No Data Found")}
          </p>
        );
      }

      return (
        <>
          {/* Selected on top */}
          {hasSelected && (
            <div className="px-4 py-3 flex flex-wrap gap-2">
              {selectedOptions.map((item: any, index: number) => (
                <div
                  key={item.uniqueId || item.id || index}
                  className={`selected_badge flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    item.type === "community" || item.type === "sub_community"
                      ? "bg-blue-100 text-900"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {item.type === "community" || item.type === "sub_community" ? (
                    <Icons.IoLocationOutline size={12} className="flex-shrink-0" />
                  ) : (
                    <Icons.IoBusiness size={12} className="flex-shrink-0" />
                  )}

                  <span className="truncate max-w-[160px]">{item.name}</span>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveOption(item.uniqueId);
                    }}
                    className={`ml-1 rounded-full p-0.5 transition-colors duration-200 ${
                      item.type === "community" || item.type === "sub_community"
                        ? "hover:bg-blue-200"
                        : "hover:bg-primary/20"
                    }`}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Icons.FaTimes size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {hasSelected && hasOptions && <div className="border-t border-gray-200" />}

          {/* Options from Laravel */}
          {hasOptions && (
            <div className="property-results">
              {availableOptions.map((item: any) => (
                <div
                  key={`${item.type}_${item.id}`}
                  className="w-full py-3 px-4 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200 flex items-center gap-3"
                  // ✅ IMPORTANT FIX: use onMouseDown instead of onClick
                  onMouseDown={(e) => {
                    e.preventDefault(); // prevents blur
                    e.stopPropagation();
                    handleAddOption(item);
                  }}
                >
                  <div className="flex-shrink-0">
                    {item.type === "community" || item.type === "sub_community" ? (
                      <Icons.IoLocationOutline size={18} className="text-[#9f8151]" />
                    ) : (
                      <Icons.IoBusiness size={18} className="text-green-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.type === "community"
                        ? t("Community")
                        : item.type === "sub_community"
                        ? t("Sub Community")
                        : t("Property")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      );
    })()}
  </div>
)}

          </div>

          {/* Divider - Hidden on mobile */}
          <div className="hidden md:block w-px h-8 bg-gray-300"></div>

          {/* Beds Dropdown */}
          <div className="relative">
            <MainDropdown
              title={(() => {
                // ====== BEDROOM TITLE (multi-select aware, with "7+")
                let bedTitle = "";

                const selectedBedsRaw = values?.selected_bedrooms ?? [];

                if (selectedBedsRaw.length > 0) {
                  const hasStudio = selectedBedsRaw.includes("Studio");
                  const hasSevenPlus = selectedBedsRaw.includes("7+");

                  const numericBeds = (selectedBedsRaw as any[]).filter(
                    (n) => typeof n === "number"
                  ) as number[];
                  numericBeds.sort((a, b) => a - b);

                  const isContiguous =
                    numericBeds.length <= 1 ||
                    numericBeds.every(
                      (v, i) => i === 0 || v === numericBeds[i - 1] + 1
                    );

                  const labels: string[] = [];

                  if (hasStudio) labels.push(t("Studio"));

                  if (numericBeds.length > 0) {
                    let numericLabel = "";
                    if (numericBeds.length === 1) numericLabel = `${numericBeds[0]}`;
                    else if (isContiguous)
                      numericLabel = `${numericBeds[0]}-${numericBeds[numericBeds.length - 1]}`;
                    else numericLabel = numericBeds.join(", ");
                    labels.push(numericLabel);
                  }

                  if (hasSevenPlus) labels.push("7+");

                  if (
                    labels.length === 1 &&
                    hasStudio &&
                    !numericBeds.length &&
                    !hasSevenPlus
                  ) {
                    bedTitle = t("Studio");
                  } else if (labels.length > 0) {
                    bedTitle = `${labels.join(", ")} ${t("Beds")}`;
                  }
                } else {
                  bedTitle = t("Beds");
                }

                // ====== BATHROOM TITLE (multi-select aware, supports "7+") ======
                let bathTitle = "";

                const selectedBathsRaw = values?.selected_bathrooms ?? [];

                if (selectedBathsRaw.length > 0) {
                  const hasSevenPlus = selectedBathsRaw.includes("7+");

                  const numericBaths = (selectedBathsRaw as any[]).filter(
                    (n) => typeof n === "number"
                  ) as number[];
                  numericBaths.sort((a, b) => a - b);

                  const isContiguous =
                    numericBaths.length <= 1 ||
                    numericBaths.every(
                      (v, i) => i === 0 || v === numericBaths[i - 1] + 1
                    );

                  const labels: string[] = [];

                  if (numericBaths.length > 0) {
                    let numericLabel = "";
                    if (numericBaths.length === 1) numericLabel = `${numericBaths[0]}`;
                    else if (isContiguous)
                      numericLabel = `${numericBaths[0]}-${numericBaths[numericBaths.length - 1]}`;
                    else numericLabel = numericBaths.join(", ");
                    labels.push(numericLabel);
                  }

                  if (hasSevenPlus) labels.push("7+");

                  if (labels.length > 0) {
                    bathTitle = `${labels.join(", ")} ${t("Baths")}`;
                  }
                }

                if (bathTitle && bedTitle) return `${bedTitle}, ${bathTitle}`;
                if (bedTitle) return bedTitle;
                if (bathTitle) return bathTitle;

                return t("Beds");
              })()}
              triggerClass="h-12 md:h-10 px-3 text-gray-700 text-sm hover:bg-gray-100 rounded-xl transition-colors duration-200 flex items-center gap-1 bg-white/90 border border-gray-200 w-full md:w-auto justify-center md:justify-start"
            >
              <div className="w-full p-4 bg-white rounded-xl shadow-lg">
              {/* Bedrooms */}
<div className="mb-4">
  <p className="py-2 rounded-lg font-semibold text-sm transition-all duration-200 mb-3 text-[#0b4a35]">
    {t("Bedrooms")}
  </p>

  {/* ✅ Mobile: grid (no cut) | ✅ Desktop: same flex-wrap */}
  <div className="grid grid-cols-4 gap-2 md:flex md:flex-wrap">
    <button
      onClick={() => toggleBedroom("Studio")}
      className={`w-full md:w-auto px-4 py-2 rounded-lg text-sm transition-all duration-200 input_text_badge ${
        (values?.selected_bedrooms || []).includes("Studio")
          ? "bg-primary text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {t("Studio")}
    </button>

    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
      <button
        key={num}
        onClick={() => toggleBedroom(num)}
        className={`w-full md:w-auto px-4 py-2 rounded-lg input_text_badge text-sm transition-all duration-200 ${
          (values?.selected_bedrooms || []).includes(num)
            ? "bg-primary text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {num}
      </button>
    ))}

    <button
      onClick={() => toggleBedroom("7+")}
      className={`w-full md:w-auto px-4 py-2 rounded-lg input_text_badge text-sm transition-all duration-200 ${
        (values?.selected_bedrooms || []).includes("7+")
          ? "bg-primary text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      7+
    </button>
  </div>
</div>


                <div className="border-t border-gray-200 my-4"></div>
{/* Bathrooms */}
<div className="mb-4">
  <p className="py-2 rounded-lg font-semibold text-sm transition-all duration-200 mb-3 text-[#0b4a35]">
    {t("Bathrooms")}
  </p>

  {/* ✅ Mobile: grid (no cut) | ✅ Desktop: same flex-wrap */}
  <div className="grid grid-cols-4 gap-2 md:flex md:flex-wrap">
    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
      <button
        key={num}
        onClick={() => toggleBathroom(num)}
        className={`w-full md:w-auto px-4 py-2 rounded-lg input_text_badge text-sm transition-all duration-200 ${
          (values?.selected_bathrooms || []).includes(num)
            ? "bg-primary text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {num}
      </button>
    ))}

    <button
      onClick={() => toggleBathroom("7+")}
      className={`w-full md:w-auto px-4 py-2 rounded-lg input_text_badge text-sm transition-all duration-200 ${
        (values?.selected_bathrooms || []).includes("7+")
          ? "bg-primary text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      7+
    </button>
  </div>
</div>

              </div>
            </MainDropdown>
          </div>

          {/* Divider - Hidden on mobile */}
          <div className="hidden md:block w-px h-8 bg-gray-300"></div>

          {/* Type Dropdown */}
          <div className="relative">
            <MainDropdown
              title={values?.property_name ? values.property_name : t("Type")}
              triggerClass="h-12 md:h-10 px-3 text-gray-700 text-sm  hover:bg-gray-100 rounded-xl transition-colors duration-200 flex items-center gap-1 bg-white/90 border border-gray-200 w-full md:w-auto justify-center md:justify-start"
            >
              <div className="w-full p-4 bg-white rounded-xl shadow-lg">
                <div className="flex-col gap-y-3">
                  <p className="rounded-lg font-semibold text-sm transition-all duration-200 text-[#0b4a35]">
                    {t("Property Type")}
                  </p>
                  <div className="grid grid-cols-1 gap-y-2">
                    <p
                      className="input_text_badge cursor-pointer text-sm text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200 border-radius"
                      onClick={() => {
                        setValues((prev: any) => {
                          return {
                            ...prev,
                            property_type_id: undefined,
                            property_name: undefined,
                          };
                        });
                        setTimeout(() => {
                          const closeEvent = new KeyboardEvent("keydown", {
                            key: "Escape",
                          });
                          document.dispatchEvent(closeEvent);
                        }, 100);
                      }}
                    >
                      {t("All Types")}
                    </p>
                   {propertyTypes?.map((item: PropertyTypeItem) => (
  <p
    key={item.id}
    className="input_text_badge cursor-pointer text-sm text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200 border-radius"
    onClick={() => {
      setValues((prev: any) => {
        return {
          ...prev,
          property_type_id: item?.id,
          property_name: item?.name,
          property_type_slug: item?.slug, // ✅ store slug for URL
          property_type_code: item?.code, // Clear code if previously set
        };
      });
      setTimeout(() => {
        const closeEvent = new KeyboardEvent("keydown", {
          key: "Escape",
        });
        document.dispatchEvent(closeEvent);
      }, 100);
    }}
  >
    {item?.name}
  </p>
))}
                  </div>
                </div>
              </div>
            </MainDropdown>
          </div>

          {/* Divider - Hidden on mobile */}
          <div className="hidden md:block w-px h-8 bg-gray-300"></div>

          {/* Price Range with Manual Input */}
          <div className="relative">
            <MainDropdown
              title={t("Price Range")}
              triggerClass="h-12 md:h-10 px-3 text-gray-700 text-sm  hover:bg-gray-100 rounded-xl transition-colors duration-200 flex items-center gap-1 bg-white/90 border border-gray-200 w-full md:w-auto justify-center md:justify-start"
            >
              <div className="w-full p-4 bg-white rounded-xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex-col gap-y-3">
                    <p className="rounded-lg font-semibold text-sm transition-all duration-200 text-[#0b4a35]">
                      {t("Min Price")}
                    </p>
                    <div className="relative">
                      <input
                        type="number"
                        value={values?.price_min || ""}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value);
                          setValues((prev: any) => ({
                            ...prev,
                            price_min: value,
                          }));
                        }}
                        placeholder={t("Enter Min Price")}
                        className="text-[#5E5C59] search-input placeholder-14 placeholder-gray-400 input_text w-full px-3 py-2 text-sm md:text-base lg:text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        min="0"
                      />
                      <button
                        onClick={() =>
                          setValues((prev: any) => ({
                            ...prev,
                            price_min: undefined,
                          }))
                        }
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        title={t("Clear")}
                      >
                        <Icons.FaTimes size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex-col gap-y-3">
                    <p className="rounded-lg font-semibold text-sm transition-all duration-200 text-[#0b4a35]">
                      {t("Max Price")}
                    </p>
                    <div className="relative">
                      <input
                        type="number"
                        value={values?.price_max || ""}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value);
                          setValues((prev: any) => ({
                            ...prev,
                            price_max: value,
                          }));
                        }}
                        placeholder={t("Enter Max Price")}
                        className="text-[#5E5C59] search-input placeholder-14 placeholder-gray-400 input_text w-full px-3 py-2 text-sm md:text-base lg:text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        min="0"
                      />
                      <button
                        onClick={() =>
                          setValues((prev: any) => ({
                            ...prev,
                            price_max: undefined,
                          }))
                        }
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        title={t("Clear")}
                      >
                        <Icons.FaTimes size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </MainDropdown>
          </div>

          {/* Search Button */}
          <button
            onClick={onSubmit}
            className="search_btn_styling h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold change_border transition-all duration-[.4s] flex items-center justify-center gap-2"
            aria-label="Search properties"
          >
            <Icons.IoIosSearch size={18} />
            <span className="">{t("Search")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiSearch;
