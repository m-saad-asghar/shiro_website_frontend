import { Helmet } from "react-helmet";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import areaImagesUrl from "@/helpers/areaImagesURL";
import { motion } from "framer-motion";
import ListingBySlug from "@/Sections/Home/ListingsBySlug";
import { useNavigate } from "react-router-dom";
import ProjectsByCommunity from "./ProjectsByCommunity";
import ProjectFaq from "./ProjectFaq";

// ✅ SAME Search component as reference
import AreaSearch from "@/Sections/Buy/AreaSearch";

// ✅ SAME filter calls as reference
import useQueryGet from "@/hooks/useQueryGet";
import PropertiesServices from "@/Services/PropertiesServices";
import DevelopersServices from "@/Services/DevelopersServices";

// ✅ SAME context as reference
import { ValueContext } from "@/Context/ValueContext";
import { he } from "date-fns/locale";

type AreaDetailsData = {
  id: number;
  name: string;
  slug: string;
  main_image: string | null;
  description: string | null;
  selling_point: string | null;
  about: string | null;
};

type AreaDetailsResponse = {
  success: boolean;
  data: AreaDetailsData | null;
  message?: string;
};

const AreaDetails = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // ✅ area details state
  const [areaDetails, setAreaDetails] = useState<AreaDetailsData | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  // ✅ Search context
  const { values, setValues, valueSearch, setValueSearch, searchId, setSearchId } =
    useContext(ValueContext);

  // ✅ Filters for <Search />
  const { data: filter } = useQueryGet(["filter"], PropertiesServices.filters);
  const { data: filterDeveloper } = useQueryGet(
    ["filterDeveloper"],
    DevelopersServices.developer
  );

  // ✅ fetch_area_details/{slug} on page load
  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    (async () => {
      try {
        setStatus("loading");

        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_BASE_URL}/fetch_area_details/${slug}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        const json: AreaDetailsResponse = await res.json();

        if (!res.ok || !json?.success || !json?.data) {
          setAreaDetails(null);
          setStatus("error");
          return;
        }

        setAreaDetails(json.data);
        setStatus("success");
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          console.error("fetch_area_details error:", e);
          setAreaDetails(null);
          setStatus("error");
        }
      }
    })();

    return () => controller.abort();
  }, [slug]);

  // ✅ PRESELECT slug as COMMUNITY in <Search />
  useEffect(() => {
    if (!areaDetails) return;

    setValueSearch([
      {
        id: areaDetails.id,
        name: areaDetails.name,
        slug: areaDetails.slug,
        type: "community",
      },
    ]);

    setSearchId([areaDetails.id]);

    setValues((prev: any) => ({
      ...(prev || {}),
      search: "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaDetails]);

  return (
    <>
      <Helmet>
        <title>Dubai Property Areas | Shiro Real Estate Partners</title>
        <meta
          name="description"
          content="Explore Dubai’s prime areas. Browse top communities and locations for investment and living."
        />
      </Helmet>

      {/* ✅ HERO SECTION */}
      <div className="relative w-full h-[91vh] overflow-hidden developer_listing_styling">
        {/* <img
          src={
            areaDetails?.main_image
              ? areaImagesUrl(areaDetails.main_image)
              : areaImagesUrl("areas_main_image.avif")
          }
          alt={areaDetails?.name || "Area Main Image"}
          className="w-full h-full object-cover"
        /> */}

         <img
  src={
            areaDetails?.main_image
              ? areaImagesUrl(areaDetails.main_image)
              : areaImagesUrl("areas_main_image.avif")
          }
          alt={areaDetails?.name || "Area Main Image"}
  className="w-full h-full object-cover"
  loading="eager"
  decoding="async"
  fetchPriority="high"
/>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

        {/* ✅ DETAILS FIRST */}
        <div className="custom_container develop_heading_styling">
          <h1 className="hidden md:block project_text font-bold !text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {areaDetails?.name || t("Loading Area...")}
          </h1>

          <p className="text-sm sm:text-base">
            <span className="text-white text-xl">{areaDetails?.description || ""}</span>
          </p>

          <div className="mt-6 w-full md:w-2/2">
            <AreaSearch
              from="buy"
              options={null}
              item={filter}
              filterDeveloper={filterDeveloper}
              values={values ?? {}}
              valueSearch={valueSearch ?? []}
              setValueSearch={setValueSearch}
              setSearchId={setSearchId}
              searchId={searchId ?? []}
              setValues={setValues}
              onClick={() => {
                console.log("[AreaDetails] Search clicked", {
                  slug,
                  selected: valueSearch,
                  ids: searchId,
                  values,
                });
              }}
            />
          </div>

          {status === "loading" && (
            <p className="text-white mt-2 text-sm">{t("Loading...")}</p>
          )}

          {status === "error" && (
            <p className="text-white mt-2 text-sm">
              {t("Failed to load area details")}
            </p>
          )}

          
        </div>
      </div>

      {/* ✅ CONTENT */}
      <div className="custom_container py-10 lg:py-20 pb-0 lg:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 style={{paddingBottom: 15}} className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {t("About")} {areaDetails?.name || ""}
          </h1>

          <div
            className="down_styling para_styling"
            dangerouslySetInnerHTML={{ __html: areaDetails?.about || "" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 style={{paddingBottom: 15}} className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {t("Why")} {areaDetails?.name || ""}
          </h1>

          <div
            className="down_styling para_styling"
            dangerouslySetInnerHTML={{ __html: areaDetails?.selling_point || "" }}
          />
        </motion.div>
      </div>

      <ListingBySlug community_name={areaDetails?.name || ""} />

      <div className="w-full flex justify-center items-center ">
        <button
  type="button"
  onClick={() =>
    navigate(`/buy/properties-for-sale?search=${encodeURIComponent(areaDetails?.slug || "")}`)
  }
  className="search_btn_styling change_border rounded-[4px] font-NeueHaasGrotesk !text-[16px] md:text-[14px] capitalize cursor-pointer h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold transition-all duration-[.4s] min-h-[50px] min-w-[200px]"
>
  {t("Explore More Properties")}
</button>
      </div>
     
     <div className="custom_container py-10 lg:py-20 pt-0 lg:pt-0">
       <ProjectsByCommunity community_name={areaDetails?.name || ""} />
     </div>

     {/* <div>
      <ProjectFaq faqs={projects?.faqs || []} />
     </div> */}

    </>
  );
};

export default AreaDetails;
