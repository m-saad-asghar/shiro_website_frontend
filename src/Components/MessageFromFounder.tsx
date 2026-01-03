import React, { useEffect, useState } from "react";
import employeeImagesUrl from "@/helpers/employeeImagesURL";
import { useTranslation } from "react-i18next";

type Founder = {
  id: number;
  name: string;          // ✅ ADD THIS LINE
  position: string;
  position_id: number;
  image: string;
  message: string;
  created_at: string;
  updated_at: string;
};

const MessageFromFounder: React.FC = () => {
  const [founder, setFounder] = useState<Founder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const { t } = useTranslation();

  useEffect(() => {
    const fetchFounder = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_URL}/fetch_message_from_founder`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              name: "Mr. Jamil Shiro",
            }),
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const json: {
          status: boolean;
          data: Founder | null;
        } = await res.json();

        if (json.status && json.data) {
          setFounder(json.data);
        } else {
          setFounder(null);
          setError("No data found");
        }
      } catch (err) {
        setFounder(null);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFounder();
  }, [API_URL]);

  return (
   <section className="w-full flex">
  
  {/* FULL GREEN WRAPPER */}
  <div className="bg-[#0b4a35] text-white">

    {/* CENTERED QUOTE */}
   {/* <div className="px-8 sm:px-12 lg:px-18 pt-12 pb-12 lg:pt-18 lg:pb-18 text-center">
      <h1 style={{fontWeight: 600}} className="custom_container text-center !text-[#9f8151] hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
        {t("EXCELLENCE BEYOND COMPARE")}
      </h1>
    </div> */}

    {/* CONTENT GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-2  leadership_styling_inside">

      {/* LEFT SECTION */}
      <div className="px-6 sm:px-10 lg:px-16 py-12 lg:py-20 flex items-center">
        <div className="max-w-xl w-full">

          {/* <h2 className="font-semibold text-2xl !text-white mb-6">
            "{t("Message From")} {founder?.position || t("Founder")}"
          </h2> */}

          {loading && (
            <p className="text-white/80 text-sm">
              Loading message...
            </p>
          )}

          {!loading && error && (
            <p className="text-red-200 text-sm">{error}</p>
          )}

         {!loading && !error && founder && (
  <>
    <p
      className="down_styling para_styling !text-white"
      dangerouslySetInnerHTML={{
        __html: founder.message,
      }}
    />

    {/* NAME AFTER MESSAGE */}
   <p className="mt-[10px] text-white font-medium !text-[#9f8151] font-semibold">
      {founder.name}{", "}
      {founder.position}
    </p>
  </>
)}

        </div>
      </div>

      {/* RIGHT SECTION (IMAGE) */}
      <div className="w-[270px] h-[270px] rounded-full overflow-hidden bg-gray-100 shadow-sm">
        {!loading && founder?.image ? (
          <img
            src={employeeImagesUrl(founder.image)}
            alt={founder.position || "Founder"}
            className="w-full h-full cursor-pointer object-cover transition-transform ease-in-out hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/70">
            {loading ? "Loading image..." : "No image available"}
          </div>
        )}
      </div>

    </div>
  </div>
</section>

  );
};

export default MessageFromFounder;