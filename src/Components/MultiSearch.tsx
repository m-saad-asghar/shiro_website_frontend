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
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { getPropertyTypeSlug } from "@/helpers/propertyTypeHelper";
import StaticServices from "@/Services/StaticServices";

const MultiSearch = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState<undefined | string>(undefined);
  const { data: filter } = useQueryGet(["filter"], PropertiesServices.filters);
  const filterPrices = filter?.prices;
  const filterBedrooms = filter?.bedrooms;
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
  }, [searchId]);

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
    // Check if values exists before destructuring
    if (!values) return;

    // When user is typing in search field, we need to get search suggestions
    // So we should NOT include property_ids in the search request
    if (values?.search && values?.search.length > 0) {
      // Remove property_ids when searching for suggestions
      const { property_ids, ...searchBodyWithoutIds } = values;
      const searchBody =
        values?.type_name !== "new-projects"
          ? { ...searchBodyWithoutIds, is_sale: true }
          : searchBodyWithoutIds;
      mutateAsync(searchBody);
    } else if (!values?.search || values?.search.length === 0) {
      // When search is empty, still make request but without property_ids for suggestions
      const { property_ids, ...searchBodyWithoutIds } = values;
      const searchBody =
        values?.type_name !== "new-projects"
          ? { ...searchBodyWithoutIds, is_sale: true }
          : searchBodyWithoutIds;
      // Only make request if there are other filters or if it's initial load
      if (values?.type_id) {
        mutateAsync(searchBody);
      }
    }
  }, [values?.search, values?.type_id, values?.type_name]);

  // Filter regions based on search input
  useEffect(() => {
    if (values?.search && values?.search.length > 0 && regionsData?.region) {
      const searchTerm = values.search.toLowerCase().trim();
      const filtered = regionsData.region.filter((region: any) => {
        // Search in both English and Arabic names
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
      // Remove old region filters
      const { region_name, region_names, ...rest } = prev;

      // If multiple regions, use region_names (array), if single use region_name (string)
      if (selectedRegions.length > 1) {
        return {
          ...rest,
          region_names: selectedRegions, // Send as array for OR relation
        };
      } else if (selectedRegions.length === 1) {
        return {
          ...rest,
          region_name: selectedRegions[0], // Single region as string
        };
      } else {
        return rest; // No regions selected
      }
    });
  }, [valueSearch, setValues]);

  // render Btn
  const { data, status } = useContext(TypesContext);
  useEffect(() => {
    // Only set default values if we're on the home page
    if (data != undefined && location.pathname === "/") {
      setValues({
        type_id: data?.types[0]?.id,
        type_name: "buy/properties-for-sale",
      });
    }
  }, [data, location.pathname]);
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
            area_min: undefined,
            area_max: undefined,
            developer_id: undefined,
            developer_name: undefined,
            sort: undefined,
            sort_name: undefined,
            property_ids: undefined,
            selected_bedrooms: [],
          });

          // Clear search results
          setValueSearch([]);
          setSearchId([]);

          setId(item?.id);
        }}
        conClass={`${
          item?.id == values?.type_id
            ? "bg-[#094834] text-white border-[#094834] shadow-lg"
            : "text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 backdrop-blur-sm bg-white/90"
        } font-semibold border ${
          item?.name === "Off-plan"
            ? "w-[80px] sm:w-[90px] md:w-[110px]"
            : "w-[60px] sm:w-[70px] md:w-[90px]"
        } h-[40px] sm:h-[40px] md:h-[40px] rounded-xl transition-all duration-300 text-xs sm:text-sm px-2 sm:px-0`}
      />
    ));
  }, [data, id, values]);
  // render skelton
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
  // on search
  const onSubmit = () => {
    if (values?.type_name && values?.type_id) {
      // Prepare search state to pass to the target page
      const searchState = {
        property_ids: searchId || values?.property_ids || [],
        valueSearch: valueSearch || [], // Pass the selected search items
        search: values?.search,
        property_name: values?.property_name,
        property_type_id: values?.property_type_id,
        price_min: values?.price_min,
        price_max: values?.price_max,
        bedroom_min: values?.bedroom_min,
        bedroom_max: values?.bedroom_max,
        area: values?.area,
        developer_id: values?.developer_id,
        developer_name: values?.developer_name,
        sort: values?.sort,
        sort_name: values?.sort_name,
        type_id: values?.type_id,
        type_name: values?.type_name,
        is_sale: values?.type_name !== "new-projects" ? true : undefined,
        region_name: values?.region_name, // Single region
        region_names: values?.region_names, // Multiple regions (OR)
      };

      // Debug: Log the search state to see what's being passed

      if (values?.type_name == "buy/properties-for-sale") {
        navigate(
          `/buy/properties-for-sale${
            values?.property_name
              ? `/${getPropertyTypeSlug(values.property_name)}`
              : ""
          }${
            values?.bedroom_min && values?.bedroom_max != undefined
              ? `/with-${values?.bedroom_min}-to-${values?.bedroom_max}-bedrooms`
              : values?.bedroom_min != undefined
              ? `/more-than-${values?.bedroom_min}-bedrooms`
              : values?.bedroom_max != undefined
              ? `/under-${values?.bedroom_max}-bedrooms`
              : ""
          }${
            values?.price_min && values?.price_max != undefined
              ? `/between-${values?.price_min}-${values?.price_max}`
              : values?.price_min != undefined
              ? `/above-${values?.price_min}`
              : values?.price_max != undefined
              ? `/below-${values?.price_max}`
              : ""
          }`,
          { state: searchState }
        );
      } else if (values?.type_name == "rent/properties-for-rent") {
        navigate(
          `/rent/properties-for-rent${
            values?.property_name
              ? `/${getPropertyTypeSlug(values.property_name)}`
              : ""
          }${
            values?.bedroom_min && values?.bedroom_max != undefined
              ? `/with-${values?.bedroom_min}-to-${values?.bedroom_max}-bedrooms`
              : values?.bedroom_min != undefined
              ? `/more-than-${values?.bedroom_min}-bedrooms`
              : values?.bedroom_max != undefined
              ? `/under-${values?.bedroom_max}-bedrooms`
              : ""
          }${
            values?.price_min && values?.price_max != undefined
              ? `/between-${values?.price_min}-${values?.price_max}`
              : values?.price_min != undefined
              ? `/above-${values?.price_min}`
              : values?.price_max != undefined
              ? `/below-${values?.price_max}`
              : ""
          }`,
          { state: searchState }
        );
      } else {
        navigate(
          `/new-projects${
            values?.property_name
              ? `/${getPropertyTypeSlug(values.property_name)}`
              : ""
          }${
            values?.bedroom_min && values?.bedroom_max != undefined
              ? `/with-${values?.bedroom_min}-to-${values?.bedroom_max}-bedrooms`
              : values?.bedroom_min != undefined
              ? `/more-than-${values?.bedroom_min}-bedrooms`
              : values?.bedroom_max != undefined
              ? `/under-${values?.bedroom_max}-bedrooms`
              : ""
          }${
            values?.price_min && values?.price_max != undefined
              ? `/between-${values?.price_min}-${values?.price_max}`
              : values?.price_min != undefined
              ? `/above-${values?.price_min}`
              : values?.price_max != undefined
              ? `/below-${values?.price_max}`
              : ""
          }`,
          { state: searchState }
        );
      }
    }
  };
  return (
    <div className="text-light flex-col gap-[20px] md:gap-[24px] lg:gap-[32px] absolute bottom-[20px] sm:bottom-[30px] md:bottom-[54px] lg:bottom-[88px] left-4 right-4 md:left-auto md:right-auto">
      <h1 className="hidden md:block w-full lg:w-[70%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight">
        {t("Excellence beyond compare")}
      </h1>
      <div className="flex gap-[8px] sm:gap-[12px] md:gap-[24px] flex-wrap justify-center md:justify-start">
        {status == "pending" || status == "error" ? renderSkelton : renderTypes}
      </div>

      {/* Google Flights Style Search Bar */}
      <div className="w-full max-w-4xl">
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-2 md:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-2">
          {/* Search Input with Selected Filters */}
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
                          // Update region_name in values
                          setValues((prev: any) => {
                            const remainingRegions = valueSearch
                              .filter(
                                (v: any) =>
                                  v.type === "region" &&
                                  v.uniqueId !== item.uniqueId
                              )
                              .map((v: any) => v.name);
                            return {
                              ...prev,
                              region_name:
                                remainingRegions.length > 0
                                  ? remainingRegions.join(",")
                                  : undefined,
                            };
                          });
                        }}
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
                    ? t("Add more...")
                    : t("Search by beds, type or price")
                }
                onChange={onSearch}
                className="flex-1 h-8 text-gray-900 placeholder-gray-500 placeholder:text-center text-sm focus:outline-none bg-transparent min-w-[200px] pl-8"
              />
            </div>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Icons.IoIosSearch color="#6b7280" size={16} />
            </div>
          </div>

          {/* Divider - Hidden on mobile */}
          <div className="hidden md:block w-px h-8 bg-gray-300"></div>

          {/* Beds Dropdown */}
          <div className="relative">
            <MainDropdown
              title={
                values?.bedroom_min === 0 && values?.bedroom_max === 0
                  ? t("Studio")
                  : values?.bedroom_min !== undefined &&
                    values?.bedroom_min !== null &&
                    values?.bedroom_max !== undefined &&
                    values?.bedroom_max !== null
                  ? values?.bedroom_min === 0 && values?.bedroom_max === 0
                    ? t("Studio")
                    : values?.bedroom_min === 0
                    ? `${t("Studio")}-${values.bedroom_max} ${t("Beds")}`
                    : values?.bedroom_max === 0
                    ? `${values.bedroom_min}-${t("Studio")} ${t("Beds")}`
                    : `${values.bedroom_min}-${values.bedroom_max} ${t("Beds")}`
                  : values?.bedroom_min !== undefined &&
                    values?.bedroom_min !== null
                  ? values?.bedroom_min === 0
                    ? t("Studio") + "+"
                    : `${values.bedroom_min}+ ${t("Beds")}`
                  : values?.bedroom_max !== undefined &&
                    values?.bedroom_max !== null
                  ? values?.bedroom_max === 0
                    ? t("Studio")
                    : `<${values.bedroom_max} ${t("Beds")}`
                  : t("Beds")
              }
              triggerClass="h-12 md:h-10 px-3 text-gray-700 text-sm font-semibold hover:bg-gray-100 rounded-xl transition-colors duration-200 flex items-center gap-1 bg-white/90 border border-gray-200 w-full md:w-auto justify-center md:justify-start"
            >
              <div className="w-full p-4 bg-white rounded-xl shadow-lg">
                {/* Quick Selection Buttons */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 font-medium mb-3">
                    {t("Quick Select")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {/* Studio Button */}
                    <button
                      onClick={() =>
                        setValues((prev: any) => {
                          return {
                            ...prev,
                            bedroom_min: 0,
                            bedroom_max: 0,
                          };
                        })
                      }
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        values?.bedroom_min === 0 && values?.bedroom_max === 0
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {t("Studio")}
                    </button>

                    {/* Number Buttons (1-6+) */}
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() =>
                          setValues((prev: any) => {
                            return {
                              ...prev,
                              bedroom_min: num,
                              bedroom_max: num,
                            };
                          })
                        }
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                          values?.bedroom_min === num &&
                          values?.bedroom_max === num
                            ? "bg-primary text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {num}
                      </button>
                    ))}

                    {/* 7+ Button */}
                    <button
                      onClick={() =>
                        setValues((prev: any) => {
                          return {
                            ...prev,
                            bedroom_min: 7,
                            bedroom_max: undefined,
                          };
                        })
                      }
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        values?.bedroom_min === 7 && !values?.bedroom_max
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      7+
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Custom Range */}
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-3">
                    {t("Custom Range")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex-col gap-y-3">
                      <label className="text-xs text-gray-500 mb-1">
                        {t("Min Bedrooms")}
                      </label>
                      <MainDropdown
                        title={
                          values?.bedroom_min !== undefined &&
                          values?.bedroom_min !== null
                            ? values?.bedroom_min === 0
                              ? t("Studio")
                              : values?.bedroom_min
                            : t("no min")
                        }
                        triggerClass="w-full justify-between text-sm border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 bg-white"
                      >
                        <DropdownMenuItem className="bg-white rounded-lg p-1 shadow-sm">
                          <p
                            className="cursor-pointer text-sm md:text-base font-semibold text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            onClick={() =>
                              setValues((prev: any) => {
                                return {
                                  ...prev,
                                  bedroom_min: undefined,
                                };
                              })
                            }
                          >
                            {t("no min")}
                          </p>
                          <p
                            className="cursor-pointer text-sm md:text-base font-semibold text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            onClick={() =>
                              setValues((prev: any) => {
                                return {
                                  ...prev,
                                  bedroom_min: 0,
                                };
                              })
                            }
                          >
                            {t("Studio")}
                          </p>
                          {filterBedrooms?.minOptions?.map((item: number) => (
                            <p
                              key={item}
                              className="cursor-pointer text-sm md:text-base font-semibold text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              onClick={() =>
                                setValues((prev: any) => {
                                  return {
                                    ...prev,
                                    bedroom_min: item,
                                  };
                                })
                              }
                            >
                              {item}
                            </p>
                          ))}
                        </DropdownMenuItem>
                      </MainDropdown>
                    </div>
                    <div className="flex-col gap-y-3">
                      <label className="text-xs text-gray-500 mb-1">
                        {t("max Bedrooms")}
                      </label>
                      <MainDropdown
                        title={
                          values?.bedroom_max !== undefined &&
                          values?.bedroom_max !== null
                            ? values?.bedroom_max === 0
                              ? t("Studio")
                              : values?.bedroom_max
                            : t("no max")
                        }
                        triggerClass="w-full justify-between text-sm border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 bg-white"
                      >
                        <DropdownMenuItem className="bg-white rounded-lg p-1 shadow-sm">
                          <p
                            className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            onClick={() =>
                              setValues((prev: any) => {
                                return {
                                  ...prev,
                                  bedroom_max: undefined,
                                };
                              })
                            }
                          >
                            {t("no max")}
                          </p>
                          <p
                            className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            onClick={() =>
                              setValues((prev: any) => {
                                return {
                                  ...prev,
                                  bedroom_max: 0,
                                };
                              })
                            }
                          >
                            {t("Studio")}
                          </p>
                          {filterBedrooms?.maxOptions?.map((item: number) => (
                            <p
                              key={item}
                              className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              onClick={() =>
                                setValues((prev: any) => {
                                  return {
                                    ...prev,
                                    bedroom_max: item,
                                  };
                                })
                              }
                            >
                              {item}
                            </p>
                          ))}
                        </DropdownMenuItem>
                      </MainDropdown>
                    </div>
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
              triggerClass="h-12 md:h-10 px-3 text-gray-700 text-sm font-semibold hover:bg-gray-100 rounded-xl transition-colors duration-200 flex items-center gap-1 bg-white/90 border border-gray-200 w-full md:w-auto justify-center md:justify-start"
            >
              <div className="w-full p-4 bg-white rounded-xl shadow-lg">
                <div className="flex-col gap-y-3">
                  <p className="text-xs text-gray-600 font-medium mb-3">
                    {t("Property Type")}
                  </p>
                  <div className="grid grid-cols-1 gap-y-2">
                    <p
                      className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      onClick={() => {
                        setValues((prev: any) => {
                          return {
                            ...prev,
                            property_type_id: undefined,
                            property_name: undefined,
                          };
                        });
                        // Close dropdown after selection
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
                        className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        onClick={() => {
                          setValues((prev: any) => {
                            return {
                              ...prev,
                              property_type_id: item?.id,
                              property_name: item?.name,
                            };
                          });
                          // Close dropdown after selection
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
              title={
                values?.price_min || values?.price_max
                  ? values?.price_min && values?.price_max
                    ? `${values.price_min}-${values.price_max}`
                    : values?.price_min
                    ? `${values.price_min}+`
                    : `<${values.price_max}`
                  : t("Price Range")
              }
              triggerClass="h-12 md:h-10 px-3 text-gray-700 text-sm font-semibold hover:bg-gray-100 rounded-xl transition-colors duration-200 flex items-center gap-1 bg-white/90 border border-gray-200 w-full md:w-auto justify-center md:justify-start"
            >
              <div className="w-full p-4 bg-white rounded-xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex-col gap-y-3">
                    <p className="text-xs md:text-sm lg:text-base text-gray-600 font-medium mb-2">
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
                        placeholder={t("Enter min price")}
                        className="w-full px-3 py-2 text-sm md:text-base lg:text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
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
                    <p className="text-xs md:text-sm lg:text-base text-gray-600 font-medium mb-2">
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
                        placeholder={t("Enter max price")}
                        className="w-full px-3 py-2 text-sm md:text-base lg:text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
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
                {/* Quick Price Options */}
                {filterPrices && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs md:text-sm lg:text-base text-gray-600 font-medium mb-3">
                      {t("Quick Select")}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {filterPrices?.minOptions
                        ?.slice(0, 4)
                        .map((item: number) => (
                          <button
                            key={`min-${item}`}
                            onClick={() =>
                              setValues((prev: any) => ({
                                ...prev,
                                price_min: item,
                              }))
                            }
                            className="text-xs md:text-sm lg:text-base px-2 py-1.5 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition-colors duration-200 font-medium"
                          >
                            {t("From")} {item}
                          </button>
                        ))}
                      {filterPrices?.maxOptions
                        ?.slice(0, 4)
                        .map((item: number) => (
                          <button
                            key={`max-${item}`}
                            onClick={() =>
                              setValues((prev: any) => ({
                                ...prev,
                                price_max: item,
                              }))
                            }
                            className="text-xs md:text-sm lg:text-base px-2 py-1.5 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition-colors duration-200 font-medium"
                          >
                            {t("Up to")} {item}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </MainDropdown>
          </div>

          {/* Search Button */}
          <button
            onClick={onSubmit}
            className="h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold rounded-xl transition-all duration-[.4s] flex items-center justify-center gap-2"
            aria-label="Search properties"
          >
            <Icons.IoIosSearch size={18} />
            <span className="hidden sm:inline">{t("Search")}</span>
          </button>
        </div>

        {/* Search Results Dropdown */}
        {values?.search?.length >= 1 && (
          <div className="w-full max-w-md max-h-80 rounded-xl bg-white border border-gray-200 shadow-xl absolute top-full mt-2 z-[9999] overflow-y-auto">
            {(() => {
              // Get already selected items to exclude them
              const selectedItems = (valueSearch || []).map(
                (item: any) => item.uniqueId
              );

              // Filter regions - exclude already selected
              const availableRegions = filteredRegions.filter(
                (region: any) => !selectedItems.includes(`region_${region.id}`)
              );

              // Filter properties - exclude already selected
              const filteredProperties = (
                options?.data?.data?.properties || []
              ).filter(
                (item: any) => !selectedItems.includes(`property_${item?.id}`)
              );

              const hasRegions = availableRegions.length > 0;
              const hasProperties = filteredProperties.length > 0;
              const hasResults = hasRegions || hasProperties;

              return !hasResults ? (
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
                          className="w-full py-3 px-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 transition-colors duration-200 flex items-center gap-3"
                          onClick={() => handelAddValue(region, "region")}
                        >
                          <div className="flex-shrink-0">
                            <Icons.IoLocationOutline
                              size={18}
                              className="text-blue-600"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
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
                          onClick={() => handelAddValue(item, "property")}
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
    </div>
  );
};

export default MultiSearch;
