import { useMemo } from "react";
import useQueryGet from "@/hooks/useQueryGet";
import BlogServices from "@/Services/BlogServices";

export const useBlogCategories = () => {
  const { data: categoriesData, status } = useQueryGet(
    ["blog-categories"],
    BlogServices.BlogCategories
  );

  const categories = useMemo(() => {
    if (!categoriesData?.blog_categories) return {};

    // Create mapping from category_id to category name
    const categoryMap: { [key: number]: string } = {};

    categoriesData.blog_categories.forEach(
      (category: { id: string; title: string }) => {
        categoryMap[parseInt(category.id)] = category.title;
      }
    );

    return categoryMap;
  }, [categoriesData]);

  const getCategoryName = (categoryId: number | undefined): string => {
    if (!categoryId) return "Real Estate";
    return categories[categoryId] || "Real Estate";
  };

  return {
    categories,
    getCategoryName,
    isLoading: status === "pending",
    isError: status === "error",
  };
};

export default useBlogCategories;
