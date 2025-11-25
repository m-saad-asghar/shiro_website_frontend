import { type FC } from "react";
import Icons from "@/Constants/Icons";
import { useTranslation } from "react-i18next";

type PaginationLayoutProps = {
  className: string;
  lastPages: string;
  page: number;
  setPage: (page: number) => void;
};

const PaginationLayout: FC<PaginationLayoutProps> = ({
  lastPages,
  className,
  page,
  setPage,
}) => {
  const { t } = useTranslation();
  const totalPages = Number(lastPages);

  // Generate page numbers with ellipsis for better UX
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis for better navigation
      if (page <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePrevious = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  };

  return (
    <div className={`${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Page Info */}
        <div className="text-sm text-gray-600">
          {t("Page")} {page} {t("of")} {totalPages}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={page <= 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              page <= 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-primary border border-gray-200 hover:bg-primary hover:text-white hover:border-primary"
            }`}
            aria-label="Go to previous page"
          >
            <Icons.IoIosArrowBack size={16} />
            {t("Previous")}
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, index) => (
              <div key={index}>
                {pageNum === "..." ? (
                  <span className="px-3 py-2 text-gray-400">...</span>
                ) : (
                  <button
                    onClick={() => handlePageChange(pageNum as number)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      page === pageNum
                        ? "bg-primary text-white shadow-lg"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-primary"
                    }`}
                    aria-label={`Go to page ${pageNum}`}
                  >
                    {pageNum}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={page >= totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              page >= totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-primary border border-gray-200 hover:bg-primary hover:text-white hover:border-primary"
            }`}
            aria-label="Go to next page"
          >
            {t("Next")}
            <Icons.IoIosArrowForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationLayout;
