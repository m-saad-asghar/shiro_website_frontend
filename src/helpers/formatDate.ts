/**
 * Format date based on the specified language
 * @param dateString - Date as string
 * @param locale - Language (ar or en)
 * @returns Formatted date
 */
const formatDate = (dateString: string, locale: string = "en"): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Validate date
  if (isNaN(date.getTime())) return dateString;

  const isArabic = locale.startsWith("ar");

  // Use Islamic calendar for Arabic and Gregorian for English
  return date.toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    calendar: isArabic ? "islamic" : "gregory",
  });
};

export default formatDate;
