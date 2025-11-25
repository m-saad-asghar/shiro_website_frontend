import { useEffect } from "react";
import { useSearchState } from "@/helpers/useSearchState";
import PropertiesServices from "@/Services/PropertiesServices";
import UseQueryPost from "@/hooks/useQueryPost";

/**
 * Example of how to use the search state in your results pages
 * Replace your existing Buy, Rent, or Projects components with this pattern
 */
const SearchResultsExample = () => {
  const {
    searchState,
    hasSearchState,
    getPropertyIds,
    getSearchQuery,
    getFilters,
    getTypeInfo,
  } = useSearchState();

  // Get API mutation
  const { mutateAsync, data } = UseQueryPost(
    ["search-results"],
    PropertiesServices.Search // or your specific API endpoint
  );

  useEffect(() => {
    if (hasSearchState) {
      // Prepare search parameters
      const searchParams = {
        // Include property_ids if they exist (this is the key part!)
        ...(getPropertyIds().length > 0 && { property_ids: getPropertyIds() }),

        // Include search query if it exists
        ...(getSearchQuery() && { search: getSearchQuery() }),

        // Include all other filters
        ...getFilters(),

        // Include type information
        ...getTypeInfo(),
      };

      // Call API with the search parameters
      mutateAsync(searchParams);
    }
  }, [hasSearchState, mutateAsync]);

  if (!data) {
    return <div>Loading search results...</div>;
  }

  return (
    <div>
      <h1>Search Results</h1>

      {/* Display search state info for debugging */}
      {hasSearchState && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h3>Search State:</h3>
          <pre>{JSON.stringify(searchState, null, 2)}</pre>
        </div>
      )}

      {/* Display results */}
      <div>
        {data?.data?.properties?.map((property: any) => (
          <div key={property.id} className="border p-4 mb-2">
            <h3>{property.title}</h3>
            <p>{property.description}</p>
            {/* Add more property details */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsExample;
