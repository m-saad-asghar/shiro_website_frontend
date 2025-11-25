import useQueryGet from "@/hooks/useQueryGet";
import StaticServices from "@/Services/StaticServices";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/Components/ui/skeleton";
import ImagesUrl from "@/helpers/ImagesURL";
import formatDate from "@/helpers/formatDate";
import Images from "@/Constants/Images";

interface ReviewItem {
  id: number;
  name: string;
  description: string;
  date: string;
  image?: string;
}

const OurClients = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { data: AllReviews, status } = useQueryGet(
    ["AllReviews"],
    StaticServices.Reviews
  );

  // Show only first 3 reviews on home page
  const displayedReviews = useMemo(() => {
    return AllReviews?.reviews?.slice(0, 3) || [];
  }, [AllReviews]);

  const renderCard = displayedReviews?.map((item: ReviewItem) => (
    <div
      key={item?.id}
      className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Quote Icon */}
      <div className="mb-6">
        <div className="w-12 h-12 bg-[#094834]/10 rounded-xl flex items-center justify-center">
          <svg
            className="w-6 h-6 text-[#094834]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-8">
        <p className="text-gray-700 leading-relaxed text-lg mb-6 line-clamp-4">
          "{item.description}"
        </p>
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={item?.image ? ImagesUrl(item.image) : Images.unknownPerson}
            alt={item.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#094834]/20"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#094834] rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-[#094834] text-lg">{item.name}</h4>
          <p className="text-gray-500 text-sm">
            {formatDate(item.date, i18n.language)}
          </p>
        </div>
      </div>
    </div>
  ));

  const renderSkeletonCard = useMemo(() => {
    return [...Array(3)].map((_, index: number) => (
      <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="space-y-6">
          {/* Quote Icon Skeleton */}
          <Skeleton className="w-12 h-12 rounded-xl" />

          {/* Content Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Author Skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    ));
  }, []);

  return (
    <section className="w-full py-12 md:py-10 lg:py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
              <span className="text-[#094834] font-medium text-sm">
                {t("Testimonials")}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#094834] mb-6 leading-tight">
              {t("Why Our Clients Trust Us")}
            </h2>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {t(
                "Discover what our customers are saying about their experiences."
              )}
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {status === "pending" || status === "error"
              ? renderSkeletonCard
              : renderCard}
          </div>

          {/* View All Button */}
          {AllReviews?.reviews && AllReviews.reviews.length > 0 && (
            <div className="text-center">
              <button
                onClick={() => navigate("/reviews")}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#094834] text-white font-semibold rounded-xl hover:bg-[#9f8151] transition-all duration-[.4s] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  {t("View All Reviews")}
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OurClients;
