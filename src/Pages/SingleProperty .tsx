import { MortgageCalculator, BoxForm } from "@/Components/SingleProperty";
import { PropertyMap } from "@/Components";
import { Helmet } from "react-helmet";
import ExploreProperty from "@/Sections/Home/ExploreProperty";
import {
  Gallery,
  HeaderSingleProperty,
  InfoProperty,
  RecommendedProperties,
} from "@/Sections/SingleProperty";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type ApiResponse = {
  status: boolean;
  data: {
    listing: any;
    employee: {
      name: string;
      slug: string;
      position: string;
      profile_picture: string | null;
      email: string;
      phone: string;
      whatsapp: string | null;
    } | null;
    images: string[];
    amenities: string[];
  };
};

const SingleProperty = () => {
  // Your route param is `slug` in this file.
  // You said URL contains `reference`, so we treat slug as reference.
  const { slug } = useParams();
  const reference = slug || "";

  const [show, setShow] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [listings, setListings] = useState<Record<string, any> | null>(null);
const [amenities, setAmenities] = useState<Record<string, any>[]>([]);
const [images, setImages] = useState<string[]>([]);
 const [employees, setEmployees] = useState<Record<string, any>[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const fetchListingDetails = async () => {
      try {
        setLoading(true);
        setError("");

        if (!reference) {
          setShow(null);
          setLoading(false);
          return;
        }

        // ✅ IMPORTANT:
        // Use your actual API base if needed, e.g.
        const url = `${import.meta.env.VITE_API_URL}/listing_details/${encodeURIComponent(reference)}`
        // For same-domain backend, this relative path is fine:
        // const url = `/listing_details/${encodeURIComponent(reference)}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const json = (await res.json()) as ApiResponse;

        if (!res.ok || !json?.status) {
          throw new Error((json as any)?.message || "Failed to fetch listing details");
        }
        setListings(json.data.listing || []);
        setAmenities(json.data.amenities || []);
        setEmployees(json.data.employee ? [json.data.employee] : []);
        setImages(json.data.images || []);

        if (isMounted) setShow(json);
      } catch (e: any) {
        if (isMounted) {
          setError(e?.message || "Something went wrong");
          setShow(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchListingDetails();

    return () => {
      isMounted = false;
    };
  }, [reference]);

  const property = useMemo(() => {
    const listing = show?.data?.listing;
    if (!listing) return null;

    const images = show?.data?.images || [];
    const amenities = show?.data?.amenities || [];
    const employee = show?.data?.employee || null;

    // Shape data to match existing UI components WITHOUT changing UI/CSS
    return {
      ...listing,
      images, // Gallery uses this
      amenities,
      employee,
      is_favorite: listing?.is_favorite ?? 0,

      // Used by RecommendedProperties
      property_type: { name: listing?.property_type || "" },
      location: listing?.sub_community || listing?.community || "",

      // MortgageCalculator
      converted_price: Number(listing?.price || 0),
    };
  }, [show]);

  const id = property?.id?.toString();

  return (
    <>
      <Helmet>
        <title>{property?.title || "Property Details"}</title>
        <meta
          name="description"
          content={
            (property?.description &&
              typeof property.description === "string" &&
              property.description.replace(/<[^>]*>/g, "").slice(0, 160)) ||
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
          {/* OPTIONAL: keep UI same, but prevent crashes if data missing */}
          {/* If you already have loaders inside components, you can remove this */}
          {error ? (
            <div className="py-10">
              <p className="text-center text-red-600">{error}</p>
            </div>
          ) : null}

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <HeaderSingleProperty is_favorite={property?.is_favorite} />
          </motion.div>

          {/* Gallery - Full Width */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5"
          >
            {/* Pass loading as "status" if your Gallery expects react-query status.
                Many implementations just check truthy/falsy; this keeps UI intact. */}
            <Gallery item={images} status={loading ? "pending" : "success"} />
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
                <InfoProperty item={listings} employee={employees[0]} amenities={amenities} />
              </motion.div>

              {/* Property Map */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <PropertyMap property={property} />
              </motion.div> */}
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <BoxForm item={property} employee={employees[0]} />
              </motion.div>
            </div>
          </div>

          {/* Mortgage Calculator - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className=""
          >
            <MortgageCalculator propertyPrice={listings?.price || 0} />
          </motion.div>

          {/* Recommended Properties */}
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 mb-20"
          >
            <ExploreProperty />
            {/* <RecommendedProperties
              currentPropertyId={id || ""}
              propertyType={property?.property_type?.name}
              location={property?.location}
            /> */}
          </motion.div>
      </div>
    </>
  );
};

export default SingleProperty;
