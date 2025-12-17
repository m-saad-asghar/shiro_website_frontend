import {
  MortgageCalculator,
  BoxForm,
  CurrencyConverter,
} from "@/Components/SingleProperty";
import { PropertyMap } from "@/Components";
import { Helmet } from "react-helmet";
import useQueryGet from "@/hooks/useQueryGet";
import {
  Gallery,
  HeaderSingleProperty,
  InfoProperty,
  RecommendedProperties,
} from "@/Sections/SingleProperty";
import PropertiesServices from "@/Services/PropertiesServices";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ExploreProperty from "@/Sections/Home/ExploreProperty";

const SingleProperty = () => {
  const { slug } = useParams();

  // Use slug directly with API - no need for ID extraction
  // The API supports /property/slug/{slug} endpoint
  const { data: show, status } = useQueryGet(["showProperty", slug || ""], () =>
    PropertiesServices.showBySlug(slug)
  );

  // Get ID from property data for recommended properties
  const id = show?.property?.id?.toString();

  return (
    <>
      <Helmet>
        <title>
          {show?.property?.meta_title ||
            show?.property?.title ||
            "Property Details"}
        </title>
        <meta
          name="description"
          content={
            show?.property?.meta_description ||
            show?.property?.description ||
            "Discover this exceptional property in Dubai. Explore detailed information, photos, amenities, and contact Shiro Real Estate for viewing."
          }
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="custom_container"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <HeaderSingleProperty is_favorite={show?.property?.is_favorite} />
          </motion.div>

          {/* Gallery - Full Width */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5"
          >
            <Gallery item={show?.property?.images} status={status} />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white  shadow-lg p-6 md:p-8 change_border"
              >
                <InfoProperty item={show?.property} />
              </motion.div>

              {/* Property Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <PropertyMap property={show?.property} />
              </motion.div>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <BoxForm item={show?.property} />
              </motion.div>

              {/* Currency Converter */}
              {/* <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <CurrencyConverter
                  propertyPrice={
                    show?.property?.converted_price ||
                    show?.property?.price ||
                    0
                  }
                />
              </motion.div> */}
            </div>
          </div>

          {/* Mortgage Calculator - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className=""
          >
            <MortgageCalculator
              propertyPrice={show?.property?.converted_price || 0}
            />
          </motion.div>

          {/* Recommended Properties */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 mb-20"
          >
            <RecommendedProperties
              currentPropertyId={id || ""}
              propertyType={show?.property?.property_type?.name}
              location={show?.property?.location}
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default SingleProperty;
