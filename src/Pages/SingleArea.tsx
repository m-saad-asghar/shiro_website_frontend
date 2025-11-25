import useQueryGet from "@/hooks/useQueryGet";
import { Helmet } from "react-helmet";
import { Loader } from "@/Components";
import PropertiesServices from "@/Services/PropertiesServices";
import StaticServices from "@/Services/StaticServices";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";
import ImagesUrl from "@/helpers/ImagesURL";
import ProjectCard from "@/Components/Property/ProjectCard";

interface Region {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

interface Property {
  id: number;
  title: string;
  slug?: string;
  [key: string]: unknown;
}

const SingleArea = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Convert slug back to area name (replace hyphens with spaces)
  // Example: "Dubai" or "Abu-Dhabi" -> "Abu Dhabi"
  const getAreaNameFromSlug = (
    slug: string | undefined
  ): string | undefined => {
    if (!slug) return undefined;
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const areaName = getAreaNameFromSlug(slug);

  // Get area data from the regions API
  const { data: areaData } = useQueryGet(["AreaData"], () =>
    StaticServices.Area("")
  );

  // Find the specific area data from the regions list by name
  const currentArea = areaData?.region?.find((area: Region) => {
    const areaNameNormalized = area.name?.toLowerCase().trim();
    const searchNameNormalized = areaName?.toLowerCase().trim();
    return (
      areaNameNormalized === searchNameNormalized ||
      areaNameNormalized?.includes(searchNameNormalized || "") ||
      searchNameNormalized?.includes(areaNameNormalized || "")
    );
  });

  // Get area ID from found area
  const areaId = currentArea?.id?.toString();

  // Get properties for this area
  const { data: PropertieArea } = useQueryGet(
    ["PropertieArea", areaId || ""],
    () => PropertiesServices.PropertiesArea(areaId)
  );

  // Debug: Log the data to see what's available from backend

  return (
    <>
      <Helmet>
        <title>
          {currentArea?.name || "Area Guide"} | Dubai Area Guide - Shiro Real
          Estate
        </title>
        <meta
          name="description"
          content={
            currentArea?.description ||
            `Explore ${
              currentArea?.name || "this area"
            } in Dubai. Find properties, amenities, lifestyle information, and expert insights from Shiro Real Estate.`
          }
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="pt-28 md:pt-32 lg:pt-36"
        >
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
          >
            <button
              onClick={() => navigate("/area-guides")}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                <Icons.FaLongArrowAltLeft className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium capitalize">
                {t("Back to Areas")}
              </span>
            </button>
          </motion.div>

          {/* Area Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-64 md:h-80 lg:h-96">
                <img
                  src={ImagesUrl(currentArea?.image)}
                  alt={currentArea?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                    {currentArea?.name}
                  </h1>
                  <p className="text-white/90 text-lg">Dubai, UAE</p>
                </div>
              </div>

              {/* Area Content */}
              <div className="p-6 md:p-8 lg:p-12">
                <div className="grid grid-cols-1 gap-8">
                  {/* Description */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {t("About")} {currentArea?.name}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {currentArea?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Properties Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {!currentArea ? (
              <Loader message="Loading area information..." size="lg" />
            ) : PropertieArea?.properties.length == 0 ? (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <svg
                      className="w-12 h-12 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    No properties found in this area
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Check back later for new listings in {currentArea?.name}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Properties in {currentArea?.name}
                  </h2>
                  <p className="text-gray-600">
                    Discover {PropertieArea?.properties?.length} properties
                    available in this area
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PropertieArea?.properties?.map((property: Property) => (
                    <ProjectCard
                      key={property.id}
                      item={property}
                      viewMode="grid"
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default SingleArea;
