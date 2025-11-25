/**
 * Property Type Helper
 *
 * This helper ensures that URLs always use English slugs regardless of the current language.
 * The UI will display translated names, but URLs remain consistent.
 */

// Mapping between property type names (Arabic/English) to English slugs
const propertyTypeMapping: Record<string, string> = {
  // Villa variants
  villa: "villa",
  villas: "villa",
  فيلا: "villa",
  فلل: "villa",

  // Apartment variants
  apartment: "apartment",
  apartments: "apartment",
  شقة: "apartment",
  شقق: "apartment",

  // Townhouse variants
  townhouse: "townhouse",
  townhouses: "townhouse",
  "تاون هاوس": "townhouse",
  "بيت ريفي": "townhouse",

  // Penthouse variants
  penthouse: "penthouse",
  penthouses: "penthouse",
  بنتهاوس: "penthouse",

  // Studio variants
  studio: "studio",
  studios: "studio",
  ستوديو: "studio",

  // Duplex variants
  duplex: "duplex",
  duplexes: "duplex",
  دوبلكس: "duplex",

  // Residential (general category)
  residential: "residential",
  سكني: "residential",

  // Commercial
  commercial: "commercial",
  تجاري: "commercial",

  // Investment
  investment: "investment",
  استثماري: "investment",
};

// Reverse mapping: English slug to common display names
const slugToDisplayName: Record<string, { en: string; ar: string }> = {
  villa: { en: "Villa", ar: "فيلا" },
  apartment: { en: "Apartment", ar: "شقة" },
  townhouse: { en: "Townhouse", ar: "تاون هاوس" },
  penthouse: { en: "Penthouse", ar: "بنتهاوس" },
  studio: { en: "Studio", ar: "ستوديو" },
  duplex: { en: "Duplex", ar: "دوبلكس" },
  residential: { en: "Residential", ar: "سكني" },
  commercial: { en: "Commercial", ar: "تجاري" },
  investment: { en: "Investment", ar: "استثماري" },
};

/**
 * Convert any property type name (Arabic or English) to English slug
 * @param name - Property type name (can be Arabic or English)
 * @returns English slug for URL usage
 */
export const getPropertyTypeSlug = (name: string): string => {
  const normalized = name.toLowerCase().trim();
  return propertyTypeMapping[normalized] || normalized;
};

/**
 * Get display name for a property type slug
 * @param slug - English slug
 * @param language - Target language ('en' or 'ar')
 * @returns Display name in the specified language
 */
export const getPropertyTypeDisplayName = (
  slug: string,
  language: "en" | "ar" = "en"
): string => {
  const displayNames = slugToDisplayName[slug.toLowerCase()];
  if (displayNames) {
    return displayNames[language];
  }
  // Fallback: capitalize first letter
  return slug.charAt(0).toUpperCase() + slug.slice(1);
};

/**
 * Find property type from filter response by matching name
 * Returns the property with an added 'slug' field
 */
export const getPropertyTypeWithSlug = (
  name: string,
  propertyTypes: Array<{ id: number; name: string }>
): { id: number; name: string; slug: string } | null => {
  const slug = getPropertyTypeSlug(name);

  // Try to find by exact name match first
  let propertyType = propertyTypes.find(
    (type) => getPropertyTypeSlug(type.name) === slug
  );

  if (propertyType) {
    return {
      ...propertyType,
      slug,
    };
  }

  return null;
};

/**
 * Parse property type from URL segment
 * @param urlSegment - URL segment (e.g., "villa" or "فيلا")
 * @param propertyTypes - Available property types from API
 * @returns Property type object with id and name, or null if not found
 */
export const parsePropertyTypeFromUrl = (
  urlSegment: string,
  propertyTypes: Array<{ id: number; name: string }>
): { id: number; name: string; slug: string } | null => {
  const slug = getPropertyTypeSlug(urlSegment);

  // Find property type by matching slugs
  const propertyType = propertyTypes.find(
    (type) => getPropertyTypeSlug(type.name) === slug
  );

  if (propertyType) {
    return {
      ...propertyType,
      slug,
    };
  }

  return null;
};

/**
 * Check if a URL segment is a valid property type
 */
export const isValidPropertyTypeSlug = (slug: string): boolean => {
  const normalized = slug.toLowerCase().trim();
  return (
    normalized in propertyTypeMapping ||
    Object.values(propertyTypeMapping).includes(normalized)
  );
};
