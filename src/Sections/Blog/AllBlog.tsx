import { Pagination } from "@/Components";
import { Card } from "@/Components/Blog";
import { Skeleton } from "@/Components/ui/skeleton";
import { useMemo, useState, type FC } from "react";
import { useTranslation } from "react-i18next";

type AllBlogProps = {
  pagination: any;
  item: any;
  status: any;
};

const AllBlog: FC<AllBlogProps> = ({ pagination, item, status }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(1);

  const renderCard = useMemo(() => {
    return item?.map((item: any) => <Card item={item} key={item?.id} />);
  }, [item]);

  const renderSkeltonCard = useMemo(() => {
    return [...Array(8)].map((_, index: number) => (
      <div
        key={index}
        className="bg-white rounded-2xl overflow-hidden shadow-sm"
      >
        <Skeleton className="w-full h-48" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ));
  }, []);

  return (
    <section className="w-full py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
              <span className="text-[#094834] font-medium text-sm">
                {t("All Articles")}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-12">
            {status == "pending" || status == "error"
              ? renderSkeltonCard
              : renderCard}
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex justify-center">
              <Pagination
                className="w-full py-8"
                lastPages={pagination?.last_page}
                page={page}
                setPage={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllBlog;
