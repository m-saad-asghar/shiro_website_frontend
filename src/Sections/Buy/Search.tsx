import Icons from "@/Constants/Icons";
import { MainDropdown } from "@/Components";
import { type FC, useEffect, useState } from "react";
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAreaUnit } from "@/Context/AreaUnitContext";
import UseQueryPost from "@/hooks/useQueryPost";
import PropertiesServices from "@/Services/PropertiesServices";
import StaticServices from "@/Services/StaticServices";
import useQueryGet from "@/hooks/useQueryGet";

type SearchProps = {
  item: any;
  values: any;
  setValues: any;
  onClick: any;
  filterDeveloper: any;
  from: any;
  valueSearch: any;
  setValueSearch: any;
  searchId: any;
  setSearchId: any;
  options: any;
};

const Search: FC<SearchProps> = ({
  item,
  setValues,
  values,
  onClick,
  filterDeveloper,
  from,
  valueSearch,
  setValueSearch,
  searchId,
  setSearchId,
  options,
}) => {

 const [isInputFocused, setIsInputFocused] = useState(false);

  // Function to handle value change and close dropdown
  const handleValueChange = (updater: (prev: any) => any) => {
    setValues((prev: any) => {
      const updated = updater(prev);
      // Ensure type_id is always correct for current page
      return {
        ...updated,
        type_id: id,
      };
    });
    // Close dropdown after selection
    setTimeout(() => {
      const closeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
      });
      document.dispatchEvent(closeEvent);
    }, 100);
  };

  // Function to handle value change WITHOUT closing dropdown (for input fields)
  const handleValueChangeWithoutClose = (updater: (prev: any) => any) => {
    setValues((prev: any) => {
      const updated = updater(prev);
      // Ensure type_id is always correct for current page
      return {
        ...updated,
        type_id: id,
      };
    });
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    // First clear search values
    setValueSearch([]);
    setSearchId([]);

    // Build clean values for state
    const cleanValues: any = {
      type_id: id,
      search: "",
    };

    // Add page-specific properties to state
    if (from !== "projects") {
      // For Buy and Rent, add is_sale to show only visible properties
      cleanValues.is_sale = true;
    } else {
      // For Projects, use specific filters
      cleanValues.type_id = 4;
      cleanValues.is_finish = false;
    }

    setValues(cleanValues);

    // Build API call parameters - only include required fields without undefined
    const apiParams: any = {
      type_id: id,
      page: 1,
    };

    // Add page-specific filters for API
    if (from !== "projects") {
      // For Buy and Rent, add is_sale to show only visible properties
      apiParams.is_sale = true;
    } else {
      // For Projects, use specific filters
      apiParams.type_id = 4;
      apiParams.is_finish = false;
    }

    // Call API with clean values (only required parameters, no undefined values)
    onClick(apiParams);

    // Navigate to default URL based on page type
    if (from === "buy") {
      navigate(`/buy/properties-for-sale`);
    } else if (from === "rent") {
      navigate(`/rent/properties-for-rent`);
    } else if (from === "projects") {
      navigate(`/new-projects`);
    }
  };
  const { t } = useTranslation();
  const { convertArea } = useAreaUnit();

  // Determine type_id based on the page type (from parameter)
  const getTypeId = () => {
    if (from === "buy") return "1";
    if (from === "rent") return "2";
    if (from === "projects") return "4";
    return "1"; // default
  };
  const id = getTypeId();
  const filterPrices = item?.prices;
  const filterBedrooms = item?.bedrooms;
  const filterAreas = item?.areas;
  const filtePropertyTypes = item?.property_types;
  const filterDevelopment = filterDeveloper?.developers;
  const navigate = useNavigate();

  // Get search suggestions API - separate from main search results
  const { mutateAsync: searchSuggestions, data: searchOptions } = UseQueryPost(
    ["search-suggestions", id],
    PropertiesServices.Search
  );

  // Get all regions for search suggestions
  const { data: regionsData } = useQueryGet(["regions"], StaticServices.region);

  // State for filtered regions based on search
  const [filteredRegions, setFilteredRegions] = useState<any[]>([]);

  // Fetch search suggestions when user types
  useEffect(() => {
    if (values?.search && values?.search.length > 0) {
      // Remove property_ids when searching for suggestions to get all matching results
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { property_ids, ...searchBodyWithoutIds } = values;
      const searchBody = {
        ...searchBodyWithoutIds,
        type_id: id,
        is_sale: from !== "projects",
      };
      searchSuggestions(searchBody);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.search, id, from]);

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

  const onSearch = () => {
    const searchValues = {
      ...values,
      type_id: id, // Ensure correct type_id
    };

    if (searchId.length > 0) {
      onClick({
        property_ids: searchId,
        ...searchValues,
      });
    } else {
      onClick(searchValues);
    }

    // For projects, don't navigate - just search
    if (from === "projects") {
      return; // API call already done via onClick
    }

    if (from == "rent") {
      navigate(
        `/rent/properties-for-rent${
          values?.property_name ? `/${values.property_name}` : ""
        }${
          values?.price_min && values?.price_max != undefined
            ? `/between-${values?.price_min}-${values?.price_max}`
            : values?.price_min != undefined
            ? `/above-${values?.price_min}`
            : values?.price_max != undefined
            ? `/below-${values?.price_max}`
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
          values?.area_min && values?.area_max != undefined
            ? `/area-between-${values?.area_min}-${values?.area_max}-sqft`
            : values?.area_min != undefined
            ? `/area-more-than-${values?.area_min}-sqft`
            : values?.area_max != undefined
            ? `/area-under-${values?.area_max}-sqft`
            : ""
        }${
          values?.developer_name != undefined
            ? `/developed-by-${values?.developer_name}-properties`
            : ""
        }${
          values?.sort_name != undefined && values?.sort_name == "Highest price"
            ? `/sortby-price-desc`
            : values?.sort_name != undefined &&
              values?.sort_name == "Lowest price"
            ? `/sortby-price-asc`
            : ""
        }`,
        {
          state: {
            property_type_id: values?.property_type_id,
            property_name: values?.property_name,
            price_min: values?.price_min,
            price_max: values?.price_max,
            bedroom_min: values?.bedroom_min,
            bedroom_max: values?.bedroom_max,
            area_min: values?.area_min,
            area_max: values?.area_max,
            developer_id: values?.developer_id,
            developer_name: values?.developer_name,
            sort: values?.sort,
            sort_name: values?.sort_name,
            search: values?.search,
            property_ids: searchId,
          },
        }
      );
    } else if (from == "buy") {
      navigate(
        `/buy/properties-for-sale${
          values?.property_name ? `/${values.property_name}` : ""
        }${
          values?.price_min && values?.price_max != undefined
            ? `/between-${values?.price_min}-${values?.price_max}`
            : values?.price_min != undefined
            ? `/above-${values?.price_min}`
            : values?.price_max != undefined
            ? `/below-${values?.price_max}`
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
          values?.area_min && values?.area_max != undefined
            ? `/area-between-${values?.area_min}-${values?.area_max}-sqft`
            : values?.area_min != undefined
            ? `/area-more-than-${values?.area_min}-sqft`
            : values?.area_max != undefined
            ? `/area-under-${values?.area_max}-sqft`
            : ""
        }${
          values?.developer_name != undefined
            ? `/developed-by-${values?.developer_name}-properties`
            : ""
        }${
          values?.sort_name != undefined && values?.sort_name == "Highest price"
            ? `/sortby-price-desc`
            : values?.sort_name != undefined &&
              values?.sort_name == "Lowest price"
            ? `/sortby-price-asc`
            : ""
        }`,
        {
          state: {
            property_type_id: values?.property_type_id,
            property_name: values?.property_name,
            price_min: values?.price_min,
            price_max: values?.price_max,
            bedroom_min: values?.bedroom_min,
            bedroom_max: values?.bedroom_max,
            area_min: values?.area_min,
            area_max: values?.area_max,
            developer_id: values?.developer_id,
            developer_name: values?.developer_name,
            sort: values?.sort,
            sort_name: values?.sort_name,
            search: values?.search,
            property_ids: searchId,
          },
        }
      );
    } else {
      navigate(
        `/new-projects${
          values?.property_name ? `/${values.property_name}` : ""
        }${
          values?.price_min && values?.price_max != undefined
            ? `/between-${values?.price_min}-${values?.price_max}`
            : values?.price_min != undefined
            ? `/above-${values?.price_min}`
            : values?.price_max != undefined
            ? `/below-${values?.price_max}`
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
          values?.area_min && values?.area_max != undefined
            ? `/area-between-${values?.area_min}-${values?.area_max}-sqft`
            : values?.area_min != undefined
            ? `/area-more-than-${values?.area_min}-sqft`
            : values?.area_max != undefined
            ? `/area-under-${values?.area_max}-sqft`
            : ""
        }${
          values?.developer_name != undefined
            ? `/developed-by-${values?.developer_name}-properties`
            : ""
        }${
          values?.sort_name != undefined && values?.sort_name == "Highest price"
            ? `/sortby-price-desc`
            : values?.sort_name != undefined &&
              values?.sort_name == "Lowest price"
            ? `/sortby-price-asc`
            : ""
        }`,
        {
          state: {
            property_type_id: values?.property_type_id,
            property_name: values?.property_name,
            price_min: values?.price_min,
            price_max: values?.price_max,
            bedroom_min: values?.bedroom_min,
            bedroom_max: values?.bedroom_max,
            area_min: values?.area_min,
            area_max: values?.area_max,
            developer_id: values?.developer_id,
            developer_name: values?.developer_name,
            sort: values?.sort,
            sort_name: values?.sort_name,
            search: values?.search,
            property_ids: searchId,
          },
        }
      );
    }
  };

  //  for multi Seacrh
  const onSearchInput = (e: any) => {
    setValues((prev: any) => {
      return {
        ...prev,
        type_id: id,
        search: e.target.value,
      };
    });
  };

  // for search - supports both properties and regions
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
      type_id: id,
      search: "",
    }));
  };

  const deleteSearch = (item: any) => {
    const filterSearch = valueSearch.filter(
      (item1: any) => item1.uniqueId !== item?.uniqueId
    );

    // Filter property IDs (only for properties, not regions)
    const filterSearchID = searchId.filter((item1: any) => item1 != item?.id);

    setValueSearch(filterSearch);
    setSearchId(filterSearchID);

    // Update search results - region_name/region_names will be synced by useEffect
    setTimeout(() => {
      if (
        filterSearchID.length == 0 &&
        filterSearch.filter((v: any) => v.type === "region").length === 0
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { property_ids, region_name, region_names, ...filteredData } =
          values;
        onClick(filteredData);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { property_ids, region_name, region_names, ...filteredData } =
          values;
        const updatedData: any = { ...filteredData };

        if (filterSearchID.length > 0) {
          updatedData.property_ids = filterSearchID;
        }

        // region_name/region_names will be updated by useEffect, but we need to get current value
        const remainingRegions = filterSearch
          .filter((v: any) => v.type === "region")
          .map((v: any) => v.name);

        if (remainingRegions.length > 1) {
          updatedData.region_names = remainingRegions; // Multiple regions (OR)
        } else if (remainingRegions.length === 1) {
          updatedData.region_name = remainingRegions[0]; // Single region
        }

        onClick(updatedData);
      }
    }, 0);
  };

  return (
    <div className="w-full">
      <div className="custom_container mx-auto">
        <div className="mx-auto">
          {/* Header */}
          {/* <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {t("Find Your Perfect Property")}
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              {t(
                "Discover the best properties in Dubai with our advanced search"
              )}
            </p>
          </div> */}

          {/* Search Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Search Input */}
           {/* ================= SEARCH INPUT WITH CHIPS INSIDE ================= */}
<div className="lg:col-span-4">
  {/* This wrapper is the positioning reference for the dropdown */}
  <div className="relative">

    {/* INPUT + CHIPS */}
    <div className="flex flex-wrap items-center w-full min-h-[52px] bg-white border border-gray-200 rounded-[14px] px-3 py-2 gap-2">
      {/* Search Icon */}
      <div className="flex-shrink-0 text-gray-400 mt-[2px]">
        <Icons.IoIosSearch size={16} />
      </div>

      {/* Chips + Input */}
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
        {/* FIRST CHIP */}
        {valueSearch[0] && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11px] font-medium border shrink-0 ${
              valueSearch[0]?.type === "region"
                ? "bg-[#eef4ff] text-[#2563eb] border-[#dbe7ff]"
                : "bg-[#eefaf3] text-[#15803d] border-[#d1f5e3]"
            }`}
          >
            <span className="truncate max-w-[120px]">
              {valueSearch[0]?.title || valueSearch[0]?.name}
            </span>

            <button onClick={() => deleteSearch(valueSearch[0])}>
              <Icons.MdClear size={11} />
            </button>
          </div>
        )}

        {/* +N COUNTER */}
        {valueSearch.length > 1 && (
          <div className="flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200 shrink-0">
            +{valueSearch.length - 1} items
            <button
              onClick={() => {
                setValueSearch([]);
                setSearchId([]);
                setValues((prev: any) => ({
                  ...prev,
                  search: "",
                  region_name: undefined,
                  region_names: undefined,
                  property_ids: undefined,
                }));
              }}
            >
              <Icons.MdClear size={11} />
            </button>
          </div>
        )}

        {/* INPUT */}
        <input
          type="text"
          value={values?.search || ""}
          onChange={onSearchInput}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
          placeholder={t("Search area, project or community...")}
          className="flex-1 min-w-[160px] bg-transparent outline-none border-none text-[13px] text-gray-800 placeholder-gray-400 py-1"
        />
      </div>
    </div>

    {/* DROPDOWN */}
    {(isInputFocused || values?.search?.length >= 1) && (
      <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] max-h-80 overflow-y-auto">
        {/* Selected items row */}
        {valueSearch.length > 0 && (
          <div className="p-3 border-b border-gray-200 flex flex-wrap gap-2 bg-gray-50">
            {valueSearch.map((item: any) => (
              <div
                key={item.uniqueId}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${
                  item.type === "region"
                    ? "bg-[#eef4ff] text-[#2563eb] border-[#dbe7ff]"
                    : "bg-[#eefaf3] text-[#15803d] border-[#d1f5e3]"
                }`}
              >
                <span className="truncate max-w-[120px]">
                  {item?.title || item?.name}
                </span>

                <button onClick={() => deleteSearch(item)}>
                  <Icons.MdClear size={11} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Suggestions list */}
        {(() => {
          const selectedItems = valueSearch.map((i: any) => i.uniqueId);

          const availableRegions = filteredRegions.filter(
            (r: any) => !selectedItems.includes(`region_${r.id}`)
          );

          const searchResults =
            searchOptions?.data?.data?.properties ||
            options?.data?.data?.properties ||
            [];

          const filteredProperties = searchResults.filter((item: any) => {
            const matches = item?.title
              ?.toLowerCase()
              .includes(values?.search?.toLowerCase());
            const notSelected = !selectedItems.includes(
              `property_${item?.id}`
            );
            return matches && notSelected;
          });

          if (!availableRegions.length && !filteredProperties.length) {
            return (
              <div className="p-4 text-center text-gray-500 text-sm">
                {t("No results found")}
              </div>
            );
          }

          return (
            <>
              {availableRegions.length > 0 && (
                <>
                  <div className="px-3 py-2 bg-gray-50 text-[11px] font-semibold">
                    {t("Properties")} {/* or Regions if you prefer */}
                  </div>
                  {availableRegions.map((region: any) => (
                    <div
                      key={region.id}
                      onClick={() => handelAddValue(region, "region")}
                      className="p-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 text-sm"
                    >
                      <Icons.IoLocationOutline className="text-blue-600" />
                      {region.name}
                    </div>
                  ))}
                </>
              )}

              {filteredProperties.length > 0 && (
                <>
                  <div className="px-3 py-2 bg-gray-50 text-[11px] font-semibold">
                    {t("Properties")}
                  </div>
                  {filteredProperties.map((item: any) => (
                    <div
                      key={item.id}
                      onClick={() => handelAddValue(item, "property")}
                      className="p-3 hover:bg-green-50 cursor-pointer flex items-center gap-3 text-sm"
                    >
                      <Icons.IoBusiness className="text-green-600" />
                      {item.title}
                    </div>
                  ))}
                </>
              )}
            </>
          );
        })()}
      </div>
    )}
  </div>
</div>







              {/* Filters */}
              <div className="lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Property Type */}
                  <MainDropdown
                    title={
                      values?.property_type_id
                        ? values?.property_name
                        : t("Property Type")
                    }
                    triggerClass="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm font-medium text-gray-900 hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <div className="p-2 w-48">
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                        onClick={() =>
                          handleValueChange((prev: any) => ({
                            ...prev,
                            property_type_id: undefined,
                            property_name: undefined,
                          }))
                        }
                      >
                        {t("All Types")}
                      </button>
                      {filtePropertyTypes?.map((item: any) => (
                        <DropdownMenuItem key={item.id}>
                          <button
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                            onClick={() =>
                              handleValueChange((prev: any) => ({
                                ...prev,
                                property_type_id: item?.id,
                                property_name: item?.name,
                                type_id: id,
                              }))
                            }
                          >
                            {item.name}
                          </button>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </MainDropdown>

                  {/* Price Range with Manual Input */}
                  <MainDropdown
                    title={
                      values?.price_min && values?.price_max
                        ? `${values?.price_min} - ${values?.price_max}`
                        : values?.price_min
                        ? `From ${values?.price_min}`
                        : values?.price_max
                        ? `Up to ${values?.price_max}`
                        : t("Price Range")
                    }
                    triggerClass="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm font-medium text-gray-900 hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <div className="p-4 w-96">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs md:text-sm lg:text-base font-medium text-gray-700 mb-2">
                            {t("Min Price")}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={values?.price_min || ""}
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? undefined
                                    : parseInt(e.target.value);
                                handleValueChangeWithoutClose((prev: any) => ({
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
                                handleValueChange((prev: any) => ({
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
                        <div>
                          <label className="block text-xs md:text-sm lg:text-base font-medium text-gray-700 mb-2">
                            {t("Max Price")}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={values?.price_max || ""}
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? undefined
                                    : parseInt(e.target.value);
                                handleValueChangeWithoutClose((prev: any) => ({
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
                                handleValueChange((prev: any) => ({
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
                                    handleValueChange((prev: any) => ({
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
                                    handleValueChange((prev: any) => ({
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

                  {/* Bedrooms */}
                  <MainDropdown
                    title={
                      values?.bedroom_min === 0 && values?.bedroom_max === 0
                        ? t("Studio")
                        : values?.bedroom_min && values?.bedroom_max
                        ? values?.bedroom_min === 0
                          ? `${t("Studio")} - ${values?.bedroom_max} ${t(
                              "Beds"
                            )}`
                          : values?.bedroom_max === 0
                          ? `${values?.bedroom_min} - ${t("Studio")} ${t(
                              "Beds"
                            )}`
                          : `${values?.bedroom_min} - ${
                              values?.bedroom_max
                            } ${t("Beds")}`
                        : values?.bedroom_min !== undefined &&
                          values?.bedroom_min !== null
                        ? values?.bedroom_min === 0
                          ? `${t("Studio")}+`
                          : `${values?.bedroom_min}+ ${t("Beds")}`
                        : values?.bedroom_max !== undefined &&
                          values?.bedroom_max !== null
                        ? values?.bedroom_max === 0
                          ? t("Studio")
                          : `Up to ${values?.bedroom_max} ${t("Beds")}`
                        : t("Bedrooms")
                    }
                    triggerClass="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm font-medium text-gray-900 hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <div className="p-4 w-96">
                      {/* Quick Selection Buttons */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 font-medium mb-3">
                          {t("Quick Select")}
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {/* Studio Button */}
                          <button
                            onClick={() =>
                              handleValueChange((prev: any) => ({
                                ...prev,
                                bedroom_min: 0,
                                bedroom_max: 0,
                              }))
                            }
                            className={`col-span-2 py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                              values?.bedroom_min === 0 &&
                              values?.bedroom_max === 0
                                ? "bg-primary text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {t("Studio")}
                          </button>

                          {/* Number Buttons (1-6) */}
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <button
                              key={num}
                              onClick={() =>
                                handleValueChange((prev: any) => ({
                                  ...prev,
                                  bedroom_min: num,
                                  bedroom_max: num,
                                }))
                              }
                              className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
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
                              handleValueChange((prev: any) => ({
                                ...prev,
                                bedroom_min: 7,
                                bedroom_max: undefined,
                              }))
                            }
                            className={`col-span-2 py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
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
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              {t("Min Beds")}
                            </label>
                            <MainDropdown
                              title={
                                values?.bedroom_min !== undefined &&
                                values?.bedroom_min !== null
                                  ? values?.bedroom_min === 0
                                    ? t("Studio")
                                    : values?.bedroom_min
                                  : t("No min")
                              }
                              triggerClass="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <div className="p-2 w-32">
                                <button
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                                  onClick={() =>
                                    handleValueChange((prev: any) => ({
                                      ...prev,
                                      bedroom_min: undefined,
                                    }))
                                  }
                                >
                                  {t("No min")}
                                </button>
                                <button
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                                  onClick={() =>
                                    handleValueChange((prev: any) => ({
                                      ...prev,
                                      bedroom_min: 0,
                                      type_id: id,
                                    }))
                                  }
                                >
                                  {t("Studio")}
                                </button>
                                {filterBedrooms?.minOptions?.map(
                                  (item: number) => (
                                    <button
                                      key={item}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                                      onClick={() =>
                                        handleValueChange((prev: any) => ({
                                          ...prev,
                                          bedroom_min: item,
                                          type_id: id,
                                        }))
                                      }
                                    >
                                      {item}
                                    </button>
                                  )
                                )}
                              </div>
                            </MainDropdown>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              {t("Max Beds")}
                            </label>
                            <MainDropdown
                              title={
                                values?.bedroom_max !== undefined &&
                                values?.bedroom_max !== null
                                  ? values?.bedroom_max === 0
                                    ? t("Studio")
                                    : values?.bedroom_max
                                  : t("No max")
                              }
                              triggerClass="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <div className="p-2 w-32">
                                <button
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                                  onClick={() =>
                                    handleValueChange((prev: any) => ({
                                      ...prev,
                                      bedroom_max: undefined,
                                    }))
                                  }
                                >
                                  {t("No max")}
                                </button>
                                <button
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                                  onClick={() =>
                                    handleValueChange((prev: any) => ({
                                      ...prev,
                                      bedroom_max: 0,
                                      type_id: id,
                                    }))
                                  }
                                >
                                  {t("Studio")}
                                </button>
                                {filterBedrooms?.maxOptions?.map(
                                  (item: number) => (
                                    <button
                                      key={item}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                                      onClick={() =>
                                        handleValueChange((prev: any) => ({
                                          ...prev,
                                          bedroom_max: item,
                                          type_id: id,
                                        }))
                                      }
                                    >
                                      {item}
                                    </button>
                                  )
                                )}
                              </div>
                            </MainDropdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  </MainDropdown>

                  {/* Area */}
                  <MainDropdown
                    title={
                      values?.area_min && values?.area_max
                        ? `${convertArea(values?.area_min)} - ${convertArea(
                            values?.area_max
                          )}`
                        : values?.area_min
                        ? `From ${convertArea(values?.area_min)}`
                        : values?.area_max
                        ? `Up to ${convertArea(values?.area_max)}`
                        : t("Area")
                    }
                    triggerClass="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm font-medium text-gray-900 hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <div className="p-4 w-80">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            {t("Min Area")}
                          </label>
                          <MainDropdown
                            title={
                              values?.area_min
                                ? convertArea(values?.area_min)
                                : t("No min")
                            }
                            triggerClass="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <div className="p-2 w-40">
                              <button
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                                onClick={() =>
                                  handleValueChange((prev: any) => ({
                                    ...prev,
                                    area_min: undefined,
                                  }))
                                }
                              >
                                {t("No min")}
                              </button>
                              {filterAreas?.minOptions?.map((item: number) => (
                                <button
                                  key={item}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                                  onClick={() =>
                                    handleValueChange((prev: any) => ({
                                      ...prev,
                                      area_min: item,
                                      type_id: id,
                                    }))
                                  }
                                >
                                  {convertArea(item)}
                                </button>
                              ))}
                            </div>
                          </MainDropdown>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            {t("Max Area")}
                          </label>
                          <MainDropdown
                            title={
                              values?.area_max
                                ? convertArea(values?.area_max)
                                : t("No max")
                            }
                            triggerClass="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <div className="p-2 w-40">
                              <button
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                                onClick={() =>
                                  handleValueChange((prev: any) => ({
                                    ...prev,
                                    area_max: undefined,
                                  }))
                                }
                              >
                                {t("No max")}
                              </button>
                              {filterAreas?.maxOptions?.map((item: number) => (
                                <button
                                  key={item}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                                  onClick={() =>
                                    handleValueChange((prev: any) => ({
                                      ...prev,
                                      area_max: item,
                                      type_id: id,
                                    }))
                                  }
                                >
                                  {convertArea(item)}
                                </button>
                              ))}
                            </div>
                          </MainDropdown>
                        </div>
                      </div>
                    </div>
                  </MainDropdown>
                </div>

                {/* Developer, Clear All & Search Button Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {/* Developer */}
                  <MainDropdown
                    title={
                      values?.developer_name
                        ? values?.developer_name
                        : t("All Developers")
                    }
                    triggerClass="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm font-medium text-gray-900 hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <div className="p-2 w-56 max-h-60 overflow-y-auto">
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                        onClick={() =>
                          handleValueChange((prev: any) => ({
                            ...prev,
                            developer_id: undefined,
                            developer_name: "All Developers",
                          }))
                        }
                      >
                        {t("All Developers")}
                      </button>
                      {filterDevelopment?.map((item: any) => (
                        <button
                          key={item.id}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                          onClick={() =>
                            handleValueChange((prev: any) => ({
                              ...prev,
                              developer_id: item.id,
                              developer_name: item?.name,
                              type_id: id,
                            }))
                          }
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </MainDropdown>

                  {/* Clear All Button */}
                  <button
                    onClick={clearAllFilters}
                    className="w-full h-14 bg-[#9c8050] text-white font-semibold rounded-xl hover:bg-[#8a6f45] transition-all duration-[.4s] flex items-center justify-center"
                  >
                    {t("Clear All")}
                  </button>

                  {/* Search Button */}
                  <button
                    onClick={onSearch}
                    className="w-full h-14 bg-primary text-white font-semibold rounded-xl hover:bg-[#073a2a] transition-all duration-[.4s] flex items-center justify-center gap-2"
                  >
                    <Icons.IoIosSearch size={20} />
                    {t("Search Properties")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
