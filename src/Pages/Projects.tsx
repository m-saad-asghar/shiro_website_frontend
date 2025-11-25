import { ValueContext } from "@/Context/ValueContext";
import { Helmet } from "react-helmet";
import useQueryGet from "@/hooks/useQueryGet";
import UseQueryPost from "@/hooks/useQueryPost";
import { AvailableOptions, OurTeam, Search } from "@/Sections/Buy";
import { AllProjects } from "@/Sections/Projects";
import { ConentProjects, ContentBottom } from "@/Sections/Projects";
import DevelopersServices from "@/Services/DevelopersServices";
import PropertiesServices from "@/Services/PropertiesServices";
import SingleDeveloperServices from "@/Services/SingleDeveloperServices";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Icons from "@/Constants/Icons";
import { MainDropdown } from "@/Components";
import { FormBox } from "@/Components/Buy/AllProperties";
import { parseUrlParams } from "@/helpers/urlParser";
import {
  createDefaultHandler,
  createHighestPriceWithSearchHandler,
  createLowestPriceWithSearchHandler,
} from "@/helpers/sortHelpers";

const Projects = () => {
  const { t } = useTranslation();

  // Get view mode from localStorage or default to "grid"
  const getInitialViewMode = (): "grid" | "list" => {
    const savedViewMode = localStorage.getItem("projectsViewMode");
    return (savedViewMode as "grid" | "list") || "grid";
  };

  const [viewMode, setViewMode] = useState<"grid" | "list">(getInitialViewMode);
  const [page, setPage] = useState<number>(1);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    // Save to localStorage
    localStorage.setItem("projectsViewMode", mode);
    // Close dropdown after selection
    setTimeout(() => {
      const closeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
      });
      document.dispatchEvent(closeEvent);
    }, 100);
  };

  const location = useLocation();
  // Type ID is fixed for Projects page
  const id = "4";
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
    ["search", "projects", id || ""],
    PropertiesServices.Search
  );

  // Wrapper function to always add project-specific filters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = (searchValues: Record<string, any>) => {
    const projectFilters = {
      ...searchValues,
      type_id: 4, // Type ID for Off-plan projects
      is_finish: false, // Always filter for unfinished properties (projects)
      // Removed is_sale filter as projects might not have this flag set
    };
    return mutateAsync(projectFilters);
  };

  // Remove auto-search - only search when user clicks search button or applies filters
  // This useEffect is commented out to prevent automatic search on typing

  // Call API when page changes
  useEffect(() => {
    if (values && values.type_id === 4) {
      handleSearch({
        ...values,
        page: page,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Clean up values when page changes
  useEffect(() => {
    if (filter) {
      // Use helper to parse URL parameters (eliminates code duplication)
      const urlParams = parseUrlParams(
        location.pathname,
        searchState,
        filter,
        filterDeveloper,
        4 // Type ID for Projects
      );

      // Add Projects-specific filters (off-plan properties)
      urlParams.type_id = 4; // Type ID for Off-plan projects
      urlParams.is_finish = false; // Projects are typically unfinished

      setValues(urlParams);

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

      // Call API with parsed values and ensure project filters are included
      mutateAsync({
        ...urlParams,
        type_id: 4, // Type ID for Off-plan projects
        is_finish: false, // Ensure project filters are always included
        page: 1,
      });
    }
  }, [
    location.pathname,
    filter,
    filterDeveloper,
    mutateAsync,
    searchState,
    setValues,
    setValueSearch,
    setSearchId,
  ]);

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

  const { data: singleDeveloper } = useQueryGet(["singleDeveloper"], () =>
    SingleDeveloperServices.singleDeveloper(values?.developer_id)
  );

  // Debug: Log the API response

  // Show skeleton loading state
  if (status === "pending" || !data) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="pt-[120px] md:pt-[140px] lg:pt-[127.2px]" />
        <div className="container mx-auto px-4 py-8">
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
        <title>Off-Plan Projects in Dubai | New Development Properties</title>
        <meta
          name="description"
          content="Explore off-plan projects and new developments in Dubai. Invest in luxury properties before completion with flexible payment plans from Shiro Real Estate."
        />
      </Helmet>
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        <>
          <Search
            from="projects"
            item={filter}
            options={data}
            filterDeveloper={filterDeveloper}
            values={values}
            setValues={setValues}
            valueSearch={valueSearch}
            setValueSearch={setValueSearch}
            setSearchId={setSearchId}
            searchId={searchId}
            onClick={handleSearch}
          />

          {/* Removed HeaderProperties to avoid duplicate breadcrumb and sort dropdown */}

          {singleDeveloper && (
            <ConentProjects item={singleDeveloper?.developer} />
          )}

          {data?.data?.data?.properties?.length === 0 ? (
            <div className="container py-20">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icons.IoSearchOutline className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t("No Properties Found")}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {t(
                    "We couldn't find any properties matching your criteria. Try adjusting your filters."
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="container pb-[44px] md:pb-[64px] lg:pb-[80px] pt-[20px]">
              <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_.4fr] gap-[32px]">
                <div className="w-full">
                  {/* Controls Section */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      {/* Sort Dropdown */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                          {t("Sort by")}:
                        </span>
                        <MainDropdown
                          title={values?.sort_name || t("Default")}
                          triggerClass="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all duration-300"
                        >
                          <div className="p-2 w-40">
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                              onClick={createDefaultHandler(
                                values,
                                4,
                                {},
                                setValues,
                                handleSearch
                              )}
                            >
                              {t("Default")}
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                              onClick={createHighestPriceWithSearchHandler(
                                values,
                                4,
                                {},
                                setValues,
                                handleSearch
                              )}
                            >
                              {t("Highest price")}
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#9f8151] hover:text-white rounded-lg transition-all duration-[.4s]"
                              onClick={createLowestPriceWithSearchHandler(
                                values,
                                4,
                                {},
                                setValues,
                                handleSearch
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

                    {/* Results Count */}
                    <div className="text-sm text-gray-600">
                      {data?.data?.data?.properties?.length || 0}{" "}
                      {t("properties found")}
                    </div>
                  </div>

                  {/* Properties Grid/List */}
                  <AllProjects
                    item={data?.data?.data}
                    status={status}
                    pagination={data?.data?.data?.pagination}
                    viewMode={viewMode}
                    page={page}
                    setPage={setPage}
                  />
                </div>
                <div>
                  <FormBox />
                </div>
              </div>
            </div>
          )}

          <OurTeam />
          {singleDeveloper ? (
            <ContentBottom item={singleDeveloper?.developer} />
          ) : (
            <AvailableOptions />
          )}
        </>
      </div>
    </>
  );
};

export default Projects;
