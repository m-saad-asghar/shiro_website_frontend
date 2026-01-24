const empImagesUrl = (dynamicPath: string | undefined) => {
  // If path is undefined or null, return empty string
  if (!dynamicPath) {
    return "";
  }

  // If already a full URL, return as is
  if (
    dynamicPath.startsWith("http://") ||
    dynamicPath.startsWith("https://")
  ) {
    return dynamicPath;
  }

  // Base URL (from env or fallback)
  const baseURL =
    import.meta.env.VITE_IMAGE_BASE_URL || "https://shiroproperties.com";

  // Ensure no double slashes
  const cleanBase = baseURL.replace(/\/$/, "");
  const cleanPath = dynamicPath.replace(/^\//, "");

  // Images are inside /employees folder
  return `${cleanBase}/emp/${cleanPath}`;
};

export default empImagesUrl;
