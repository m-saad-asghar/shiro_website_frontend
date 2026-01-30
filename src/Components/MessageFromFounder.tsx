import React, { useEffect, useState } from "react";
import empImagesUrl from "@/helpers/empImagesURL";
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

const MessageFromFounder: React.FC = () => {
  const [founder, setFounder] = useState<Founder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const { t } = useTranslation();

  useEffect(() => {
    const fetchFounder = async () => {
      try {
        setLoading(true);
        setError(null);

         const params = new URLSearchParams({
  name: "Jamil Shiro",
});

const res = await fetch(
  `${API_URL}/fetch_message_from_founder?${params.toString()}`,
  {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }
);

        // const res = await fetch(`${API_URL}/fetch_message_from_founder`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Accept: "application/json",
        //   },
        //   body: JSON.stringify({ name: "Jamil Shiro" }),
        // });

        const json = await res.json();

        if (json.status && json.data) {
          setFounder(json.data);
        } else {
          setError(t("No data found"));
        }
      } catch {
        setError(t("Something went wrong"));
      } finally {
        setLoading(false);
      }
    };

    fetchFounder();
  }, [API_URL, t]);

  return (
    <section className="border border-primary/20 bg-white shadow-sm change_border">
      <div className="px-5 py-5 lg:px-11 lg:py-11">
        {/* Layout */}
        <div className="flex flex-col lg:flex-row  gap-5">
          
          {/* IMAGE */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end flex-shrink-0">
            <div
              className="
                w-[220px] h-[220px]
                sm:w-[250px] sm:h-[250px]
                lg:w-[280px] lg:h-[280px]
                rounded-full overflow-hidden
                bg-[#d6cdc9] shadow-sm
              "
            >
              {!loading && founder?.image ? (
                <img
                  src={empImagesUrl(founder.image)}
                  alt={founder.name}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/60 text-sm">
                  {loading ? t("Loading image...") : t("No image available")}
                </div>
              )}
            </div>
          </div>

          {/* TEXT */}
          <div className="order-2 lg:order-1 flex-1 flex items-center">
            <div className="w-full max-w-2xl">
              {loading && (
                <p className="text-primary/70 text-sm">
                  {t("Loading message...")}
                </p>
              )}

              {!loading && error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {!loading && !error && founder && (
                <>
                  <p
                    className="para_styling down_styling message_font text-[#0b4a35] text-left leading-relaxed text-[16px] sm:text-[18px]"
                    dangerouslySetInnerHTML={{ __html: founder.message }}
                  />

                  <p className="message_font mt-4 text-[#9f8151] flex flex-col leading-tight">
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

export default MessageFromFounder;
