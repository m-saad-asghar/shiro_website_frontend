import { useTranslation } from "react-i18next";
import { memo, useMemo } from "react";
import { Skeleton } from "@/Components/ui/skeleton";
import useQueryGet from "@/hooks/useQueryGet";
import BlogServices from "@/Services/BlogServices";
import ImagesUrl from "@/helpers/ImagesURL";
import formatDate from "@/helpers/formatDate";
import { useNavigate } from "react-router-dom";
import useBlogCategories from "@/hooks/useBlogCategories";

const SummaryBlog = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { getCategoryName } = useBlogCategories();

  // Fetch blogs from backend - same method used in Blog page
  const { data: blogsData, status } = useQueryGet(["latest-blogs"], () =>
    BlogServices.AllBlogs()
  );

  // Take only the last 3 blogs
  const latestBlogs = useMemo(() => {
    if (blogsData?.blogs && Array.isArray(blogsData.blogs)) {
      return blogsData.blogs.slice(0, 3);
    }
    return [];
  }, [blogsData]);

  const handleBlogClick = (item: { id: number; title: string }) => {
    // Create slug from title and append ID at the end
    const slug = `${item?.title.replace(/ /g, "_")}_${item.id}`;
    navigate(`/blog/${slug}`);
  };

  return (
    <section className="w-full bg-white py-12 md:py-12 lg:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
              <span className="text-[#094834] font-medium text-sm">
                {t("Latest Insights")}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#094834] mb-6 leading-tight">
              {t("Real Estate Blog & Insights")}
            </h2>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {t(
                "Stay updated with the latest trends, market analysis, and expert insights from Dubai's real estate market."
              )}
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {status === "pending" ? (
              // Loading skeletons
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                >
                  <Skeleton className="w-full h-48" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            ) : status === "error" ? (
              // Error state
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  {t("Unable to load blog posts. Please try again later.")}
                </p>
              </div>
            ) : latestBlogs.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  {t("No blog posts available at the moment.")}
                </p>
              </div>
            ) : (
              // Blog posts
              latestBlogs.map(
                (item: {
                  id: number;
                  title: string;
                  description: string;
                  created_at: string;
                  main_image: string;
                  blog_category_id: number;
                  tags: string;
                }) => (
                  <article
                    key={item.id}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                    onClick={() => handleBlogClick(item)}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={ImagesUrl(item?.main_image)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#094834] text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {getCategoryName(item?.blog_category_id)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-[#094834] mb-3 line-clamp-2 group-hover:text-[#9f8151] transition-colors duration-300">
                        {item.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {item.description
                          ?.replace(/<[^>]*>/g, "")
                          .substring(0, 120)}
                        ...
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {formatDate(item.created_at, i18n.language)}
                        </span>
                        <span className="text-[#094834] font-medium">
                          {t("Read More")} →
                        </span>
                      </div>
                    </div>
                  </article>
                )
              )
            )}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/blog")}
              className="inline-flex items-center gap-2 bg-[#094834] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#9f8151] transition-all duration-[.4s]"
            >
              {t("View All Articles")}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(SummaryBlog);
