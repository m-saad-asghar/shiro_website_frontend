/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * URL Parser Helper
 *
 * This helper eliminates code duplication across Buy, Rent, and Projects pages
 * by extracting common URL parsing logic into reusable functions.
 */

/**
 * Interface for URL parameters
 */
export interface UrlParams {
  type_id: string | number;
  search?: string;
  property_type_id?: number;
  property_name?: string;
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
  region_name?: string;
  region_names?: string[];
  property_ids?: number[];
  is_sale?: boolean;
  is_finish?: boolean;
}

/**
 * Parse bedrooms from URL segments
 * Handles patterns like: "with-1-to-3-bedrooms", "more-than-2-bedrooms", "under-4-bedrooms"
 */
export const parseBedroomsFromUrl = (
  segments: string[]
): {
  bedroom_min?: number;
  bedroom_max?: number;
} => {
  const result: { bedroom_min?: number; bedroom_max?: number } = {};

  // Pattern: with-X-to-Y-bedrooms
  const withBedroom = segments.find(
    (seg) =>
      seg.includes("with-") && seg.includes("-to-") && seg.includes("-bedrooms")
  );

  if (withBedroom) {
    const match = withBedroom.match(/with-(\d+)-to-(\d+)-bedrooms/);
    if (match) {
      result.bedroom_min = parseInt(match[1]);
      result.bedroom_max = parseInt(match[2]);
    }
    return result;
  }

  // Pattern: more-than-X-bedrooms
  const moreThanBedroom = segments.find(
    (seg) => seg.includes("more-than-") && seg.includes("-bedrooms")
  );
  if (moreThanBedroom) {
    const match = moreThanBedroom.match(/more-than-(\d+)-bedrooms/);
    if (match) {
      result.bedroom_min = parseInt(match[1]);
    }
  }

  // Pattern: under-X-bedrooms
  const underBedroom = segments.find(
    (seg) => seg.includes("under-") && seg.includes("-bedrooms")
  );
  if (underBedroom) {
    const match = underBedroom.match(/under-(\d+)-bedrooms/);
    if (match) {
      result.bedroom_max = parseInt(match[1]);
    }
  }

  return result;
};

/**
 * Parse price range from URL segments
 * Handles patterns like: "between-100000-500000", "above-200000", "below-1000000"
 */
export const parsePriceFromUrl = (
  segments: string[]
): {
  price_min?: number;
  price_max?: number;
} => {
  const result: { price_min?: number; price_max?: number } = {};

  // Pattern: between-X-Y
  const priceSegment = segments.find(
    (seg) => seg.includes("between-") && seg.match(/between-\d+-\d+/)
  );

  if (priceSegment) {
    const match = priceSegment.match(/between-(\d+)-(\d+)/);
    if (match) {
      result.price_min = parseInt(match[1]);
      result.price_max = parseInt(match[2]);
    }
    return result;
  }

  // Pattern: above-X
  const abovePrice = segments.find((seg) => seg.includes("above-"));
  if (abovePrice) {
    const match = abovePrice.match(/above-(\d+)/);
    if (match) {
      result.price_min = parseInt(match[1]);
    }
  }

  // Pattern: below-X
  const belowPrice = segments.find((seg) => seg.includes("below-"));
  if (belowPrice) {
    const match = belowPrice.match(/below-(\d+)/);
    if (match) {
      result.price_max = parseInt(match[1]);
    }
  }

  return result;
};

/**
 * Parse area from URL segments
 * Handles patterns like: "area-between-500-2000-sqft", "area-more-than-1000-sqft", "area-under-3000-sqft"
 */
export const parseAreaFromUrl = (
  segments: string[]
): {
  area_min?: number;
  area_max?: number;
} => {
  const result: { area_min?: number; area_max?: number } = {};

  // Pattern: area-between-X-Y-sqft
  const areaSegmentBetween = segments.find(
    (seg) => seg.includes("area-between-") && seg.includes("-sqft")
  );

  if (areaSegmentBetween) {
    const match = areaSegmentBetween.match(/area-between-(\d+)-(\d+)-sqft/);
    if (match) {
      result.area_min = parseInt(match[1]);
      result.area_max = parseInt(match[2]);
    }
    return result;
  }

  // Pattern: area-more-than-X-sqft
  const areaSegmentMin = segments.find(
    (seg) => seg.includes("area-more-than-") && seg.includes("-sqft")
  );
  if (areaSegmentMin) {
    const match = areaSegmentMin.match(/area-more-than-(\d+)-sqft/);
    if (match) {
      result.area_min = parseInt(match[1]);
    }
  }

  // Pattern: area-under-X-sqft
  const areaSegmentMax = segments.find(
    (seg) => seg.includes("area-under-") && seg.includes("-sqft")
  );
  if (areaSegmentMax) {
    const match = areaSegmentMax.match(/area-under-(\d+)-sqft/);
    if (match) {
      result.area_max = parseInt(match[1]);
    }
  }

  return result;
};

/**
 * Parse developer from URL segments
 * Handles pattern: "developed-by-emaar-properties"
 */
export const parseDeveloperFromUrl = (
  segments: string[],
  filterDeveloper: any
): {
  developer_id?: number;
  developer_name?: string;
} => {
  const result: { developer_id?: number; developer_name?: string } = {};

  const developerSegment = segments.find(
    (seg) => seg.includes("developed-by-") && seg.includes("-properties")
  );

  if (developerSegment && filterDeveloper?.developers) {
    const match = developerSegment.match(/developed-by-(.+)-properties/);
    if (match) {
      // For Projects page: Replace hyphens with spaces
      // For Buy/Rent pages: Use as-is
      const developerNameFromUrl = match[1];

      // Try both formats: with hyphens and with spaces
      let developer = filterDeveloper.developers.find(
        (dev: any) =>
          dev.name.toLowerCase() === developerNameFromUrl.toLowerCase()
      );

      // If not found, try replacing hyphens with spaces
      if (!developer) {
        const developerNameWithSpaces = developerNameFromUrl.replace(/-/g, " ");
        developer = filterDeveloper.developers.find(
          (dev: any) =>
            dev.name.toLowerCase() === developerNameWithSpaces.toLowerCase()
        );
      }

      if (developer) {
        result.developer_id = developer.id;
        result.developer_name = developer.name;
      }
    }
  }

  return result;
};

/**
 * Main URL parser function
 * Combines all parsing functions and returns complete URL parameters
 *
 * @param pathname - Current location pathname
 * @param searchState - State passed from navigation
 * @param _filter - Filter data from API (reserved for future use)
 * @param filterDeveloper - Developer filter data from API
 * @param typeId - Type ID for the page (1: Buy, 2: Rent, 4: Projects)
 * @returns Complete URL parameters object
 */
export const parseUrlParams = (
  pathname: string,
  searchState: any,
  _filter: any,
  filterDeveloper: any,
  typeId: string | number
): UrlParams => {
  const segments = pathname.split("/");

  // Base URL params from searchState
  const urlParams: UrlParams = {
    type_id: typeId,
    search: searchState?.search || "",
    property_type_id: searchState?.property_type_id,
    property_name: searchState?.property_name,
    price_min: searchState?.price_min,
    price_max: searchState?.price_max,
    bedroom_min: searchState?.bedroom_min,
    bedroom_max: searchState?.bedroom_max,
    area_min: searchState?.area_min,
    area_max: searchState?.area_max,
    developer_id: searchState?.developer_id,
    developer_name: searchState?.developer_name,
    sort: searchState?.sort,
    sort_name: searchState?.sort_name,
    region_name: searchState?.region_name,
    region_names: searchState?.region_names,
    // Add property_ids if they exist
    ...(searchState?.property_ids &&
      searchState.property_ids.length > 0 && {
        property_ids: searchState.property_ids,
      }),
  };

  // Parse bedrooms from URL
  const bedrooms = parseBedroomsFromUrl(segments);
  if (bedrooms.bedroom_min !== undefined) {
    urlParams.bedroom_min = bedrooms.bedroom_min;
  }
  if (bedrooms.bedroom_max !== undefined) {
    urlParams.bedroom_max = bedrooms.bedroom_max;
  }

  // Parse price from URL
  const price = parsePriceFromUrl(segments);
  if (price.price_min !== undefined) {
    urlParams.price_min = price.price_min;
  }
  if (price.price_max !== undefined) {
    urlParams.price_max = price.price_max;
  }

  // Parse area from URL
  const area = parseAreaFromUrl(segments);
  if (area.area_min !== undefined) {
    urlParams.area_min = area.area_min;
  }
  if (area.area_max !== undefined) {
    urlParams.area_max = area.area_max;
  }

  // Parse developer from URL
  const developer = parseDeveloperFromUrl(segments, filterDeveloper);
  if (developer.developer_id !== undefined) {
    urlParams.developer_id = developer.developer_id;
    urlParams.developer_name = developer.developer_name;
  }

  return urlParams;
};
