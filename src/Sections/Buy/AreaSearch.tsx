import Icons from "@/Constants/Icons";
import { MainDropdown } from "@/Components";
import { type FC, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAreaUnit } from "@/Context/AreaUnitContext";

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

type ListingOption = {
  id: number | string;
  name: string;
  slug?: string;
  type: "community" | "sub_community" | "property" | string;
};

// ✅ CHANGED: slug -> code (slug optional if API still returns it)
type PropertyTypeItem = { id: number; name: string; code: string; slug?: string };

const AreaSearch: FC<SearchProps> = ({
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
  const location = useLocation();

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

  // ✅ SAME AS MAIN SEARCHBAR: local options + selected items (use valueSearch as UI state)
  const [listingOptions, setListingOptions] = useState<ListingOption[]>([]);
  const [isTypingLoading, setIsTypingLoading] = useState(false);

  // ✅ SAME AS MAIN SEARCHBAR: property types from endpoint (code needed)
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
        if (e?.name !== "AbortError")
          console.error("fetch_property_types error:", e);
        setPropertyTypes([]);
      }
    })();

    return () => controller.abort();
  }, []);

  // ====== HELPERS (same behavior as your earlier code) ======
  const StudioLabel = "Studio";

  const getCurrentSelectedBeds = (prev: any) => {
    const Studio = "Studio";
    const SevenPlus = "7+";
    const current = prev.selected_bedrooms || [];
    if (current && current.length > 0) return current;

    const min = prev.bedroom_min;
    const max = prev.bedroom_max;

    if ((min === undefined || min === null) && (max === undefined || max === null))
      return [];

    if (min === 0 && max === 0) return [Studio];

    const numericMin = min !== undefined && min !== null ? Number(min) : undefined;
    let numericMax: number | undefined;
    if (String(max) === SevenPlus) numericMax = 7;
    else if (max !== undefined && max !== null) numericMax = Number(max);
    else numericMax = numericMin;

    const arr: (number | string)[] = [];
    if (
      numericMin !== undefined &&
      numericMax !== undefined &&
      !isNaN(numericMin) &&
      !isNaN(numericMax)
    ) {
      for (let i = numericMin; i <= numericMax; i++) arr.push(i);
      if (String(max) === SevenPlus && !arr.includes(SevenPlus)) arr.push(SevenPlus);
    } else if (numericMin !== undefined && !isNaN(numericMin)) {
      arr.push(numericMin);
    } else if (numericMax !== undefined && !isNaN(numericMax)) {
      arr.push(numericMax);
    }

    return arr;
  };

  const getCurrentSelectedBaths = (prev: any) => {
    const SevenPlus = "7+";
    const current = prev.selected_bathrooms || [];
    if (current && current.length > 0) return current;

    const min = prev.bathroom_min ?? prev.min_bathrooms;
    const max = prev.bathroom_max ?? prev.max_bathrooms;

    if ((min === undefined || min === null) && (max === undefined || max === null))
      return [];

    const numericMin = min !== undefined && min !== null ? Number(min) : undefined;
    let numericMax: number | undefined;
    if (String(max) === SevenPlus) numericMax = 7;
    else if (max !== undefined && max !== null) numericMax = Number(max);
    else numericMax = numericMin;

    const arr: (number | string)[] = [];
    if (
      numericMin !== undefined &&
      numericMax !== undefined &&
      !isNaN(numericMin) &&
      !isNaN(numericMax)
    ) {
      for (let i = numericMin; i <= numericMax; i++) arr.push(i);
      if (String(max) === SevenPlus && !arr.includes(SevenPlus)) arr.push(SevenPlus);
    } else if (numericMin !== undefined && !isNaN(numericMin)) {
      arr.push(numericMin);
    } else if (numericMax !== undefined && !isNaN(numericMax)) {
      arr.push(numericMax);
    }

    return arr;
  };

  const normalizeBedFromUrl = (b: string) => {
    const lower = String(b).toLowerCase();
    if (lower === "studio") return "Studio";
    if (lower === "7plus") return "7+";
    if (!isNaN(Number(b))) return Number(b);
    return b;
  };

  const normalizeBathFromUrl = (b: string) => {
    const lower = String(b).toLowerCase();
    if (lower === "7plus") return "7+";
    if (!isNaN(Number(b))) return Number(b);
    return b;
  };

  // ✅ IMPORTANT: URL → VALUES (so filters show after refresh / direct link)
  // We also wait for propertyTypes to load so we can set property_name by code.

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const sp = new URLSearchParams(location.search);

      // ---- search chips (multi "search=") ----
      const searchValues = sp
        .getAll("search")
        .map((s) => String(s || "").trim())
        .filter(Boolean);

      // fallback chips (if endpoint fails)
      const fallbackChips = searchValues.map((slug) => ({
        id: slug,
        name: slug,
        title: slug.replace(/-/g, " "),
        slug,
        type: "property",
        uniqueId: `property_${slug}`,
      }));

      // ---- price ----
      const minRaw = sp.get("min_price");
      const maxRaw = sp.get("max_price");

      const min_price =
        minRaw !== null && minRaw !== "" && !isNaN(Number(minRaw))
          ? Number(minRaw)
          : undefined;

      const max_price =
        maxRaw !== null && maxRaw !== "" && !isNaN(Number(maxRaw))
          ? Number(maxRaw)
          : undefined;

      // ---- property type (CODE) ----
      const propertyTypeCode = sp.get("property_type")?.trim() || undefined;

      const matchedType = propertyTypeCode
        ? propertyTypes.find((p) => String(p.code) === String(propertyTypeCode))
        : undefined;

      // ---- bedrooms ----
      const bedroomsRaw = sp
        .getAll("bedrooms")
        .map((x) => String(x || "").trim())
        .filter(Boolean);
      const selected_bedrooms = bedroomsRaw.map(normalizeBedFromUrl);

      // ---- bathrooms ----
      const bathroomsRaw = sp
        .getAll("bathrooms")
        .map((x) => String(x || "").trim())
        .filter(Boolean);
      const selected_bathrooms = bathroomsRaw.map(normalizeBathFromUrl);

      // ---- resolve chips using backend (slug -> name) ----
      let resolvedChips: any[] = fallbackChips;

      try {
        if (searchValues.length > 0) {
          const API_BASE_URL = import.meta.env.VITE_API_URL;

          const res = await fetch(`${API_BASE_URL}/resolve_search_slugs`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ search: searchValues }),
          });

          const json = await res.json();
          const data = Array.isArray(json?.data) ? json.data : [];

          resolvedChips = data.map((x: any) => ({
            ...x,
            uniqueId: `${x.type}_${x.id}`,
            title: x.name, // ✅ show name in bar
          }));
        }
      } catch (err) {
        console.error("resolve_search_slugs error:", err);
        resolvedChips = fallbackChips;
      }

      if (!isMounted) return;

      // Apply to state
      setValueSearch(resolvedChips);
      setSearchId([]);

      setValues((prev: any) => ({
        ...prev,
        type_id: id,
        search: "",

        price_min: min_price,
        price_max: max_price,

        selected_bedrooms: Array.isArray(selected_bedrooms)
          ? selected_bedrooms
          : getCurrentSelectedBeds(prev),

        selected_bathrooms: Array.isArray(selected_bathrooms)
          ? selected_bathrooms
          : getCurrentSelectedBaths(prev),

        ...(propertyTypeCode ? { property_type_code: propertyTypeCode } : {}),
        ...(matchedType
          ? {
              property_type_id: matchedType.id,
              property_name: matchedType.name,
            }
          : {}),
      }));
    })();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, id, propertyTypes]);

  // ✅ Fetch listing options on typing (same endpoint as main)
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

        const res = await fetch(`${API_BASE_URL}/get_listing_options`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ search_text: text }),
          signal: controller.signal,
        });

        const json = await res.json();
        setListingOptions(Array.isArray(json?.data) ? json.data : []);
      } catch (e: any) {
        if (e?.name !== "AbortError") console.error("get_listing_options error:", e);
        setListingOptions([]);
      } finally {
        setIsTypingLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(tmr);
    };
  }, [values?.search]);

  // ✅ same UX: input change
  const onSearchInput = (e: any) => {
    setValues((prev: any) => ({
      ...prev,
      type_id: id,
      search: e.target.value,
    }));
  };

  // ✅ Add option (multi select, no duplicates) — stores in valueSearch for UI
  const handleAddOption = (item: ListingOption) => {
    const uniqueId = `${item.type}_${item.id}`;

    const alreadyExists = (valueSearch || []).some(
      (s: any) => `${s.type}_${s.id}` === uniqueId || s.uniqueId === uniqueId
    );
    if (alreadyExists) return;

    setValueSearch((prev: any) => [...prev, { ...item, uniqueId }]);

    // clear input after selection (same UX)
    setValues((prev: any) => ({
      ...prev,
      type_id: id,
      search: "",
    }));
    setListingOptions([]);
  };

  const deleteSearch = (item: any) => {
    const filterSearch = (valueSearch || []).filter(
      (item1: any) => item1.uniqueId !== item?.uniqueId
    );
    setValueSearch(filterSearch);

    // also clear search text
    setValues((prev: any) => ({
      ...prev,
      type_id: id,
      search: "",
    }));
  };

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

  // ✅ Search (same as main searchbar): build URL params and navigate
  const onSearch = () => {
    const params = new URLSearchParams();

    // search[] from selected items (slug preferred)
    const searchValues = (valueSearch || [])
      .map((x: any) => x?.slug || x?.name)
      .filter((v: any) => typeof v === "string" && v.trim().length > 0);

    searchValues.forEach((v: string) => params.append("search", v));

    // price
    if (values?.price_min !== undefined && values?.price_min !== null && values?.price_min !== "") {
      params.set("min_price", String(values.price_min));
    }
    if (values?.price_max !== undefined && values?.price_max !== null && values?.price_max !== "") {
      params.set("max_price", String(values.price_max));
    }

    // ✅ CHANGED: property type (code)
    if ((values as any)?.property_type_code) {
      params.set("property_type", String((values as any).property_type_code));
    }

    // bedrooms / bathrooms
    (values?.selected_bedrooms || []).forEach((bed: number | string) => {
      // IMPORTANT: Studio stays "Studio" (not 0)
      const normalized = bed === "7+" ? "7plus" : bed === "Studio" ? "Studio" : String(bed);
      params.append("bedrooms", normalized);
    });

    (values?.selected_bathrooms || []).forEach((bath: number | string) => {
      const normalized = bath === "7+" ? "7plus" : String(bath);
      params.append("bathrooms", normalized);
    });

    // keep state synced too
    setValues((prev: any) => ({ ...prev, type_id: id }));

    const queryString = params.toString();

    const currentPath = location.pathname;

    // keep same page base if already on one of these
    let basePath = "/buy/properties-for-sale";

    if (currentPath.includes("properties-for-rent")) {
      basePath = "/rent/properties-for-rent";
    } else if (currentPath.includes("properties-for-sale")) {
      basePath = "/buy/properties-for-sale";
    } else if (currentPath.includes("new-projects")) {
      basePath = "/new-projects";
    } else {
      // fallback to from if user is on some other route
      if (from === "projects") basePath = "/new-projects";
      else if (from === "rent") basePath = "/rent/properties-for-rent";
      else basePath = "/buy/properties-for-sale";
    }

    navigate(`${basePath}${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="w-full internal_search_bar_area">
      <div className="mx-auto">
        <div className="mx-auto">
          <div className="bg-white change_border shadow-md border border-gray-200 p-2 md:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-2">
            <div className="flex-1">
              <div className="relative">
                <div className="flex flex-wrap items-center w-full min-h-[52px] bg-white border border-gray-200 change_border px-3 py-2 gap-2">
                  <div className="flex-shrink-0 text-gray-400 mt-[2px]">
                    <Icons.IoIosSearch size={16} />
                  </div>

                  <div className="flex flex-wrap items-center flex-1 min-w-0 extra_gap">
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

                {(isInputFocused || (values?.search || "")?.length >= 1) && (
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
                      const selectedIds = (valueSearch || []).map((x: any) => x.uniqueId);
                      const availableOptions = (listingOptions || []).filter(
                        (x: any) => !selectedIds.includes(`${x.type}_${x.id}`)
                      );

                      if (!availableOptions.length) {
                        return (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            {isTypingLoading ? t("Loading...") : t("No results found")}
                          </div>
                        );
                      }

                      return (
                        <div className="property-results">
                          {availableOptions.map((opt: any) => (
                            <div
                              key={`${opt.type}_${opt.id}`}
                              className="w-full py-3 px-4 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200 flex items-center gap-3"
                              onClick={() => handleAddOption(opt)}
                            >
                              <div className="flex-shrink-0">
                                {opt.type === "community" || opt.type === "sub_community" ? (
                                  <Icons.IoLocationOutline size={18} className="text-[#9f8151]" />
                                ) : (
                                  <Icons.IoBusiness size={18} className="text-green-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#094834] capitalize">
                                  {opt?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {opt.type === "community"
                                    ? t("Community")
                                    : opt.type === "sub_community"
                                    ? t("Sub Community")
                                    : t("Property")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
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
                  const selBeds: any[] = values?.selected_bedrooms ?? [];
                  const selBaths: any[] = values?.selected_bathrooms ?? [];

                  const makeBedTitleFromArray = (selected: any[]) => {
                    if (!selected || selected.length === 0) return "";
                    const hasStudio = selected.includes(StudioLabel) || selected.includes(0);
                    const hasSevenPlus = selected.includes("7+");

                    const numericBeds = selected.filter((n: any) => typeof n === "number") as number[];
                    numericBeds.sort((a, b) => a - b);

                    const isContiguous =
                      numericBeds.length <= 1 ||
                      numericBeds.every((v, i) => i === 0 || v === numericBeds[i - 1] + 1);

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

                    if (labels.length === 1 && hasStudio && !numericBeds.length && !hasSevenPlus) {
                      return t("Studio");
                    } else if (labels.length > 0) {
                      return `${labels.join(", ")} ${t("Beds")}`;
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
                      else if (isContiguous)
                        numericLabel = `${numericBaths[0]}-${numericBaths[numericBaths.length - 1]}`;
                      else numericLabel = numericBaths.join(", ");
                      labels.push(numericLabel);
                    }
                    if (hasSevenPlus) labels.push("7+");
                    if (labels.length > 0) return `${labels.join(", ")} ${t("Baths")}`;
                    return t("Baths");
                  };

                  const bedTitle = selBeds.length > 0 ? makeBedTitleFromArray(selBeds) : t("Beds");
                  const bathTitle = selBaths.length > 0 ? makeBathTitleFromArray(selBaths) : "";

                  if (bedTitle && bathTitle) return `${bedTitle}, ${bathTitle}`;
                  return bedTitle || t("Beds");
                })()}
                triggerClass="h-12 md:h-10 px-3 text-gray-700 text-sm hover:bg-gray-100 rounded-xl transition-colors duration-200 flex items-center gap-1 bg-white/90 border border-gray-200 w-full md:w-auto justify-center md:justify-start"
              >
                <div className="w-full p-4 bg-white rounded-xl shadow-lg">
                 <div className="mb-4">
  <p className="py-2 rounded-lg font-semibold text-sm transition-all duration-200 mb-3 text-[#0b4a35]">
    {t("Bedrooms")}
  </p>

  {/* ✅ Mobile: grid | ✅ Desktop: flex-wrap */}
  <div className="grid grid-cols-4 gap-2 md:flex md:flex-wrap">
    <button
      onClick={() =>
        setValues((prev: any) => {
          const current = getCurrentSelectedBeds(prev);
          const exists = current.includes(StudioLabel);

          // ✅ keep Studio, just toggle it (DON'T remove on other clicks)
          const next = exists
            ? current.filter((v: any) => v !== StudioLabel)
            : [...current, StudioLabel];

          return { ...prev, selected_bedrooms: next };
        })
      }
      className={`w-full md:w-auto px-4 py-2 rounded-lg text-sm transition-all duration-200 input_text_badge ${
        (values?.selected_bedrooms || []).includes(StudioLabel) ||
        (values?.selected_bedrooms || []).includes(0)
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

            // ✅ DO NOT filter out Studio here
            const exists = current.includes(num);
            const next = exists
              ? current.filter((v: any) => v !== num)
              : [...current, num];

            return { ...prev, selected_bedrooms: next };
          })
        }
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
      onClick={() =>
        setValues((prev: any) => {
          const current = getCurrentSelectedBeds(prev);

          // ✅ DO NOT filter out Studio here
          const exists = current.includes("7+");
          const next = exists
            ? current.filter((v: any) => v !== "7+")
            : [...current, "7+"];

          return { ...prev, selected_bedrooms: next };
        })
      }
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

                 <div className="mb-4">
  <p className="py-2 rounded-lg font-semibold text-sm transition-all duration-200 mb-3 text-[#0b4a35]">
    {t("Bathrooms")}
  </p>

  {/* ✅ Mobile: grid | ✅ Desktop: flex-wrap */}
  <div className="grid grid-cols-4 gap-2 md:flex md:flex-wrap">
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
            return { ...prev, selected_bathrooms: next };
          })
        }
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
      onClick={() =>
        setValues((prev: any) => {
          const current = prev.selected_bathrooms || [];
          const exists = current.includes("7+");
          const next = exists
            ? current.filter((v: any) => v !== "7+")
            : [...current, "7+"];
          return { ...prev, selected_bathrooms: next };
        })
      }
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

              {/* Type Dropdown (same as main: uses CODE) */}
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
                          setValues((prev: any) => ({
                            ...prev,
                            property_type_id: undefined,
                            property_name: undefined,
                            property_type_code: undefined, // ✅ CHANGED
                          }));
                          setTimeout(() => {
                            const closeEvent = new KeyboardEvent("keydown", { key: "Escape" });
                            document.dispatchEvent(closeEvent);
                          }, 100);
                        }}
                      >
                        {t("All Types")}
                      </p>

                      {propertyTypes?.map((pt: PropertyTypeItem) => (
                        <p
                          key={pt.id}
                          className="input_text_badge cursor-pointer text-sm text-gray-700 py-2 px-3 hover:bg-gray-100 rounded-lg transition-colors duration-200 border-radius"
                          onClick={() => {
                            setValues((prev: any) => ({
                              ...prev,
                              property_type_id: pt.id,
                              property_name: pt.name,
                              property_type_code: pt.code, // ✅ CHANGED
                            }));
                            setTimeout(() => {
                              const closeEvent = new KeyboardEvent("keydown", { key: "Escape" });
                              document.dispatchEvent(closeEvent);
                            }, 100);
                          }}
                        >
                          {pt.name}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </MainDropdown>

              {/* Price Range dropdown (unchanged UI) */}
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
                    <div className="flex-col gap-y-3">
                      <p className="rounded-lg font-semibold text-sm transition-all duration-200 text-[#0b4a35]">
                        {t("Min Price")}
                      </p>
                      <div className="relative">
                        <input
                          type="number"
                          value={values?.price_min || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? undefined : parseInt(e.target.value);
                            setValues((prev: any) => ({ ...prev, price_min: value }));
                          }}
                          placeholder={t("Enter Min Price")}
                          className="text-[#5E5C59] search-input placeholder-14 placeholder-gray-400 input_text w-full px-3 py-2 text-sm md:text-base lg:text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                          min="0"
                        />
                        <button
                          onClick={() => setValues((prev: any) => ({ ...prev, price_min: undefined }))}
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
                            const value = e.target.value === "" ? undefined : parseInt(e.target.value);
                            setValues((prev: any) => ({ ...prev, price_max: value }));
                          }}
                          placeholder={t("Enter Max Price")}
                          className="text-[#5E5C59] search-input placeholder-14 placeholder-gray-400 input_text w-full px-3 py-2 text-sm md:text-base lg:text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                          min="0"
                        />
                        <button
                          onClick={() => setValues((prev: any) => ({ ...prev, price_max: undefined }))}
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

            <button
              onClick={onSearch}
              className="search_btn_styling h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold change_border transition-all duration-[.4s] flex items-center justify-center gap-2"
            >
              <Icons.IoIosSearch size={18} />
              <span className="">{t("Search")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaSearch;
