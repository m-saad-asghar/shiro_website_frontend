const ImagesUrl = (dynamicPath: string | undefined) => {
  // If path is undefined or null, return empty string
  if (!dynamicPath) {
    return "";
  }

  // If the path is already a full URL (starts with http:// or https://), return it as is
  if (dynamicPath.startsWith("http://") || dynamicPath.startsWith("https://")) {
    return dynamicPath;
  }

  // Otherwise, prepend the base URL
  const baseURL =
    import.meta.env.VITE_IMAGE_BASE_URL || "https://shiroproperties.com/";
  return baseURL + dynamicPath;
};

export default ImagesUrl;
