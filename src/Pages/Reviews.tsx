import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import useQueryGet from "@/hooks/useQueryGet";
import StaticServices from "@/Services/StaticServices";
import ImagesUrl from "@/helpers/ImagesURL";
import formatDate from "@/helpers/formatDate";
import { motion } from "framer-motion";
import { fadeIn } from "@/Utils/Motions/motion";
import Icons from "@/Constants/Icons";
import Images from "@/Constants/Images";

// Review data type definition
type Review = {
  id: number;
  name: string;
  description: string;
  date: string;
  image?: string;
};

const Reviews = () => {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  const { data: AllReviews, status } = useQueryGet(
    ["AllReviews"],
    StaticServices.Reviews
  );

  // Calculate pagination
  const totalReviews = AllReviews?.reviews?.length || 0;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = AllReviews?.reviews?.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-sm"
        >
          <div className="animate-pulse">
            {/* Quote Icon Skeleton */}
            <div className="w-12 h-12 bg-gray-200 rounded-xl mb-6"></div>

            {/* Content Skeleton */}
            <div className="mb-8">
              <div className="space-y-3 mb-6">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>

            {/* Author Skeleton */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Customer Reviews | Shiro Real Estate Client Testimonials</title>
        <meta
          name="description"
          content="Read what our clients say about Shiro Real Estate. Discover testimonials and reviews from satisfied customers who found their dream properties in Dubai."
        />
      </Helmet>
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#094834]/5 via-[#d3c294]/10 to-[#094834]/5 py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-6 py-3 mb-8">
                <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
                <span className="text-[#094834] font-medium text-sm">
                  {t("Testimonials")}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#094834] mb-8 leading-tight">
                {t("Trusted by thousands of our happy customers")}
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                {t(
                  "Discover what our customers are saying about their experiences with Shiro Real Estate."
                )}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {status === "pending" ? (
                <LoadingSkeleton />
              ) : status === "error" ? (
                <motion.div
                  variants={fadeIn}
                  initial="initial"
                  whileInView="animate"
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icons.IoAlertCircle className="w-12 h-12 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {t("Error loading reviews")}
                  </h3>
                  <p className="text-gray-600">{t("Please try again later")}</p>
                </motion.div>
              ) : (
                <>
                  {/* Reviews Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {currentReviews?.map((review: Review, index: number) => (
                      <motion.div
                        key={review.id}
                        variants={fadeIn}
                        initial="initial"
                        whileInView="animate"
                        transition={{ delay: index * 0.1 }}
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
                            "{review.description}"
                          </p>
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={
                                review?.image
                                  ? ImagesUrl(review.image)
                                  : Images.unknownPerson
                              }
                              alt={review.name}
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
                            <h4 className="font-semibold text-[#094834] text-lg">
                              {review.name}
                            </h4>
                            <p className="text-gray-500 text-sm">
                              {formatDate(review.date, i18n.language)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Modern Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      variants={fadeIn}
                      initial="initial"
                      whileInView="animate"
                      className="flex flex-col items-center space-y-6"
                    >
                      {/* Page Info */}
                      <div className="text-center">
                        <p className="text-gray-600 text-sm">
                          {t("Showing")} {startIndex + 1} {t("to")}{" "}
                          {Math.min(endIndex, totalReviews)} {t("of")}{" "}
                          {totalReviews} {t("reviews")}
                        </p>
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-[.4s] ${
                            currentPage === 1
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-white text-[#094834] border-[#094834] hover:bg-[#9f8151] hover:text-white hover:border-[#9f8151] cursor-pointer"
                          }`}
                        >
                          <Icons.IoChevronBack className="w-4 h-4" />
                          <span className="font-medium">{t("Previous")}</span>
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
                          {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`w-12 h-12 rounded-xl border-2 font-semibold transition-all duration-[.4s] ${
                                currentPage === page
                                  ? "bg-[#094834] text-white border-[#094834]"
                                  : "bg-white text-[#094834] border-[#094834]/30 hover:bg-[#9f8151] hover:text-white hover:border-[#9f8151] cursor-pointer"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-[.4s] ${
                            currentPage === totalPages
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-white text-[#094834] border-[#094834] hover:bg-[#9f8151] hover:text-white hover:border-[#9f8151] cursor-pointer"
                          }`}
                        >
                          <span className="font-medium">{t("Next")}</span>
                          <Icons.IoChevronForward className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Reviews;
