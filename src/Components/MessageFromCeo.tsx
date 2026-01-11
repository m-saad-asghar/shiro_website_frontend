import React, { useEffect, useState } from "react";
import employeeImagesUrl from "@/helpers/employeeImagesURL";
import { useTranslation } from "react-i18next";

type Founder = {
  id: number;
  name: string;
  position: string;
  position_id: number;
  image: string;
  message: string;
  created_at: string;
  updated_at: string;
};

const MessageFromceo: React.FC = () => {
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

        const res = await fetch(`${API_URL}/fetch_message_from_founder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: "Ali Sulaiman",
          }),
        });

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const json: { status: boolean; data: Founder | null } =
          await res.json();

        if (json.status && json.data) {
          setFounder(json.data);
        } else {
          setFounder(null);
          setError("No data found");
        }
      } catch {
        setFounder(null);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFounder();
  }, [API_URL]);

  return (
    <section className="change_border border border-primary/20 bg-white shadow-sm">
      {/* same padding as reference */}
      <div className="px-[20px] py-[20px] sm:px-[20px] sm:py-[20px] md:px-[20px] md:py-[20px] lg:px-[45px] lg:py-[45px]">
        {/* ✅ SAME layout as MessageFromFounder reference: mobile stack (image top), desktop 2 columns */}
        <div className="flex flex-col gap-2 lg:gap-3 lg:grid lg:grid-cols-2 lg:items-center">
          
          {/* IMAGE (mobile top, desktop right) */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-[200px] sm:w-[240px] lg:w-[270px] aspect-square rounded-full overflow-hidden bg-gray-100 shadow-sm">
              {!loading && founder?.image ? (
                <img
                  src={employeeImagesUrl(founder.image)}
                  alt={founder.position}
                  className="w-full h-full object-cover transition-transform duration-300 lg:hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/60">
                  {loading ? "Loading image..." : "No image available"}
                </div>
              )}
            </div>
          </div>

          {/* TEXT (mobile below image, desktop left) */}
          <div className="order-2 lg:order-1 flex items-center">
            <div className="w-full max-w-none lg:max-w-2xl">
              {loading && (
                <p className="text-primary/70 text-sm">Loading message...</p>
              )}

              {!loading && error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {!loading && !error && founder && (
                <>
                  <p
                    className="down_styling para_styling message_font !text-[#0b4a35] w-full max-w-none text-left leading-relaxed text-[16px] sm:text-[18px] lg:text-[18px]"
                    style={{
                      wordBreak: "normal",
                      overflowWrap: "normal",
                      hyphens: "none",
                      whiteSpace: "normal",
                    }}
                    dangerouslySetInnerHTML={{ __html: founder.message }}
                  />

                  <p className="mt-4 message_font text-[#9f8151] flex flex-col leading-tight">
  <span className="font-bold">{founder.name}</span>
  <span>{founder.position}</span>
</p>

                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MessageFromceo;
