import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import useQueryGet from "@/hooks/useQueryGet";
import PropertiesServices from "@/Services/PropertiesServices";
import StaticServices from "@/Services/StaticServices";
import ImagesUrl from "@/helpers/ImagesURL";
import formatDate from "@/helpers/formatDate";
import Icons from "@/Constants/Icons";
import { useAreaUnit } from "@/Context/AreaUnitContext";
import RegisterInterestForm from "@/Components/Forms/RegisterInterestForm";
import ProjectGallery from "@/Components/Gallery/ProjectGallery";
import { PropertyMap } from "@/Components";

const SingleProject = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const { formatArea } = useAreaUnit();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const { data, status } = useQueryGet(["singleProject", slug], () =>
    PropertiesServices.showProjectBySlug(slug)
  );

  const { data: contact } = useQueryGet(["contact"], StaticServices.contact);

  if (status === "pending") {
    return (
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading project details...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error" || !data?.property) {
    return (
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icons.CiLocationOn className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {status === "error"
                ? t("Error loading project")
                : t("Project not found")}
            </h2>
            <p className="text-gray-600 mb-6">
              {status === "error"
                ? t(
                    "There was an error loading the project details. Please try again later."
                  )
                : t(
                    "The project you're looking for doesn't exist or has been removed."
                  )}
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors duration-200 font-medium"
            >
              {t("Go Back")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const property = data.property;

  // Debug: Log the data to see what's available from backend

  // Debug: Log all possible location fields

  // Debug: Log the entire property object to see all available fields

  // Get the first image for banner
  const getBannerImage = () => {
    if (property?.images && property.images.length > 0) {
      return property.images[0];
    }
    return property?.main_image || property?.image;
  };

  // Get remaining images for gallery (excluding first image)
  const getGalleryImages = () => {
    if (property?.images && property.images.length > 1) {
      return property.images.slice(1);
    }
    return [];
  };

  // Get max values for ranges
  const getMaxBedrooms = () => {
    return (
      property?.num_bedroom ||
      property?.bedroom_max ||
      property?.bedrooms ||
      property?.max_bedrooms
    );
  };

  const getMaxBathrooms = () => {
    return (
      property?.num_bathroom ||
      property?.bathroom_max ||
      property?.bathrooms ||
      property?.max_bathrooms
    );
  };

  const getMaxArea = () => {
    const area = property?.area || property?.area_max || property?.max_area;
    return area;
  };

  // Get location from various possible fields
  const getLocation = () => {
    const location =
      property?.location ||
      property?.address ||
      property?.neighborhood ||
      property?.district ||
      property?.city ||
      property?.region ||
      property?.emirate ||
      property?.full_address ||
      property?.street_address ||
      "Dubai, UAE"; // Fallback location

    // Debug: Log location data

    return location;
  };

  // Get PDF file from various possible fields
  const getPdfFile = () => {
    const pdfFile = property?.offplan_pdf || property?.pdf_file;

    // Debug: Log PDF data

    return pdfFile;
  };

  return (
    <>
      <Helmet>
        <title>{property.meta_title || property.title}</title>
        <meta
          name="description"
          content={property.meta_description || property.description}
        />
      </Helmet>

      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        {/* Hero Banner */}
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <img
            src={ImagesUrl(getBannerImage())}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%239ca3af'%3ENo Image Available%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Action Buttons */}
          <div className="absolute top-8 right-8 flex gap-4">
            {(() => {
              return getPdfFile() ? (
                <motion.a
                  href={ImagesUrl(getPdfFile())}
                  download
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-white transition-all duration-300 flex items-center gap-2"
                  onClick={() => {}}
                >
                  <Icons.FaArrowUpRightFromSquare className="w-5 h-5" />
                  {t("Download Brochure")}
                </motion.a>
              ) : null;
            })()}
            <motion.button
              onClick={() =>
                document
                  .getElementById("register-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center gap-2"
            >
              <Icons.IoMdHeart className="w-5 h-5" />
              {t("Register Interest")}
            </motion.button>
          </div>

          {/* Developer Logo */}
          {property.developer?.logo && (
            <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm rounded-xl p-4">
              <img
                src={ImagesUrl(property.developer.logo)}
                alt={property.developer.name}
                className="h-12 w-auto object-contain"
              />
            </div>
          )}

          {/* Project Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {property.title}
              </h1>
              {(() => {
                const location = getLocation();
                return (
                  <div className="flex items-center gap-2 text-xl text-gray-200 mb-4">
                    <Icons.CiLocationOn className="w-6 h-6" />
                    <span>{location}</span>
                  </div>
                );
              })()}

              {/* Project Highlights */}
              <div className="flex flex-wrap gap-4 mt-6">
                {property.starting_price && (
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <span className="text-sm font-medium">
                      {t("Starting from")} {property.currency_symbol || "AED"}{" "}
                      {property.converted_starting_price ||
                        property.starting_price}
                    </span>
                  </div>
                )}
                {property.handover_year && (
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <span className="text-sm font-medium">
                      {t("Handover")} {property.handover_year}
                    </span>
                  </div>
                )}
                {property.property_mix && (
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <span className="text-sm font-medium">
                      {property.property_mix}
                    </span>
                  </div>
                )}
                {property.payment_plan && (
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <span className="text-sm font-medium">
                      {property.payment_plan}
                    </span>
                  </div>
                )}
                {property.is_finish !== undefined && (
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <span className="text-sm font-medium">
                      {property.is_finish
                        ? t("Completed")
                        : t("Under Construction")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto space-y-16"
          >
            {/* Project Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Project Description */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {t("Project Description")}
                </h2>
                {property.description && (
                  <div className="prose prose-lg text-gray-700 leading-relaxed">
                    <div
                      dangerouslySetInnerHTML={{ __html: property.description }}
                    />
                  </div>
                )}
              </div>

              {/* Project Specifications */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("Project Specifications")}
                </h3>
                <div className="space-y-6">
                  {/* Starting Price */}
                  {property.starting_price && (
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        {t("Starting Price")}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {property.currency_symbol || "AED"}{" "}
                        {property.converted_starting_price ||
                          property.starting_price}
                      </span>
                    </div>
                  )}

                  {/* Handover Year */}
                  {property.handover_year && (
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        {t("Handover Year")}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {property.handover_year}
                      </span>
                    </div>
                  )}

                  {/* Payment Plan */}
                  {property.payment_plan && (
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        {t("Payment Plan")}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {property.payment_plan}
                      </span>
                    </div>
                  )}

                  {/* Property Mix */}
                  {property.property_mix && (
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        {t("Property Mix")}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {property.property_mix}
                      </span>
                    </div>
                  )}

                  {/* Completion Date */}
                  {property.completion_date && (
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        {t("Completion Date")}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {new Date(property.completion_date).getFullYear()}
                      </span>
                    </div>
                  )}

                  {/* Status */}
                  {property.is_finish !== undefined && (
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        {t("Status")}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {property.is_finish
                          ? t("Completed")
                          : t("Under Construction")}
                      </span>
                    </div>
                  )}

                  {/* Bedrooms */}
                  {getMaxBedrooms() && (
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        {t("Bedrooms")}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        1-{getMaxBedrooms()}
                      </span>
                    </div>
                  )}

                  {/* Bathrooms */}
                  {getMaxBathrooms() && (
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        {t("Bathrooms")}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        1-{getMaxBathrooms()}
                      </span>
                    </div>
                  )}

                  {/* Area */}
                  {(() => {
                    const maxArea = getMaxArea();
                    return maxArea ? (
                      <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          {t("Area")}
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {t("Up to")} {formatArea(maxArea)}
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Completion Date */}
                  {property.completion_date && (
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        {t("Completion Date")}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {new Date(property.completion_date).getFullYear()}
                      </span>
                    </div>
                  )}

                  {/* Status */}
                  {property.status && (
                    <div className="flex items-center justify-between py-4">
                      <span className="text-gray-600 font-medium">
                        {t("Status")}
                      </span>
                      <span className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full">
                        {property.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Project Gallery */}
            {getGalleryImages().length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {t("Project Gallery")}
                </h2>
                <ProjectGallery
                  images={getGalleryImages()}
                  projectTitle={property.title}
                />
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {t("Amenities")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {property.amenities.map(
                    (amenity: {
                      id: number;
                      name: string;
                      icon_url?: string;
                      description?: string;
                    }) => (
                      <div
                        key={amenity.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                      >
                        {amenity.icon_url && (
                          <img
                            src={ImagesUrl(amenity.icon_url)}
                            alt={amenity.name}
                            className="w-8 h-8 object-contain flex-shrink-0"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {amenity.name}
                          </h3>
                          {amenity.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {amenity.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Unique Points */}
            {property.unique_points && property.unique_points.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {t("Unique Points")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {property.unique_points.map(
                    (point: {
                      id: number;
                      point_text: string;
                      icon_url?: string;
                    }) => (
                      <div
                        key={point.id}
                        className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors duration-200"
                      >
                        {point.icon_url && (
                          <img
                            src={ImagesUrl(point.icon_url)}
                            alt={point.point_text}
                            className="w-8 h-8 object-contain flex-shrink-0"
                          />
                        )}
                        <p className="font-medium text-gray-900">
                          {point.point_text}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Floorplans */}
            {property.floorplans && property.floorplans.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {t("Floor Plans")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {property.floorplans.map(
                    (floorplan: {
                      id: number;
                      type?: string;
                      plan_image_url?: string;
                      pdf_url?: string;
                      area?: number;
                      price?: string;
                      description?: string;
                    }) => (
                      <div
                        key={floorplan.id}
                        className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                      >
                        {floorplan.plan_image_url && (
                          <div className="mb-4 rounded-lg overflow-hidden">
                            <img
                              src={ImagesUrl(floorplan.plan_image_url)}
                              alt={floorplan.type}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {floorplan.type}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          {floorplan.area && (
                            <p>
                              <span className="font-medium">Area:</span>{" "}
                              {formatArea(floorplan.area)}
                            </p>
                          )}
                          {floorplan.price && (
                            <p>
                              <span className="font-medium">Price:</span> AED{" "}
                              {floorplan.price}
                            </p>
                          )}
                          {floorplan.description && (
                            <p className="text-xs">{floorplan.description}</p>
                          )}
                        </div>
                        {floorplan.pdf_url && (
                          <a
                            href={ImagesUrl(floorplan.pdf_url)}
                            download
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
                          >
                            <Icons.FaArrowUpRightFromSquare className="w-4 h-4" />
                            {t("Download PDF")}
                          </a>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Nearby Places */}
            {property.nearby_places && property.nearby_places.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {t("Nearby Places")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {property.nearby_places.map(
                    (place: {
                      id: number;
                      place_name?: string;
                      time_minutes?: number;
                      distance?: string;
                      transport_type?: string;
                    }) => (
                      <div
                        key={place.id}
                        className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {place.place_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icons.CiLocationOn className="w-4 h-4 flex-shrink-0" />
                          <span>{place.distance}</span>
                          <span>•</span>
                          <span>
                            {place.time_minutes} {t("minutes")} (
                            {place.transport_type})
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Payment Schedules */}
            {property.payment_schedules &&
              property.payment_schedules.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    {t("Payment Schedule")}
                  </h2>
                  <div className="space-y-4">
                    {property.payment_schedules.map(
                      (schedule: {
                        id: number;
                        phase_name?: string;
                        percentage?: number;
                        description?: string;
                        due_date?: string;
                      }) => (
                        <div
                          key={schedule.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                        >
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {schedule.phase_name}
                            </h3>
                            {schedule.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {schedule.description}
                              </p>
                            )}
                            {schedule.due_date && (
                              <p className="text-xs text-gray-500 mt-1">
                                Due:{" "}
                                {formatDate(schedule.due_date, i18n.language)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-primary">
                              {schedule.percentage}%
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* FAQs */}
            {property.faqs && property.faqs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {t("Frequently Asked Questions")}
                </h2>
                <div className="space-y-4">
                  {property.faqs.map(
                    (faq: {
                      id: number;
                      question?: string;
                      answer?: string;
                    }) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:border-primary/30 transition-colors duration-200"
                      >
                        <button
                          onClick={() =>
                            setOpenFAQ(openFAQ === faq.id ? null : faq.id)
                          }
                          className="w-full px-6 py-5 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </h3>
                          <motion.div
                            animate={{ rotate: openFAQ === faq.id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0"
                          >
                            <Icons.IoChevronDown
                              size={24}
                              className="text-primary"
                            />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {openFAQ === faq.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6">
                                <div className="pt-4 border-t border-gray-100">
                                  <div
                                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                      __html: faq.answer || "",
                                    }}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Map Section */}
            {((property.latitude && property.longitude) ||
              property.map_embed_url) && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {t("Location & Map")}
                </h2>

                {/* Location Info */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Icons.CiLocationOn className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {property.map_address ||
                          property.location ||
                          "Dubai, UAE"}
                      </h3>
                      {property.latitude && property.longitude && (
                        <p className="text-sm text-gray-600">
                          Coordinates: {property.latitude}, {property.longitude}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {property.google_maps_link && (
                      <a
                        href={property.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Icons.CiLocationOn className="w-4 h-4" />
                        {t("Open in Google Maps")}
                      </a>
                    )}

                    {property.latitude &&
                      property.longitude &&
                      !property.google_maps_link && (
                        <a
                          href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                        >
                          <Icons.CiLocationOn className="w-4 h-4" />
                          {t("Open in Google Maps")}
                        </a>
                      )}

                    <button
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              const userLat = position.coords.latitude;
                              const userLng = position.coords.longitude;
                              const propertyLat = property.latitude;
                              const propertyLng = property.longitude;

                              if (propertyLat && propertyLng) {
                                window.open(
                                  `https://www.google.com/maps/dir/${userLat},${userLng}/${propertyLat},${propertyLng}`
                                );
                              }
                            }
                          );
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                    >
                      <Icons.FaArrowUpRightFromSquare className="w-4 h-4" />
                      {t("Get Directions")}
                    </button>
                  </div>
                </div>

                {/* Project Map */}
                <PropertyMap property={property} />
              </div>
            )}

            {/* Developer Description */}
            {(() => {
              return property.developer ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <div className="flex items-center gap-6 mb-8">
                    {property.developer.logo && (
                      <img
                        src={ImagesUrl(property.developer.logo)}
                        alt={property.developer.name}
                        className="h-16 w-auto object-contain"
                      />
                    )}
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {property.developer.name}
                      </h2>
                      <p className="text-gray-600 text-lg">
                        {t("Trusted Developer")}
                      </p>
                    </div>
                  </div>

                  {property.developer.description && (
                    <div className="prose prose-lg text-gray-700 leading-relaxed">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: property.developer.description,
                        }}
                      />
                    </div>
                  )}

                  {/* Developer Contact Info */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {property.developer.website && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <Icons.IoGlobeOutline className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-gray-600">Website</p>
                          <a
                            href={property.developer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {property.developer.website}
                          </a>
                        </div>
                      </div>
                    )}
                    {property.developer.phone && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <Icons.LuPhone className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <a
                            href={`tel:${property.developer.phone}`}
                            className="text-primary hover:underline"
                          >
                            {property.developer.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    {property.developer.email && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <Icons.IoMailOutline className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-gray-600">{t("Email")}</p>
                          <a
                            href={`mailto:${property.developer.email}`}
                            className="text-primary hover:underline"
                          >
                            {property.developer.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {property.developer.address && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <Icons.CiLocationOn className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="text-gray-900">
                            {property.developer.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Register Interest Form and Contact Information */}
            <section
              id="register-form"
              className="w-full py-12 md:py-10 lg:py-12 bg-gradient-to-br from-gray-50 to-white"
            >
              <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                  {/* Header Section */}
                  <div className="text-center mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-6 py-3 mb-6">
                      <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
                      <span className="text-[#094834] font-medium text-sm">
                        {t("Get In Touch")}
                      </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#094834] mb-6 leading-tight">
                      {t("Interested in")} {property.title}?
                    </h2>

                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                      {t(
                        "Get in touch with us to learn more about this exclusive project"
                      )}
                    </p>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16 items-stretch">
                    {/* Left Side - Contact Information */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex flex-col">
                      <h3 className="text-2xl font-bold text-[#094834] mb-6">
                        {t("Contact Information")}
                      </h3>

                      <div className="space-y-4 flex-grow">
                        {(() => {
                          const contactInfo = [
                            {
                              id: 1,
                              icon: <Icons.FaWhatsapp size={25} />,
                              title: t("WhatsApp"),
                              desc: contact?.contact_info?.whatsapp,
                              action: () =>
                                window.open(
                                  `https://wa.me/${contact?.contact_info?.whatsapp}`
                                ),
                            },
                            {
                              id: 2,
                              icon: <Icons.LuPhone size={25} />,
                              title: t("Phone"),
                              desc: contact?.contact_info?.phone,
                              action: () =>
                                window.open(
                                  `tel:${contact?.contact_info?.phone}`
                                ),
                            },
                            {
                              id: 3,
                              icon: <Icons.LuPhone size={25} />,
                              title: t("secondary Phone"),
                              desc: contact?.contact_info?.secondary_phone,
                              action: () =>
                                window.open(
                                  `tel:${contact?.contact_info?.secondary_phone}`
                                ),
                            },
                            {
                              id: 4,
                              icon: <Icons.MdOutlineEmail size={25} />,
                              title: t("Email"),
                              desc: contact?.contact_info?.email,
                              action: () =>
                                window.open(
                                  `mailto:${contact?.contact_info?.email}`
                                ),
                            },
                            {
                              id: 5,
                              icon: <Icons.CiLocationOn size={25} />,
                              title: t("Location"),
                              desc:
                                contact?.contact_info?.address || "Dubai, UAE",
                              action: () =>
                                window.open(
                                  "https://maps.app.goo.gl/uEsbMoYojDkhCpVw7"
                                ),
                            },
                          ];

                          return contactInfo.map((item) => (
                            <div
                              key={item.id}
                              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-[#094834]/30"
                              onClick={item.action}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-lg bg-[#094834] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                                  <div className="text-white text-lg [&>*]:text-white [&>*]:fill-white [&>*]:stroke-white">
                                    {item.icon}
                                  </div>
                                </div>

                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-[#094834] mb-1 capitalize">
                                    {item.title}
                                  </h3>
                                  <p className="text-gray-600 font-medium group-hover:text-[#9f8151] transition-colors duration-300">
                                    {item.desc}
                                  </p>
                                </div>

                                <div className="text-[#094834] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
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
                                </div>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* Right Side - Register Interest Form */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 md:p-10 flex flex-col">
                      {/* Form header */}
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-[#094834] mb-2">
                          {t("Register Your Interest")}
                        </h3>
                        <p className="text-gray-600">
                          {t(
                            "Fill out the form below and we'll get back to you shortly"
                          )}
                        </p>
                      </div>

                      <RegisterInterestForm
                        projectTitle={property.title}
                        projectId={property.slug || property.id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SingleProject;
