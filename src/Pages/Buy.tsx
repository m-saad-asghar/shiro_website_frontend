import { LoaderPage } from "@/Components";
import { Helmet } from "react-helmet";
import { ValueContext } from "@/Context/ValueContext";
import useQueryGet from "@/hooks/useQueryGet";
import { AllProperties, Search } from "@/Sections/Buy";
import DevelopersServices from "@/Services/DevelopersServices";
import PropertiesServices from "@/Services/PropertiesServices";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Icons from "@/Constants/Icons";
import { parsePropertyTypeFromUrl } from "@/helpers/propertyTypeHelper";
import { parseUrlParams } from "@/helpers/urlParser";

type ApiStatus = "idle" | "pending" | "success" | "error";

type UrlFilters = {
  search?: string[];
  min_price?: number;
  max_price?: number;
  property_type?: string;
  bedrooms?: Array<string | number>;
  bathrooms?: Array<string | number>;
};

const Buy = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ pagination
  const [page, setPage] = useState<number>(1);
  const PER_PAGE = 6;

  // Type ID is fixed for Buy page
  const id = "1";

  const { data: filter } = useQueryGet(["filter"], PropertiesServices.filters);
  const { data: filterDeveloper } = useQueryGet(
    ["filterDeveloper"],
    DevelopersServices.developer
  );

  const {
    values,
    setValues,
    valueSearch,
    setValueSearch,
    searchId,
    setSearchId,
  } = useContext(ValueContext);

  // ✅ local state for new endpoint response
  const [apiStatus, setApiStatus] = useState<ApiStatus>("idle");
  const [apiResponse, setApiResponse] = useState<any>(null);

  // Navigation search state (kept as-is)
  const searchState = location.state as {
    property_ids?: number[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    valueSearch?: any[];
    search?: string;
    property_name?: string;
    property_type_id?: number;
    price_min?: number;
    price_max?: number;
    bedroom_min?: number;
    bedroom_max?: number;
    area_min?: number;
    area_max?: number;
    developer_id?: number;
    developer_name?: string;
    sort?: string;
    sort_name?: string;
    type_id?: number;
    type_name?: string;
    region_name?: string;
    region_names?: string[];
  } | null;

  // ✅ NEW: read filters from URL query string and return ONLY available params
  const getFiltersFromUrl = (): UrlFilters => {
    const params = new URLSearchParams(location.search);

    const toNumOrStr = (v: string): string | number => {
      const s = v.trim();
      if (!s) return "";
      return /^\d+$/.test(s) ? Number(s) : s;
    };

    const filters: UrlFilters = {};

    // repeated params: ?search=a&search=b
    const searchArr = params
      .getAll("search")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
    if (searchArr.length > 0) filters.search = searchArr;

    const minPriceRaw = params.get("min_price");
    if (minPriceRaw !== null && minPriceRaw.trim() !== "") {
      const n = Number(minPriceRaw);
      if (!Number.isNaN(n)) filters.min_price = n;
    }

    const maxPriceRaw = params.get("max_price");
    if (maxPriceRaw !== null && maxPriceRaw.trim() !== "") {
      const n = Number(maxPriceRaw);
      if (!Number.isNaN(n)) filters.max_price = n;
    }

    const propertyType = params.get("property_type");
    if (propertyType && propertyType.trim() !== "") {
      filters.property_type = propertyType.trim();
    }

    const bedroomsArr = params
      .getAll("bedrooms")
      .map((v) => toNumOrStr(v))
      .filter((v) => v !== "" && v !== null && v !== undefined);
    if (bedroomsArr.length > 0) filters.bedrooms = bedroomsArr as any;

    const bathroomsArr = params
      .getAll("bathrooms")
      .map((v) => toNumOrStr(v))
      .filter((v) => v !== "" && v !== null && v !== undefined);
    if (bathroomsArr.length > 0) filters.bathrooms = bathroomsArr as any;

    return filters;
  };

  // ✅ ONE function: POST -> show_sale_properties (now includes URL filters)
  const fetchSaleProperties = async (pageToLoad: number) => {
    try {
      const urlFilters = getFiltersFromUrl();

      console.log("[Buy] About to send POST request to show_sale_properties", {
        page: pageToLoad,
        per_page: PER_PAGE,
        ...urlFilters,
      });

      setApiStatus("pending");

      const base = (import.meta as any).env?.VITE_API_URL || "";
      // IMPORTANT: if your backend is underscore, change to /show_sale_properties
      const url = `${base.replace(/\/$/, "")}/show_sale_properties`;

      const payload: any = {
        page: pageToLoad,
        per_page: PER_PAGE,
        ...urlFilters, // ✅ ONLY available params are included
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      console.log("[Buy] Received response from show_sale_properties", json);

      setApiResponse(json);
      setApiStatus("success");
    } catch (error) {
      console.log("[Buy] Request to show_sale_properties failed", error);
      setApiStatus("error");
    }
  };

  // ✅ Call API when page changes OR URL query changes
  useEffect(() => {
    fetchSaleProperties(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, location.search]);

  // ✅ URL parsing effect (now ensures values is ALWAYS an object)
  useEffect(() => {
    if (id && filter) {
      const urlParams =
        parseUrlParams(
          location.pathname,
          searchState,
          filter,
          filterDeveloper,
          id
        ) || {};

      const segments = location.pathname.split("/");
      if (segments.length >= 4) {
        const propertyTypeSegment = segments[3];
        if (propertyTypeSegment && filter?.property_types) {
          const propertyType = parsePropertyTypeFromUrl(
            propertyTypeSegment,
            filter.property_types
          );
          if (propertyType) {
            urlParams.property_type_id = propertyType.id;
            urlParams.property_name = propertyType.name;
          }
        }
      }

      // ✅ IMPORTANT: values must never be undefined
      setValues({ ...(urlParams || {}), is_sale: true });

      // Restore valueSearch and searchId from searchState if coming from MultiSearch
      if (searchState?.valueSearch && searchState?.valueSearch.length > 0) {
        setValueSearch(searchState.valueSearch);
        setSearchId(searchState.property_ids || []);
      } else if (searchState?.property_ids && searchState.property_ids.length > 0) {
        setSearchId(searchState.property_ids);
      } else {
        setValueSearch([]);
        setSearchId([]);
      }

      // Reset to page 1 when URL filters change
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.pathname, location.search, filter]);

  // ✅ Adapt API response to what <AllProperties /> expects
  const adaptedData = {
    properties: apiResponse?.data?.sale_listings || [],
    pagination: apiResponse?.pagination || null,
  };

  // ✅ Skeleton state
  if (apiStatus === "pending" && !apiResponse) {
    return (
      <div className="w-full min-h-screen">
        <div className="pt-[120px] md:pt-[140px] lg:pt-[127.2px]" />
        <div className="custom_container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Buy Properties in Dubai | Luxury Apartments & Villas for Sale</title>
        <meta
          name="description"
          content="Find your dream property in Dubai. Browse luxury apartments, villas, and townhouses for sale. Exclusive listings from Shiro Real Estate with expert guidance."
        />
      </Helmet>

      <div className="w-full">
        {apiStatus === "error" ? (
          <LoaderPage message="Loading properties..." size="lg" />
        ) : (
          <>
            {/* ✅ Search Section */}
           <div className="custom_container">
             <Search
              from="buy"
              options={apiResponse}
              item={filter}
              filterDeveloper={filterDeveloper}
              values={values ?? {}} // ✅ prevents Search.tsx crash
              valueSearch={valueSearch ?? []}
              setValueSearch={setValueSearch}
              setSearchId={setSearchId}
              searchId={searchId ?? []}
              setValues={setValues}
              onClick={() => {
                // Reload page 1
                setPage(1);
                fetchSaleProperties(1);
              }}
            />
           </div>

            {/* No properties */}
            {adaptedData?.properties?.length === 0 ? (
              <div className="custom_container mx-auto px-4 py-16">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icons.IoIosSearch size={48} className="text-gray-400" />
                  </div>

                  <h3 className="font-semibold text-primary text-2xl">
                    {t("No properties found")}
                  </h3>

                  <p className="text-[16px] text-primary font-semibold mb-3 !text-[#9f8151] font-[16px]">
                    {t("Try adjusting your search criteria or browse all properties")}
                  </p>

                  {/* <button ...>Clear Filters</button> */}
                </div>
              </div>
            ) : (
              <div className="custom_container mx-auto px-4 py-8 property_container_styling">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-[#9f8151]">
                      {t("Properties For Sale")}
                    </h2>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {adaptedData?.pagination?.total || 0} {t("Listings")}
                    </span>
                  </div>
                </div>

                <AllProperties
                  item={adaptedData}
                  status={apiStatus}
                  pagination={adaptedData?.pagination}
                  viewMode={"list"}
                  page={page}
                  setPage={setPage}
                  display_name="callback-form-via-sales-page-of-website"
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Buy;
