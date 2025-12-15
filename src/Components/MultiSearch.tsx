import Icons from "@/Constants/Icons";
import { ValueContext } from "@/Context/ValueContext";
import UseQueryPost from "@/hooks/useQueryPost";
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
import StaticServices from "@/Services/StaticServices";

const MultiSearch = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState<undefined | string>(undefined);

  // track focus state of the search input (now also controls dropdown)
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const { data: filter } = useQueryGet(["filter"], PropertiesServices.filters);
  const filterPrices = filter?.prices;
  const filterPropertyTypes = filter?.property_types;

  // Get all regions for search suggestions
  const { data: regionsData } = useQueryGet(["regions"], StaticServices.region);

  // State for filtered regions based on search
  const [filteredRegions, setFilteredRegions] = useState<any[]>([]);

  // for search
  const {
    values,
    setValues,
    valueSearch,
    setValueSearch,
    valueSearch: _valueSearch,
    searchId,
    setSearchId,
  } = useContext(ValueContext);

  const handelAddValue = (item: any, type: "property" | "region") => {
    // Create unique identifier combining id and type
    const uniqueId = `${type}_${item?.id}`;

    // Check if item already exists
    const alreadyExists = valueSearch.some(
      (searchItem: any) =>
        searchItem.id === item?.id && searchItem.type === type
    );

    if (alreadyExists) {
      return; // Don't add duplicates
    }

    // Add to valueSearch
    setValueSearch((prev: any) => [...prev, { ...item, type, uniqueId }]);

    // For properties, add to searchId array
    if (type === "property") {
      setSearchId((prev: any) => {
        if (prev.some((id: any) => id == item?.id)) {
          return [...prev];
        } else {
          return [...prev, item?.id];
        }
      });
    }

    // Clear search input
    setValues((prev: any) => ({
      ...prev,
      search: "",
    }));
  };

  useEffect(() => {
    if (searchId) {
      setValues((prev: any) => {
        return {
          ...prev,
          property_ids: searchId,
        };
      });
    }
  }, [searchId, setValues]);

  // get options for search
  const { mutateAsync, data: options } = UseQueryPost(
    ["search"],
    PropertiesServices.Search
  );

  const onSearch = (e: any) => {
    setValues((prev: any) => {
      return {
        ...prev,
        search: e.target.value,
      };
    });
  };

  useEffect(() => {
    if (!values) return;

    // When user is typing in search field, we need to get search suggestions
    // So we should NOT include property_ids in the search request
    if (values?.search && values?.search.length > 0) {
      const { property_ids, ...searchBodyWithoutIds } = values;
      const searchBody =
        values?.type_name !== "new-projects"
          ? { ...searchBodyWithoutIds, is_sale: true }
          : searchBodyWithoutIds;
      mutateAsync(searchBody);
    } else if (!values?.search || values?.search.length === 0) {
      const { property_ids, ...searchBodyWithoutIds } = values;
      const searchBody =
        values?.type_name !== "new-projects"
          ? { ...searchBodyWithoutIds, is_sale: true }
          : searchBodyWithoutIds;
      if (values?.type_id) {
        mutateAsync(searchBody);
      }
    }
  }, [values?.search, values?.type_id, values?.type_name, values, mutateAsync]);

  // Filter regions based on search input
  useEffect(() => {
    if (values?.search && values?.search.length > 0 && regionsData?.region) {
      const searchTerm = values.search.toLowerCase().trim();
      const filtered = regionsData.region.filter((region: any) => {
        const nameMatch = region.name?.toLowerCase().includes(searchTerm);
        return nameMatch;
      });
      setFilteredRegions(filtered);
    } else {
      setFilteredRegions([]);
    }
  }, [values?.search, regionsData]);

  // Sync region_name/region_names with valueSearch
  useEffect(() => {
    const selectedRegions = valueSearch
      .filter((v: any) => v.type === "region")
      .map((v: any) => v.name);

    setValues((prev: any) => {
      const { region_name, region_names, ...rest } = prev;

      if (selectedRegions.length > 1) {
        return {
          ...rest,
          region_names: selectedRegions,
        };
      } else if (selectedRegions.length === 1) {
        return {
          ...rest,
          region_name: selectedRegions[0],
        };
      } else {
        return rest;
      }
    });
  }, [valueSearch, setValues]);

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
                : item?.name == "Buy"
                ? "buy/properties-for-sale"
                : "rent/properties-for-rent",
            search: "",
            property_name: undefined,
            property_type_id: undefined,
            price_min: undefined,
            price_max: undefined,
            bedroom_min: undefined,
            bedroom_max: undefined,
            bathroom_min: undefined,
            bathroom_max: undefined,
            area_min: undefined,
            area_max: undefined,
            developer_id: undefined,
            developer_name: undefined,
            sort: undefined,
            sort_name: undefined,
            property_ids: undefined,
            selected_bedrooms: [],
            selected_bathrooms: [],
          });

          setValueSearch([]);
          setSearchId([]);

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
  }, [data, id, values, setValues, setValueSearch, setSearchId]);

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

const onSubmit = () => {
  if (values?.type_name && values?.type_id) {
    const searchState = {
      property_ids: searchId || values?.property_ids || [],
      valueSearch: valueSearch || [],
      search: values?.search,
      property_name: values?.property_name,
      property_type_id: values?.property_type_id,
      price_min: values?.price_min,
      price_max: values?.price_max,
      bedroom_min: values?.bedroom_min,
      bedroom_max: values?.bedroom_max,
      bathroom_min: values?.bathroom_min,
      bathroom_max: values?.bathroom_max,
      area: values?.area,
      developer_id: values?.developer_id,
      developer_name: values?.developer_name,
      sort: values?.sort,
      sort_name: values?.sort_name,
      type_id: values?.type_id,
      type_name: values?.type_name,
      is_sale: values?.type_name !== "new-projects" ? true : undefined,
      region_name: values?.region_name,
      region_names: values?.region_names,
    };

    const params = new URLSearchParams();

    // -------- TYPE --------
    if (values?.property_name) {
      params.set("type", getPropertyTypeSlug(values.property_name));
    }

    // -------- BEDROOMS (REPEATED PARAMS) --------
    (values?.selected_bedrooms || []).forEach((bed: number | string) => {
      const normalized = bed === "7+" ? "7plus" : String(bed);
      params.append("bedrooms", normalized);
    });

    // -------- BATHROOMS (REPEATED PARAMS) --------
    (values?.selected_bathrooms || []).forEach((bath: number | string) => {
      const normalized = bath === "7+" ? "7plus" : String(bath);
      params.append("bathrooms", normalized);
    });

    // -------- PRICE --------
    if (values?.price_min !== undefined && values?.price_min !== null) {
      params.set("min_price", String(values.price_min));
    }

    if (values?.price_max !== undefined && values?.price_max !== null) {
      params.set("max_price", String(values.price_max));
    }

    const queryString = params.toString();

    let basePath = "";
    if (values?.type_name === "buy/properties-for-sale") {
      basePath = "/buy/properties-for-sale";
    } else if (values?.type_name === "rent/properties-for-rent") {
      basePath = "/rent/properties-for-rent";
    } else {
      basePath = "/new-projects";
    }

    navigate(
      `${basePath}${queryString ? `?${queryString}` : ""}`,
      { state: searchState }
    );
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
          {status == "pending" || status == "error"
            ? renderSkelton
            : renderTypes}
        </div>
        <div className="bg-white/95 backdrop-blur-md border-radius shadow-xl p-2 md:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-2 search_bar_style">
          {/* Search Input with Selected Filters */}
          <div className="flex-1 relative">
            <div className="flex gap-2 flex-wrap min-h-[48px] px-4 py-2">
              {/* Selected Items Tags (inside input as before) */}
              {valueSearch && valueSearch.length > 0 && (
                <span className="extra_margin">
                  {(() => {
                    const firstItem = valueSearch[0];
                    const remainingItems = valueSearch.slice(1);
                    const remainingCount = remainingItems.length;

                    return (
                      <>
                        {/* First item – same UI as before */}
                        <div
                          key={firstItem.uniqueId || firstItem.id || 0}
                          className={`selected_badge flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            firstItem.type === "region"
                              ? "bg-blue-100 text-900"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {firstItem.type === "region" ? (
                            <Icons.IoLocationOutline
                              size={12}
                              className="flex-shrink-0"
                            />
                          ) : (
                            <Icons.IoBusiness
                              size={12}
                              className="flex-shrink-0"
                            />
                          )}
                          <span className="truncate max-w-[120px]">
                            {firstItem.title || firstItem.name}
                          </span>
                          <button
                            onClick={() => {
                              setValueSearch((prev: any) =>
                                prev.filter(
                                  (searchItem: any) =>
                                    searchItem.uniqueId !== firstItem.uniqueId
                                )
                              );
                              if (firstItem.type === "property") {
                                setSearchId((prev: any) =>
                                  prev.filter((id: any) => id !== firstItem.id)
                                );
                              }
                            }}
                            className={`ml-1 rounded-full p-0.5 transition-colors duration-200 ${
                              firstItem.type === "region"
                                ? "hover:bg-blue-200"
                                : "hover:bg-primary/20"
                            }`}
                            aria-label={`Remove ${
                              firstItem.title || firstItem.name
                            }`}
                          >
                            <Icons.FaTimes size={14} />
                          </button>
                        </div>

                        {/* Aggregated "remaining items" badge */}
                        {remainingCount > 0 && (
                          <div className="selected_badge flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                            <span className="truncate max-w-[120px]">
                              {remainingCount} items
                            </span>
                            <button
                              onClick={() => {
                                setValueSearch((prev: any) => {
                                  if (!prev || prev.length === 0) return prev;
                                  return [prev[0]];
                                });

                                setSearchId((prev: any) => {
                                  if (!prev) return prev;
                                  const firstPropertyIdsToKeep =
                                    valueSearch[0]?.type === "property"
                                      ? [valueSearch[0].id]
                                      : [];
                                  return prev.filter((id: any) =>
                                    firstPropertyIdsToKeep.includes(id)
                                  );
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
                  valueSearch && valueSearch.length > 0
                    ? ""
                    : t("Search By Properties...")
                }
                onChange={onSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  setTimeout(() => setIsSearchFocused(false), 150);
                }}
                className={`flex-1 h-8 text-[#5E5C59] placeholder-gray-400 placeholder-16 input_text focus:outline-none bg-transparent min-w-[100px] 
    ${valueSearch && valueSearch.length > 0 ? "" : "pl-8"}
  `}
              />
            </div>

            {/* Search icon */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none mobie_version_icon">
              <Icons.IoIosSearch color="#6b7280" size={16} />
            </div>

            {/* 🔽 Combined Selected Items + Search Results Dropdown – now directly under search */}
            {isSearchFocused && (
              <div className="w-full max-w-md max-h-80 rounded-xl bg-white border border-gray-200 shadow-xl absolute left-0 right-0 top-full mt-2 z-[9999] overflow-y-auto">
                {(() => {
                  const selectedItemsIds = (valueSearch || []).map(
                    (item: any) => item.uniqueId
                  );

                  const hasSelected = (valueSearch || []).length > 0;

                  const availableRegions = filteredRegions.filter(
                    (region: any) =>
                      !selectedItemsIds.includes(`region_${region.id}`)
                  );

                  const filteredProperties = (
                    options?.data?.data?.properties || []
                  ).filter(
                    (item: any) =>
                      !selectedItemsIds.includes(`property_${item?.id}`)
                  );

                  const hasRegions = availableRegions.length > 0;
                  const hasProperties = filteredProperties.length > 0;
                  const hasResults = hasSelected || hasRegions || hasProperties;

                  if (!hasResults) {
                    return (
                      <p className="text-sm font-medium text-gray-500 flex-center py-4">
                        {t("no data found")}
                      </p>
                    );
                  }

                  return (
                    <>
                      {/* SELECTED ITEMS ON TOP (like "Selected locations") */}
                      {hasSelected && (
                        <div className="px-4 py-3 flex flex-wrap gap-2">
                          {valueSearch.map((item: any, index: number) => (
                            <div
                              key={item.uniqueId || item.id || index}
                              className={`selected_badge flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                item.type === "region"
                                  ? "bg-blue-100 text-900"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              {item.type === "region" ? (
                                <Icons.IoLocationOutline
                                  size={12}
                                  className="flex-shrink-0"
                                />
                              ) : (
                                <Icons.IoBusiness
                                  size={12}
                                  className="flex-shrink-0"
                                />
                              )}

                              <span className="truncate max-w-[160px]">
                                {item.title || item.name}
                              </span>

                              <button
                                onClick={() => {
                                  setValueSearch((prev: any) =>
                                    prev.filter(
                                      (searchItem: any) =>
                                        searchItem.uniqueId !== item.uniqueId
                                    )
                                  );

                                  if (item.type === "property") {
                                    setSearchId((prev: any) =>
                                      prev.filter((id: any) => id !== item.id)
                                    );
                                  }
                                }}
                                className={`ml-1 rounded-full p-0.5 transition-colors duration-200 ${
                                  item.type === "region"
                                    ? "hover:bg-blue-200"
                                    : "hover:bg-primary/20"
                                }`}
                                aria-label={`Remove ${
                                  item.title || item.name
                                }`}
                              >
                                <Icons.FaTimes size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {(hasRegions || hasProperties) && hasSelected && (
                        <div className="border-t border-gray-200" />
                      )}

                      {/* REGIONS */}
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
                              className="w-full py-3 px-4 hover:bg-green-50 cursor-pointer border-b border-gray-100 transition-colors duration-200 flex items-center gap-3"
                              onClick={() => handelAddValue(region, "region")}
                            >
                              <div className="flex-shrink-0">
                                <Icons.IoLocationOutline
                                  size={18}
                                  className="text-[#9f8151]"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#094834]">
                                  {region?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {t("Search by region")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* PROPERTIES */}
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
                              onClick={() =>
                                handelAddValue(item, "property")
                              }
                            >
                              <div className="flex-shrink-0">
                                <Icons.IoBusiness
                                  size={18}
                                  className="text-green-600"
                                />
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
                  const hasStudio = selectedBedsRaw.includes(0);
                  const hasSevenPlus = selectedBedsRaw.includes("7+");

                  const numericBeds = (selectedBedsRaw as any[])
                    .filter(
                      (n) => typeof n === "number" && n !== 0
                    ) as number[];
                  numericBeds.sort((a, b) => a - b);

                  const isContiguous =
                    numericBeds.length <= 1 ||
                    numericBeds.every(
                      (v, i) => i === 0 || v === numericBeds[i - 1] + 1
                    );

                  const labels: string[] = [];

                  if (hasStudio) {
                    labels.push(t("Studio"));
                  }

                  if (numericBeds.length > 0) {
                    let numericLabel = "";
                    if (numericBeds.length === 1) {
                      numericLabel = `${numericBeds[0]}`;
                    } else if (isContiguous) {
                      numericLabel = `${numericBeds[0]}-${
                        numericBeds[numericBeds.length - 1]
                      }`;
                    } else {
                      numericLabel = numericBeds.join(", ");
                    }
                    labels.push(numericLabel);
                  }

                  if (hasSevenPlus) {
                    labels.push("7+");
                  }

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
                } else if (
                  values?.bedroom_min === 0 &&
                  values?.bedroom_max === 0
                ) {
                  bedTitle = t("Studio");
                } else if (
                  values?.bedroom_min !== undefined &&
                  values?.bedroom_min !== null &&
                  values?.bedroom_max !== undefined &&
                  values?.bedroom_max !== null
                ) {
                  bedTitle =
                    values.bedroom_min === values.bedroom_max
                      ? `${values.bedroom_min} ${t("Beds")}`
                      : `${values.bedroom_min}-${values.bedroom_max} ${t(
                          "Beds"
                        )}`;
                } else if (
                  values?.bedroom_min !== undefined &&
                  values?.bedroom_min !== null
                ) {
                  bedTitle =
                    values.bedroom_min === 0
                      ? t("Studio") + "+"
                      : `${values.bedroom_min}+ ${t("Beds")}`;
                } else if (
                  values?.bedroom_max !== undefined &&
                  values?.bedroom_max !== null
                ) {
                  bedTitle =
                    values.bedroom_max === 0
                      ? t("Studio")
                      : `<${values.bedroom_max} ${t("Beds")}`;
                } else {
                  bedTitle = t("Beds");
                }

                // ====== BATHROOM TITLE (multi-select aware, supports "7+") ======
                let bathTitle = "";

                const selectedBathsRaw = values?.selected_bathrooms ?? [];

                if (selectedBathsRaw.length > 0) {
                  const hasSevenPlus = selectedBathsRaw.includes("7+");

                  const numericBaths = (selectedBathsRaw as any[])
                    .filter((n) => typeof n === "number") as number[];
                  numericBaths.sort((a, b) => a - b);

                  const isContiguous =
                    numericBaths.length <= 1 ||
                    numericBaths.every(
                      (v, i) => i === 0 || v === numericBaths[i - 1] + 1
                    );

                  const labels: string[] = [];

                  if (numericBaths.length > 0) {
                    let numericLabel = "";
                    if (numericBaths.length === 1) {
                      numericLabel = `${numericBaths[0]}`;
                    } else if (isContiguous) {
                      numericLabel = `${numericBaths[0]}-${
                        numericBaths[numericBaths.length - 1]
                      }`;
                    } else {
                      numericLabel = numericBaths.join(", ");
                    }
                    labels.push(numericLabel);
                  }

                  if (hasSevenPlus) {
                    labels.push("7+");
                  }

                  if (labels.length > 0) {
                    bathTitle = `${labels.join(", ")} ${t("Baths")}`;
                  }
                } else if (
                  values?.bathroom_min !== undefined &&
                  values?.bathroom_min !== null &&
                  values?.bathroom_max !== undefined &&
                  values?.bathroom_max !== null
                ) {
                  bathTitle =
                    values.bathroom_min === values.bathroom_max
                      ? `${values.bathroom_min} ${t("Baths")}`
                      : `${values.bathroom_min}-${values.bathroom_max} ${t(
                          "Baths"
                        )}`;
                } else if (
                  values?.bathroom_min !== undefined &&
                  values?.bathroom_min !== null
                ) {
                  bathTitle = `${values.bathroom_min}+ ${t("Baths")}`;
                } else if (
                  values?.bathroom_max !== undefined &&
                  values?.bathroom_max !== null
                ) {
                  bathTitle = `<${values.bathroom_max} ${t("Baths")}`;
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
                  <div className="flex flex-wrap gap-2">
                    {/* Studio (0) */}
                    <button
                      onClick={() =>
                        setValues((prev: any) => {
                          const current = prev.selected_bedrooms || [];
                          const exists = current.includes(0);
                          const next = exists
                            ? current.filter((v: any) => v !== 0)
                            : [...current, 0];

                          const numeric = next.filter(
                            (n: any) => typeof n === "number"
                          ) as number[];
                          const min = numeric.length
                            ? Math.min(...numeric)
                            : undefined;
                          const max = numeric.length
                            ? Math.max(...numeric)
                            : undefined;

                          return {
                            ...prev,
                            selected_bedrooms: next,
                            bedroom_min: min,
                            bedroom_max: max,
                          };
                        })
                      }
                      className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 input_text_badge ${
                        (values?.selected_bedrooms || []).includes(0)
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {t("Studio")}
                    </button>

                    {/* 1–7 */}
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <button
                        key={num}
                        onClick={() =>
                          setValues((prev: any) => {
                            const current = prev.selected_bedrooms || [];
                            const exists = current.includes(num);
                            const next = exists
                              ? current.filter((v: any) => v !== num)
                              : [...current, num];

                            const numeric = next.filter(
                              (n: any) => typeof n === "number"
                            ) as number[];
                            const min = numeric.length
                              ? Math.min(...numeric)
                              : undefined;
                            const max = numeric.length
                              ? Math.max(...numeric)
                              : undefined;

                            return {
                              ...prev,
                              selected_bedrooms: next,
                              bedroom_min: min,
                              bedroom_max: max,
                            };
                          })
                        }
                        className={`px-4 py-2 rounded-lg input_text_badge text-sm transition-all duration-200 ${
                          (values?.selected_bedrooms || []).includes(num)
                            ? "bg-primary text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {num}
                      </button>
                    ))}

                    {/* 7+ stored as "7+" */}
                    <button
                      onClick={() =>
                        setValues((prev: any) => {
                          const current = prev.selected_bedrooms || [];
                          const exists = current.includes("7+");
                          const next = exists
                            ? current.filter((v: any) => v !== "7+")
                            : [...current, "7+"];

                          const numeric = next.filter(
                            (n: any) => typeof n === "number"
                          ) as number[];
                          const min = numeric.length
                            ? Math.min(...numeric)
                            : undefined;
                          let max: number | string | undefined =
                            numeric.length ? Math.max(...numeric) : undefined;

                          if (next.includes("7+")) {
                            max = "7+";
                          }

                          return {
                            ...prev,
                            selected_bedrooms: next,
                            bedroom_min: min,
                            bedroom_max: max,
                          };
                        })
                      }
                      className={`px-4 py-2 rounded-lg input_text_badge text-sm transition-all duration-200 ${
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
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <button
                        key={num}
                        onClick={() =>
                          setValues((prev: any) => {
                            const current = prev.selected_bathrooms || [];
                            const exists = current.includes(num);
                            const next = exists
                              ? current.filter((v: number) => v !== num)
                              : [...current, num];

                            const min = next.length
                              ? Math.min(...next)
                              : undefined;
                            const max = next.length
                              ? Math.max(...next)
                              : undefined;

                            return {
                              ...prev,
                              selected_bathrooms: next,
                              bathroom_min: min,
                              bathroom_max: max,
                            };
                          })
                        }
                        className={`px-4 py-2 rounded-lg input_text_badge text-sm transition-all duration-200 ${
                          (values?.selected_bathrooms || []).includes(num)
                            ? "bg-primary text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {num}
                      </button>
                    ))}

                    {/* 7+ Bathrooms stored as "7+" */}
                    <button
                      onClick={() =>
                        setValues((prev: any) => {
                          const current = prev.selected_bathrooms || [];
                          const exists = current.includes("7+");
                          const next = exists
                            ? current.filter((v: any) => v !== "7+")
                            : [...current, "7+"];

                          const numeric = next.filter(
                            (n: any) => typeof n === "number"
                          ) as number[];
                          const min = numeric.length
                            ? Math.min(...numeric)
                            : undefined;
                          let max: number | string | undefined =
                            numeric.length ? Math.max(...numeric) : undefined;

                          if (next.includes("7+")) {
                            max = "7+"; // this will be sent to backend
                          }

                          return {
                            ...prev,
                            selected_bathrooms: next,
                            bathroom_min: min,
                            bathroom_max: max,
                          };
                        })
                      }
                      className={`px-4 py-2 rounded-lg input_text_badge text-sm transition-all duration-200 ${
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
                    {filterPropertyTypes?.map((item: any) => (
                      <p
                        key={item.id}
                        className="input_text_badge cursor-pointer text-sm text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200 border-radius"
                        onClick={() => {
                          setValues((prev: any) => {
                            return {
                              ...prev,
                              property_type_id: item?.id,
                              property_name: item?.name,
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
            <span className="hidden sm:inline">{t("Search")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiSearch;
