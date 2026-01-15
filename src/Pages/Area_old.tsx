import useQueryGet from "@/hooks/useQueryGet";
import { Helmet } from "react-helmet";
import { AllArea, Banner } from "@/Sections/Area";
import { Loader } from "@/Components";
import StaticServices from "@/Services/StaticServices";
import { useState } from "react";
import { motion } from "framer-motion";

const AreaOld = () => {
  const [values, setValues] = useState<string>("");
  const { data, status } = useQueryGet(["AllArea", values], () =>
    StaticServices.Area(values)
  );

  return (
    <>
      <Helmet>
        <title>
          Dubai Area Guides | Neighborhoods & Communities Information
        </title>
        <meta
          name="description"
          content="Explore Dubai's top neighborhoods and communities. Find detailed area guides, property listings, amenities, and lifestyle information from Shiro Real Estate."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="pt-28 md:pt-32 lg:pt-36"
        >
          <Banner setValues={setValues} />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 md:mt-20 lg:mt-24"
          >
            {status == "pending" || status == "error" ? (
              <Loader message="Loading areas..." size="lg" />
            ) : data?.region.length == 0 ? (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    No data found
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Try adjusting your search criteria or browse our available
                    areas.
                  </p>
                </div>
              </div>
            ) : (
              <AllArea data={data?.region} status={status} />
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default AreaOld;
