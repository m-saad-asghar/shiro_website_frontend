import { LoaderPage, MainDropdown } from "@/Components";
import { Helmet } from "react-helmet";
import { ValueContext } from "@/Context/ValueContext";
import useQueryGet from "@/hooks/useQueryGet";
import UseQueryPost from "@/hooks/useQueryPost";
import {
  AllProperties,
  AvailableOptions,
  OurTeam,
  Search,
} from "@/Sections/Buy";
import DevelopersServices from "@/Services/DevelopersServices";
import PropertiesServices from "@/Services/PropertiesServices";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Icons from "@/Constants/Icons";
import { parsePropertyTypeFromUrl } from "@/helpers/propertyTypeHelper";
import { parseUrlParams } from "@/helpers/urlParser";
import {
  createMostRecentHandler,
  createHighestPriceHandler,
  createLowestPriceHandler,
} from "@/helpers/sortHelpers";

const Rent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Get view mode from localStorage or default to "grid"
  const getInitialViewMode = (): "grid" | "list" => {
    const savedViewMode = localStorage.getItem("rentViewMode");
    return (savedViewMode as "grid" | "list") || "grid";
  };

  const [viewMode, setViewMode] = useState<"grid" | "list">(getInitialViewMode);
  const [page, setPage] = useState<number>(1);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode("list");
    // Save to localStorage
    localStorage.setItem("rentViewMode", "list");
    // Close dropdown after selection
    setTimeout(() => {
      const closeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
      });
      document.dispatchEvent(closeEvent);
    }, 100);
  };

  const location = useLocation();
  // Type ID is fixed for Rent page
  const id = "2";
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

  // Get search state from navigation
  const searchState = location.state as {
    property_ids?: number[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    valueSearch?: any[]; // Array of selected search items with full object data
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

  const { mutateAsync, data, status } = UseQueryPost(
    ["search", "rent", id || ""],
    PropertiesServices.Search
  );

  // Remove auto-search - only search when user clicks search button or applies filters
  // This useEffect is commented out to prevent automatic search on typing

  // Call API when page changes
  useEffect(() => {
    if (values && values.type_id === id) {
      mutateAsync({
        ...values,
        is_sale: true,
        page: page,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Clean up values when page changes
  useEffect(() => {
    if (id && filter) {
      // Use helper to parse URL parameters (eliminates code duplication)
      const urlParams = parseUrlParams(
        location.pathname,
        searchState,
        filter,
        filterDeveloper,
        id
      );

      // Parse property type from URL segments - using English slug helper
      const segments = location.pathname.split("/");
      if (segments.length >= 4) {
        const propertyTypeSegment = segments[3]; // After /rent/properties-for-rent/

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

      // Add Rent-specific flag
      setValues({ ...urlParams, is_sale: true });

      // Restore valueSearch and searchId from searchState if coming from MultiSearch
      if (searchState?.valueSearch && searchState?.valueSearch.length > 0) {
        setValueSearch(searchState.valueSearch);
        setSearchId(searchState.property_ids || []);
      } else if (
        searchState?.property_ids &&
        searchState.property_ids.length > 0
      ) {
        // If we only have property_ids, keep existing valueSearch if it matches
        setSearchId(searchState.property_ids);
      } else {
        // Clear only if not coming from search navigation
        setValueSearch([]);
        setSearchId([]);
      }

      setPage(1); // Reset page to 1 when filters change

      // Call API with parsed values
      mutateAsync({ ...urlParams, is_sale: true, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.pathname, filter]);

  // Remove this useEffect to prevent double API calls
  // useEffect(() => {
  //   // Only call API if values exist and we're not in the cleanup phase
  //   if (values && Object.keys(values).length > 1 && values.type_id === id) {
  //     mutateAsync({
  //       type_id: id,
  //       ...values,
  //     });
  //   }
  // }, [values?.sort, id]);

  // Show skeleton loading state
  if (status === "pending" || !data) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
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
        <title>Rent Properties in Dubai | Apartments & Villas for Rent</title>
        <meta
          name="description"
          content="Discover rental properties in Dubai. Browse furnished and unfurnished apartments, villas, and townhouses for rent. Find your perfect home with Shiro Real Estate."
        />
      </Helmet>
      <div className="">
        {status == "error" ? (
          <LoaderPage message="Loading properties..." size="lg" />
        ) : (
          <>
            <Search
              from="rent"
              item={filter}
              options={data}
              filterDeveloper={filterDeveloper}
              values={values}
              setValues={setValues}
              valueSearch={valueSearch}
              setValueSearch={setValueSearch}
              setSearchId={setSearchId}
              searchId={searchId}
              onClick={mutateAsync}
            />
            {/* Properties Section */}
            {data?.data?.data?.properties.length == 0 ? (
              <div className="custom_container mx-auto px-4 py-16">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icons.IoIosSearch size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t("No properties found")}
                  </h3>
                  <p className="text-gray-600 mb-8">
                    {t(
                      "Try adjusting your search criteria or browse all properties"
                    )}
                  </p>
                  <button
                    onClick={() => {
                      const cleanValues = {
                        type_id: id,
                        is_sale: true,
                        search: "",
                        property_type_id: undefined,
                        property_name: undefined,
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
                      };
                      setValues(cleanValues);
                      setValueSearch([]);
                      setSearchId([]);
                      mutateAsync(cleanValues);
                      navigate(`/rent/properties-for-rent`);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300"
                  >
                    <Icons.IoIosArrowBack size={20} />
                    {t("Clear Filters")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="custom_container mx-auto px-4 py-8 property_container_styling">
                {/* View Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  {/* Results Info */}
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-[#9f8151]">
                      {t("Properties For Rent")}
                    </h2>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {data?.data?.data?.properties?.length || 0} {t("Listings")}
                    </span>
                  </div>

                  {/* View Mode Toggle & Sort */}
                  <div className="flex items-center gap-4">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        {t("Sort")}:
                      </span>
                      <MainDropdown
                        title={
                          values?.sort_name
                            ? values?.sort_name
                            : t("Most Recent")
                        }
                        triggerClass="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all duration-300"
                      >
                        <div className="p-2 w-40">
                          <button
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white rounded-lg transition-colors duration-200"
                            onClick={createMostRecentHandler(
                              values,
                              id,
                              { is_sale: true },
                              setValues,
                              setPage,
                              mutateAsync
                            )}
                          >
                            {t("Most Recent")}
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white rounded-lg transition-colors duration-200"
                            onClick={createHighestPriceHandler(
                              values,
                              id,
                              { is_sale: true },
                              setValues,
                              setPage,
                              mutateAsync
                            )}
                          >
                            {t("Highest price")}
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white rounded-lg transition-colors duration-200"
                            onClick={createLowestPriceHandler(
                              values,
                              id,
                              { is_sale: true },
                              setValues,
                              setPage,
                              mutateAsync
                            )}
                          >
                            {t("Lowest price")}
                          </button>
                        </div>
                      </MainDropdown>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        {t("View as")}:
                      </span>
                      <MainDropdown
                        title={viewMode === "grid" ? t("Grid") : t("List")}
                        triggerClass="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all duration-300"
                      >
                        <div className="p-2 w-32">
                          <button
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                              viewMode === "grid"
                                ? "bg-primary text-white"
                                : "text-gray-700 hover:bg-primary hover:text-white"
                            }`}
                            onClick={() => handleViewModeChange("grid")}
                          >
                            <Icons.IoHomeOutline size={16} />
                            {t("Grid")}
                          </button>
                          <button
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                              viewMode === "list"
                                ? "bg-primary text-white"
                                : "text-gray-700 hover:bg-primary hover:text-white"
                            }`}
                            onClick={() => handleViewModeChange("list")}
                          >
                            <Icons.IoPerson size={16} />
                            {t("List")}
                          </button>
                        </div>
                      </MainDropdown>
                    </div>
                  </div>
                </div>

                {/* Properties Grid/List */}
                <AllProperties
                  item={data?.data?.data}
                  status={status}
                  pagination={data?.data?.data?.pagination}
                  viewMode={"list"}
                  page={page}
                  setPage={setPage}
                />
              </div>
            )}

            {/* <OurTeam />
            <AvailableOptions /> */}
          </>
        )}
      </div>
    </>
  );
};

export default Rent;
