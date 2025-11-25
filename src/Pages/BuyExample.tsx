import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSearchState } from "@/helpers/useSearchState";
import PropertiesServices from "@/Services/PropertiesServices";
import UseQueryPost from "@/hooks/useQueryPost";

/**
 * Example implementation for Buy page using search state
 * Replace your existing Buy.tsx with this pattern
 */
const BuyExample = () => {
  const {
    searchState: _searchState,
    hasSearchState,
    getPropertyIds,
    getSearchQuery,
    getFilters,
    getTypeInfo,
  } = useSearchState();

  // Get API mutation
  const { mutateAsync, data } = UseQueryPost(
    ["buy-properties"],
    PropertiesServices.AllProperties // or your specific API endpoint
  );

  // Always call API when component mounts or search state changes
  useEffect(() => {
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
  }, [hasSearchState, mutateAsync]);

  if (!data) {
    return <div>Loading properties...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Property Search Example | Shiro Real Estate Dubai</title>
        <meta
          name="description"
          content="Example implementation of property search functionality for Shiro Real Estate Dubai."
        />
      </Helmet>
      <div>
        <h1>Properties for Sale</h1>

        {/* Display search state info for debugging */}
        {hasSearchState && (
          <div className="mb-4 p-4 bg-blue-100 rounded">
            <h3>Search State Debug:</h3>
            <p>
              <strong>Property IDs:</strong> {JSON.stringify(getPropertyIds())}
            </p>
            <p>
              <strong>Search Query:</strong> {getSearchQuery()}
            </p>
            <p>
              <strong>Filters:</strong> {JSON.stringify(getFilters())}
            </p>
            <p>
              <strong>Type Info:</strong> {JSON.stringify(getTypeInfo())}
            </p>
          </div>
        )}

        {/* Display results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data?.properties?.map((property: any) => (
            <div key={property.id} className="border p-4 rounded-lg shadow">
              <h3 className="font-bold">{property.title}</h3>
              <p className="text-gray-600">{property.description}</p>
              <p className="text-green-600 font-semibold">${property.price}</p>
              {/* Add more property details */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BuyExample;
