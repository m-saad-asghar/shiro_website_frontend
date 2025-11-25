import { useLocation } from "react-router-dom";

/**
 * Custom hook to extract search state from navigation
 * Use this in your results pages (Buy, Rent, Projects) to get the search parameters
 */
export const useSearchState = () => {
  const location = useLocation();

  // Get search state from navigation
  const searchState = location.state as {
    property_ids?: number[];
    valueSearch?: any[];
    search?: string;
    property_name?: string;
    property_type_id?: number;
    price_min?: number;
    price_max?: number;
    bedroom_min?: number;
    bedroom_max?: number;
    area?: number;
    developer_id?: number;
    developer_name?: string;
    sort?: string;
    sort_name?: string;
    type_id?: number;
    type_name?: string;
    region_name?: string;
    region_names?: string[];
  } | null;

  // Debug: Log the search state

  return {
    searchState,
    hasSearchState: !!searchState,
    // Helper functions
    getPropertyIds: () => searchState?.property_ids || [],
    getSearchQuery: () => searchState?.search || "",
    getFilters: () => ({
      property_name: searchState?.property_name,
      property_type_id: searchState?.property_type_id,
      price_min: searchState?.price_min,
      price_max: searchState?.price_max,
      bedroom_min: searchState?.bedroom_min,
      bedroom_max: searchState?.bedroom_max,
      area: searchState?.area,
      developer_id: searchState?.developer_id,
      developer_name: searchState?.developer_name,
      sort: searchState?.sort,
      sort_name: searchState?.sort_name,
    }),
    getTypeInfo: () => ({
      type_id: searchState?.type_id,
      type_name: searchState?.type_name,
    }),
  };
};
