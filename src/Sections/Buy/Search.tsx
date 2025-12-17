import Icons from "@/Constants/Icons";
import { MainDropdown } from "@/Components";
import { type FC, useEffect, useState } from "react";
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
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
  const { t } = useTranslation();
  const { convertArea } = useAreaUnit();
  const navigate = useNavigate();

  // Page-load debug log: print initial bedrooms/bathrooms from ValueContext (run once)
  useEffect(() => {
    try {
      const sb = values?.selected_bedrooms;
      const sba = values?.selected_bathrooms;
      console.log("Debugging initial bedrooms/bathrooms on page load:", values);
      console.log(
        `[PAGE LOAD STATE] Bedrooms & Bathrooms: {\n  selected_bedrooms: ${JSON.stringify(
          sb
        )},\n  selected_bathrooms: ${JSON.stringify(sba)}\n}`
      );
    } catch (e) {
      // harmless if JSON.stringify fails
      console.log("[PAGE LOAD STATE] Bedrooms & Bathrooms: could not serialize values", e);
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine type_id based on the page type (from parameter)
  const getTypeId = () => {
    if (from === "buy") return "1";
    if (from === "rent") return "2";
    if (from === "projects") return "4";
    return "1";
  };
  const id = getTypeId();

  const filterPrices = item?.prices;
  const filterBedrooms = item?.bedrooms;
  const filtePropertyTypes = item?.property_types;
  const filterDevelopment = filterDeveloper?.developers;

  // Get search suggestions API - separate from main search results
  const { mutateAsync: searchSuggestions, data: searchOptions } = UseQueryPost(
    ["search-suggestions", id],
    PropertiesServices.Search
  );

  // Get all regions for search suggestions
  const { data: regionsData } = useQueryGet(["regions"], StaticServices.region);

  // State for filtered regions based on search
  const [filteredRegions, setFilteredRegions] = useState<any[]>([]);

  // Function to handle value change and close dropdown
  const handleValueChange = (updater: (prev: any) => any) => {
    setValues((prev: any) => {
      const updated = updater(prev);
      return {
        ...updated,
        type_id: id,
      };
    });

    setTimeout(() => {
      const closeEvent = new KeyboardEvent("keydown", { key: "Escape" });
      document.dispatchEvent(closeEvent);
    }, 100);
  };

  // Function to handle value change WITHOUT closing dropdown (for input fields)
  const handleValueChangeWithoutClose = (updater: (prev: any) => any) => {
    setValues((prev: any) => {
      const updated = updater(prev);
      return {
        ...updated,
        type_id: id,
      };
    });
  };

  // Function to clear all filters (your original)
  const clearAllFilters = () => {
    setValueSearch([]);
    setSearchId([]);

    const cleanValues: any = {
      type_id: id,
      search: "",
    };

    if (from !== "projects") {
      cleanValues.is_sale = true;
    } else {
      cleanValues.type_id = 4;
      cleanValues.is_finish = false;
    }

    setValues(cleanValues);

    const apiParams: any = {
      type_id: id,
      page: 1,
    };

    if (from !== "projects") {
      apiParams.is_sale = true;
    } else {
      apiParams.type_id = 4;
      apiParams.is_finish = false;
    }

    onClick(apiParams);

    if (from === "buy") navigate(`/buy/properties-for-sale`);
    else if (from === "rent") navigate(`/rent/properties-for-rent`);
    else if (from === "projects") navigate(`/new-projects`);
  };

  // Fetch search suggestions when user types
  useEffect(() => {
    if (values?.search && values?.search.length > 0) {
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
        return { ...rest, region_names: selectedRegions };
      } else if (selectedRegions.length === 1) {
        return { ...rest, region_name: selectedRegions[0] };
      } else {
        return rest;
      }
    });
  }, [valueSearch, setValues]);

  const onSearch = () => {
    const base = { ...values, type_id: id };

    // sanitize outgoing payload: remove legacy min/max keys and ensure selected arrays
    const sanitized: any = { ...base };
    delete sanitized.bedroom_min;
    delete sanitized.bedroom_max;
    delete sanitized.bathroom_min;
    delete sanitized.bathroom_max;
    delete sanitized.min_bedrooms;
    delete sanitized.max_bedrooms;
    delete sanitized.min_bathrooms;
    delete sanitized.max_bathrooms;

    sanitized.selected_bedrooms = Array.isArray(sanitized.selected_bedrooms)
      ? sanitized.selected_bedrooms
      : getCurrentSelectedBeds(sanitized);
    sanitized.selected_bathrooms = Array.isArray(sanitized.selected_bathrooms)
      ? sanitized.selected_bathrooms
      : getCurrentSelectedBaths(sanitized);

    // Normalize for API/URL: Studio -> studio, 7+ -> 7plus, numbers -> string numbers
    const normalize = (v: number | string) => {
      if (v === "Studio") return "studio";
      if (v === "7+") return "7plus";
      return String(v);
    };

    const normalizedBedrooms = (sanitized.selected_bedrooms || []).map(normalize);
    const normalizedBathrooms = (sanitized.selected_bathrooms || []).map(normalize);

    console.log("[API/QUERY] bedrooms:", normalizedBedrooms);
    console.log("[API/QUERY] bathrooms:", normalizedBathrooms);

    // Pass arrays (sanitized) to onClick
    if (searchId.length > 0) {
      onClick({ property_ids: searchId, ...sanitized });
    } else {
      onClick(sanitized);
    }

    if (from === "projects") return;

    const navState = { ...sanitized, property_ids: searchId };

    if (from == "rent") {
      navigate(`/rent/properties-for-rent`, { state: navState });
    } else if (from == "buy") {
      navigate(`/buy/properties-for-sale`, { state: navState });
    } else {
      navigate(`/new-projects`, { state: navState });
    }
  };

  const onSearchInput = (e: any) => {
    setValues((prev: any) => ({
      ...prev,
      type_id: id,
      search: e.target.value,
    }));
  };

  const handelAddValue = (item: any, type: "property" | "region") => {
    const uniqueId = `${type}_${item?.id}`;

    const alreadyExists = valueSearch.some(
      (searchItem: any) => searchItem.id === item?.id && searchItem.type === type
    );

    if (alreadyExists) return;

    setValueSearch((prev: any) => [...prev, { ...item, type, uniqueId }]);

    if (type === "property") {
      setSearchId((prev: any) => {
        if (prev.some((id: any) => id == item?.id)) return [...prev];
        return [...prev, item?.id];
      });
    }

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
    const filterSearchID = searchId.filter((item1: any) => item1 != item?.id);

    setValueSearch(filterSearch);
    setSearchId(filterSearchID);

    setTimeout(() => {
      if (
        filterSearchID.length == 0 &&
        filterSearch.filter((v: any) => v.type === "region").length === 0
      ) {
        const { property_ids, region_name, region_names, ...filteredData } = values;
        onClick(filteredData);
      } else {
        const { property_ids, region_name, region_names, ...filteredData } = values;
        const updatedData: any = { ...filteredData };

        if (filterSearchID.length > 0) updatedData.property_ids = filterSearchID;

        const remainingRegions = filterSearch
          .filter((v: any) => v.type === "region")
          .map((v: any) => v.name);

        if (remainingRegions.length > 1) updatedData.region_names = remainingRegions;
        else if (remainingRegions.length === 1) updatedData.region_name = remainingRegions[0];

        onClick(updatedData);
      }
    }, 0);
  };

  // Helper to derive current selected bedrooms from either selected_bedrooms array
  // or from bedroom_min/bedroom_max (so we don't lose preloaded search ranges).
  const getCurrentSelectedBeds = (prev: any) => {
    const Studio = "Studio";
    const SevenPlus = "7+";
    const current = prev.selected_bedrooms || [];
    if (current && current.length > 0) {
      console.log("debugging bedrooms - source selected_bedrooms", { selected_bedrooms: current });
      return current;
    }

    const min = prev.bedroom_min;
    const max = prev.bedroom_max;

    // No preselected info
    if ((min === undefined || min === null) && (max === undefined || max === null)) {
      console.log("debugging bedrooms - no preselected info", { bedroom_min: min, bedroom_max: max });
      return [];
    }

    // studio case
    if (min === 0 && max === 0) {
      console.log("debugging bedrooms - studio detected", { bedroom_min: min, bedroom_max: max });
      return [Studio];
    }

    const numericMin = (min !== undefined && min !== null) ? Number(min) : undefined;
    let numericMax: number | undefined;
    if (String(max) === SevenPlus) numericMax = 7;
    else if (max !== undefined && max !== null) numericMax = Number(max);
    else numericMax = numericMin;

    const arr: (number | string)[] = [];
    if (numericMin !== undefined && numericMax !== undefined && !isNaN(numericMin) && !isNaN(numericMax)) {
      for (let i = numericMin; i <= numericMax; i++) arr.push(i);
      if (String(max) === SevenPlus && !arr.includes(SevenPlus)) arr.push(SevenPlus);
    } else if (numericMin !== undefined && !isNaN(numericMin)) {
      arr.push(numericMin);
    } else if (numericMax !== undefined && !isNaN(numericMax)) {
      arr.push(numericMax);
    }

    console.log("debugging bedrooms - derived from min/max", { bedroom_min: min, bedroom_max: max, derived: arr });
    return arr;
  };

  // Helper for bathrooms to derive selected_bathrooms from legacy min/max
  const getCurrentSelectedBaths = (prev: any) => {
    const SevenPlus = "7+";
    const current = prev.selected_bathrooms || [];
    if (current && current.length > 0) {
      console.log("debugging bathrooms - source selected_bathrooms", { selected_bathrooms: current });
      return current;
    }

    const min = prev.bathroom_min ?? prev.min_bathrooms;
    const max = prev.bathroom_max ?? prev.max_bathrooms;

    if ((min === undefined || min === null) && (max === undefined || max === null)) {
      console.log("debugging bathrooms - no preselected info", { bathroom_min: min, bathroom_max: max });
      return [];
    }

    const numericMin = (min !== undefined && min !== null) ? Number(min) : undefined;
    let numericMax: number | undefined;
    if (String(max) === SevenPlus) numericMax = 7;
    else if (max !== undefined && max !== null) numericMax = Number(max);
    else numericMax = numericMin;

    const arr: (number | string)[] = [];
    if (numericMin !== undefined && numericMax !== undefined && !isNaN(numericMin) && !isNaN(numericMax)) {
      for (let i = numericMin; i <= numericMax; i++) arr.push(i);
      if (String(max) === SevenPlus && !arr.includes(SevenPlus)) arr.push(SevenPlus);
    } else if (numericMin !== undefined && !isNaN(numericMin)) {
      arr.push(numericMin);
    } else if (numericMax !== undefined && !isNaN(numericMax)) {
      arr.push(numericMax);
    }

    console.log("debugging bathrooms - derived from min/max", { bathroom_min: min, bathroom_max: max, derived: arr });
    return arr;
  };

  // Sanitize any incoming values (from location.state / persisted storage / parent) to remove
  // legacy min/max fields and ensure selected_* arrays exist. This runs once on mount.
  const location = useLocation();
  useEffect(() => {
    try {
      const maybeSource = location?.state || values || {};

      // If nothing to sanitize, ensure arrays exist
      const hasLegacyKeys = [
        "bedroom_min",
        "bedroom_max",
        "bathroom_min",
        "bathroom_max",
        "min_bedrooms",
        "max_bedrooms",
        "min_bathrooms",
        "max_bathrooms",
      ].some((k) => maybeSource[k] !== undefined && maybeSource[k] !== null);

      const needEnsureArrays = !Array.isArray(maybeSource.selected_bedrooms) || !Array.isArray(maybeSource.selected_bathrooms);

      if (!hasLegacyKeys && !needEnsureArrays) return;

      const restoredBeds = getCurrentSelectedBeds(maybeSource);
      const restoredBaths = getCurrentSelectedBaths(maybeSource);

      const sanitized: any = { ...maybeSource };

      // remove legacy keys
      delete sanitized.bedroom_min;
      delete sanitized.bedroom_max;
      delete sanitized.bathroom_min;
      delete sanitized.bathroom_max;
      delete sanitized.min_bedrooms;
      delete sanitized.max_bedrooms;
      delete sanitized.min_bathrooms;
      delete sanitized.max_bathrooms;

      // ensure arrays
      sanitized.selected_bedrooms = Array.isArray(restoredBeds) ? restoredBeds : [];
      sanitized.selected_bathrooms = Array.isArray(restoredBaths) ? restoredBaths : [];

      console.log("[RESTORE] selected_bedrooms:", sanitized.selected_bedrooms);
      console.log("[RESTORE] selected_bathrooms:", sanitized.selected_bathrooms);

      setValues((prev: any) => ({ ...prev, ...sanitized }));
    } catch (e) {
      // no-op on failure
    }
    // run on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const StudioLabel = "Studio";

  return (
    <div className="w-full internal_search_bar">
      <div className="custom_container mx-auto">
        <div className="mx-auto">
            <div className="bg-white change_border shadow-md border border-gray-200 p-2 md:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <div className="flex-1">
                <div className="relative">
                  <div className="flex flex-wrap items-center w-full min-h-[52px] bg-white border border-gray-200 change_border px-3 py-2 gap-2">
                    <div className="flex-shrink-0 text-gray-400 mt-[2px]">
                      <Icons.IoIosSearch size={16} />
                    </div>

                    <div className="flex flex-wrap items-center flex-1 min-w-0">
                      {valueSearch[0] && (
                        <div className="selected_badge flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary">
                          <span className="truncate">
                            {valueSearch[0]?.title || valueSearch[0]?.name}
                          </span>
                          <button onClick={() => deleteSearch(valueSearch[0])}>
                            <Icons.FaTimes size={14} />
                          </button>
                        </div>
                      )}

                      {valueSearch.length > 1 && (
                        <div className="selected_badge flex items-center px-3 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary">
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
                            <Icons.FaTimes size={14} />
                          </button>
                        </div>
                      )}

                      <input
                        type="text"
                        value={values?.search || ""}
                        onChange={onSearchInput}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                        placeholder={
                          valueSearch && valueSearch.length > 0
                            ? ""
                            : t("Search By Properties...")
                        }
                        className="ml-2 flex-1 h-8 text-[#5E5C59] placeholder-gray-400 focus:outline-none bg-transparent min-w-[100px]"
                      />
                    </div>
                  </div>

                  {(isInputFocused || values?.search?.length >= 1) && (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] max-h-80 overflow-y-auto">
                      {valueSearch.length > 0 && (
                        <div className="p-3 border-b border-gray-200 flex flex-wrap bg-gray-50 gap-2">
                          {valueSearch.map((item: any) => (
                            <div
                              key={item.uniqueId}
                              className="selected_badge flex items-center px-3 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary"
                            >
                              <span className="truncate">
                                {item?.title || item?.name}
                              </span>
                              <button onClick={() => deleteSearch(item)}>
                                <Icons.FaTimes size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {(() => {
                        const selectedItems = valueSearch.map((i: any) => i.uniqueId);

                        const availableRegions = filteredRegions.filter(
                          (r: any) => !selectedItems.includes(`region_${r.id}`)
                        );

                        const searchResults =
                          searchOptions?.data?.data?.properties ||
                          options?.data?.data?.properties ||
                          [];

                        const filteredProperties = searchResults.filter((it: any) => {
                          const matches = it?.title
                            ?.toLowerCase()
                            .includes(values?.search?.toLowerCase());
                          const notSelected = !selectedItems.includes(`property_${it?.id}`);
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
                                  {t("Regions")}
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
                              </>
                            )}

                            {filteredProperties.length > 0 && (
                              <>
                                {filteredProperties.map((it: any) => (
                                  <div
                                    key={it.id}
                                    onClick={() => handelAddValue(it, "property")}
                                    className="p-3 hover:bg-green-50 cursor-pointer flex items-center gap-3 text-sm"
                                  >
                                    <Icons.IoBusiness className="text-green-600" />
                                    {it.title}
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

              <div className="hidden md:block w-px h-8 bg-gray-300" />

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <MainDropdown
                  title={(() => {
                    // Prefer selected arrays when available, fallback to min/max
                    const selBeds: any[] = values?.selected_bedrooms ?? [];
                    const selBaths: any[] = values?.selected_bathrooms ?? [];

                    const makeBedTitleFromArray = (selected: any[]) => {
                      if (!selected || selected.length === 0) return "";
                      // treat numeric 0 as Studio as well as the StudioLabel string
                      const hasStudio = selected.includes(StudioLabel) || selected.includes(0);
                      const hasSevenPlus = selected.includes("7+");

                      const numericBeds = selected.filter((n: any) => typeof n === "number" ) as number[];
                      numericBeds.sort((a, b) => a - b);

                      const isContiguous =
                        numericBeds.length <= 1 ||
                        numericBeds.every((v, i) => i === 0 || v === numericBeds[i - 1] + 1);

                      const labels: string[] = [];

                      if (hasStudio) labels.push(t("Studio"));

                      if (numericBeds.length > 0) {
                        let numericLabel = "";
                        if (numericBeds.length === 1) numericLabel = `${numericBeds[0]}`;
                        else if (isContiguous) numericLabel = `${numericBeds[0]}-${numericBeds[numericBeds.length - 1]}`;
                        else numericLabel = numericBeds.join(", ");
                        labels.push(numericLabel);
                      }

                      if (hasSevenPlus) labels.push("7+");

                      if (labels.length === 1 && hasStudio && !numericBeds.length && !hasSevenPlus) {
                        return t("Studio");
                      } else if (labels.length > 0) {
                        return `${labels.join(", ")} ${t("Beds")}`;
                      }
                      return t("Beds");
                    };

                    const makeBedTitleFromMinMax = () => {
                      if (values?.bedroom_min === 0 && values?.bedroom_max === 0) return t("Studio");
                      if (values?.bedroom_min !== undefined && values?.bedroom_min !== null && values?.bedroom_max !== undefined && values?.bedroom_max !== null) {
                        return values.bedroom_min === values.bedroom_max
                          ? `${values.bedroom_min} ${t("Beds")}`
                          : `${values.bedroom_min}-${values.bedroom_max} ${t("Beds")}`;
                      } else if (values?.bedroom_min !== undefined && values?.bedroom_min !== null) {
                        return values.bedroom_min === 0 ? `${t("Studio")}+` : `${values.bedroom_min}+ ${t("Beds")}`;
                      } else if (values?.bedroom_max !== undefined && values?.bedroom_max !== null) {
                        return values.bedroom_max === 0 ? t("Studio") : `<${values.bedroom_max} ${t("Beds")}`;
                      }
                      return t("Beds");
                    };

                    const makeBathTitleFromArray = (selected: any[]) => {
                      if (!selected || selected.length === 0) return "";
                      const hasSevenPlus = selected.includes("7+");
                      const numericBaths = selected.filter((n: any) => typeof n === "number") as number[];
                      numericBaths.sort((a, b) => a - b);
                      const isContiguous =
                        numericBaths.length <= 1 ||
                        numericBaths.every((v, i) => i === 0 || v === numericBaths[i - 1] + 1);

                      const labels: string[] = [];

                      if (numericBaths.length > 0) {
                        let numericLabel = "";
                        if (numericBaths.length === 1) numericLabel = `${numericBaths[0]}`;
                        else if (isContiguous) numericLabel = `${numericBaths[0]}-${numericBaths[numericBaths.length - 1]}`;
                        else numericLabel = numericBaths.join(", ");
                        labels.push(numericLabel);
                      }

                      if (hasSevenPlus) labels.push("7+");

                      if (labels.length > 0) return `${labels.join(", ")} ${t("Baths")}`;
                      return t("Baths");
                    };

                    const makeBathTitleFromMinMax = () => {
                      if (values?.bathroom_min !== undefined && values?.bathroom_min !== null && values?.bathroom_max !== undefined && values?.bathroom_max !== null) {
                        return values.bathroom_min === values.bathroom_max
                          ? `${values.bathroom_min} ${t("Baths")}`
                          : `${values.bathroom_min}-${values.bathroom_max} ${t("Baths")}`;
                      } else if (values?.bathroom_min !== undefined && values?.bathroom_min !== null) {
                        return `${values.bathroom_min}+ ${t("Baths")}`;
                      } else if (values?.bathroom_max !== undefined && values?.bathroom_max !== null) {
                        return `<${values.bathroom_max} ${t("Baths")}`;
                      }
                      return "";
                    };

                    const bedTitle = selBeds && selBeds.length > 0 ? makeBedTitleFromArray(selBeds) : makeBedTitleFromMinMax();
                    const bathTitle = selBaths && selBaths.length > 0 ? makeBathTitleFromArray(selBaths) : makeBathTitleFromMinMax();

                    if (bedTitle && bathTitle) return `${bedTitle}, ${bathTitle}`;
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
                        {/* Studio */}
                            <button
                              onClick={() =>
                                setValues((prev: any) => {
                                  const current = getCurrentSelectedBeds(prev);
                                  const exists = current.includes(StudioLabel);
                                  const next = exists
                                    ? current.filter((v: any) => v !== StudioLabel)
                                    : [...current.filter((v: any) => v !== "7+"), StudioLabel]; // remove 7+ if adding studio

                                  const out = {
                                    ...prev,
                                    selected_bedrooms: next,
                                  };
                                  console.log("debugging", { action: "toggle studio", out });
                                  return out;
                                })
                              }
                              className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 input_text_badge ${
                                // highlight if selected_bedrooms explicitly includes StudioLabel or numeric 0
                                (((values?.selected_bedrooms || []).includes(StudioLabel) || (values?.selected_bedrooms || []).includes(0)))
                                  ? "bg-primary text-white shadow-md"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {t("Studio")}
                            </button>

                        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                          <button
                            key={num}
                            onClick={() =>
                              setValues((prev: any) => {
                                const current = getCurrentSelectedBeds(prev);
                                // ensure Studio is removed when numeric is toggled
                                const currentFiltered = current.filter((v: any) => v !== StudioLabel);
                                const exists = currentFiltered.includes(num);
                                const next = exists
                                  ? currentFiltered.filter((v: any) => v !== num)
                                  : [...currentFiltered, num];

                                const out = {
                                  ...prev,
                                  selected_bedrooms: next,
                                };
                                console.log("debugging", { action: "toggle numeric bed", num, out });
                                return out;
                              })
                            }
                            className={`px-4 py-2 rounded-lg input_text_badge text-sm transition-all duration-200 ${
                              ((values?.selected_bedrooms || []).includes(num) ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200")
                            }`}
                        >
                          {num}
                        </button>
                        ))}

                        {/* 7+ stored as "7+" */}
                        <button
                          onClick={() =>
                            setValues((prev: any) => {
                              const current = getCurrentSelectedBeds(prev);
                              const currentFiltered = current.filter((v: any) => v !== StudioLabel);
                              const exists = currentFiltered.includes("7+");
                              const next = exists
                                ? currentFiltered.filter((v: any) => v !== "7+")
                                : [...currentFiltered, "7+"];

                              const out = {
                                ...prev,
                                selected_bedrooms: next,
                              };
                              console.log("debugging", { action: "toggle 7+", out });
                              return out;
                            })
                          }
                          className={`px-4 py-2 rounded-lg input_text_badge text-sm transition-all duration-200 ${
                            ((values?.selected_bedrooms || []).includes("7+") ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200")
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

                                return {
                                  ...prev,
                                  selected_bathrooms: next,
                                };
                              })
                            }
                            className={`px-4 py-2 rounded-lg input_text_badge text-sm transition-all duration-200 ${
                              ((values?.selected_bathrooms || []).includes(num) ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200")
                            }`}
                          >
                            {num}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setValues((prev: any) => {
                              const current = prev.selected_bathrooms || [];
                              const exists = current.includes("7+");
                              const next = exists
                                ? current.filter((v: any) => v !== "7+")
                                : [...current, "7+"];

                              return {
                                ...prev,
                                selected_bathrooms: next,
                              };
                            })
                          }
                          className={`px-4 py-2 rounded-lg input_text_badge text-sm transition-all duration-200 ${
                            ((values?.selected_bathrooms || []).includes("7+") ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200")
                          }`}
                        >
                          7+
                        </button>
                      </div>
                    </div>
                  </div>
                </MainDropdown>

                {/* ---------- Type dropdown: replaced markup/classes only ---------- */}
                <MainDropdown
                  title={values?.property_type_id ? values?.property_name : t("Type")}
                  triggerClass="h-12 md:h-10 px-3 text-gray-700 text-sm hover:bg-gray-100 rounded-xl transition-colors duration-200 flex items-center gap-1 bg-white/90 border border-gray-200 w-full md:w-auto justify-center md:justify-start"
                >
                  <div className="w-full p-4 bg-white rounded-xl shadow-lg">
                    <p className="font-semibold text-sm text-[#0b4a35] mb-3">
                      {t("Property Type")}
                    </p>

                    <div className="flex flex-col gap-2">
                      <p
                        className="input_text_badge cursor-pointer text-sm text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        onClick={() =>
                          handleValueChange((prev: any) => ({
                            ...prev,
                            property_type_id: undefined,
                            property_name: undefined,
                          }))
                        }
                      >
                        {t("All Types")}
                      </p>

                      {filtePropertyTypes?.map((it: any) => (
                        <p
                          key={it.id}
                          className="input_text_badge cursor-pointer text-sm text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                          onClick={() =>
                            handleValueChange((prev: any) => ({
                              ...prev,
                              property_type_id: it?.id,
                              property_name: it?.name,
                              type_id: id,
                            }))
                          }
                        >
                          {it.name}
                        </p>
                      ))}
                    </div>
                  </div>
                </MainDropdown>

                {/* ---------- Price Range dropdown: replaced markup/classes only ---------- */}
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
                  triggerClass="h-12 md:h-10 px-3 text-gray-700 text-sm hover:bg-gray-100 rounded-xl transition-colors duration-200 flex items-center gap-1 bg-white/90 border border-gray-200 w-full md:w-auto justify-center md:justify-start"
                >
                  <div className="w-full p-4 bg-white rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-sm text-[#0b4a35] mb-2">
                          {t("Min Price")}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={values?.price_min || ""}
                            onChange={(e) => {
                              const value =
                                e.target.value === "" ? undefined : parseInt(e.target.value);
                              handleValueChangeWithoutClose((prev: any) => ({
                                ...prev,
                                price_min: value,
                              }));
                            }}
                            placeholder={t("Enter Min price")}
                            className="text-[#5E5C59] search-input placeholder-14 placeholder-gray-400 input_text w-full px-3 py-2 text-sm md:text-base lg:text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            min="0"
                          />
                          <button
                            onClick={() =>
                              handleValueChange((prev: any) => ({
                                ...prev,
                                price_min: undefined,
                              }))
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            title={t("Clear")}
                          >
                            <Icons.FaTimes size={14} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-sm text-[#0b4a35] mb-2">
                          {t("Max Price")}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={values?.price_max || ""}
                            onChange={(e) => {
                              const value =
                                e.target.value === "" ? undefined : parseInt(e.target.value);
                              handleValueChangeWithoutClose((prev: any) => ({
                                ...prev,
                                price_max: value,
                              }));
                            }}
                            placeholder={t("Enter Max price")}
                            className="text-[#5E5C59] search-input placeholder-14 placeholder-gray-400 input_text w-full px-3 py-2 text-sm md:text-base lg:text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            min="0"
                          />
                          <button
                            onClick={() =>
                              handleValueChange((prev: any) => ({
                                ...prev,
                                price_max: undefined,
                              }))
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            title={t("Clear")}
                          >
                            <Icons.FaTimes size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                  
                  </div>
                </MainDropdown>
              </div>

              <button
                onClick={onSearch}
                className="search_btn_styling h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold change_border transition-all duration-[.4s] flex items-center justify-center gap-2"
              >
                <Icons.IoIosSearch size={18} />
                <span className="hidden sm:inline">{t("Search")}</span>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
