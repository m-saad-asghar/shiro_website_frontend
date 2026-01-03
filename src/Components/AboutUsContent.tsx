// AboutUsContent.tsx
import React, { useEffect, useState } from "react";

type AboutItem = {
  title: string;
  description: string;
};

type ApiResponse = {
  status: boolean;
  data: AboutItem[];
};

const AboutUsContent: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL; // e.g. http://127.0.0.1:8000/api

  const [items, setItems] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Update the endpoint path if yours is different
        const res = await fetch(`${API_URL}/fetch_about_us_content`, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const json: ApiResponse = await res.json();

        if (json?.status && Array.isArray(json?.data)) {
          // Keep only first 3 items (Mission/Vision/Philosophy)
          setItems(json.data.slice(0, 3));
        } else {
          setItems([]);
          setError("No data found");
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setItems([]);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    return () => controller.abort();
  }, [API_URL]);

  return (
    <section className="w-full">
      {loading && (
        <p className="text-sm opacity-70">Loading content...</p>
      )}

      {!loading && error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="change_border border border-primary/20 bg-white p-6 shadow-sm"
            >
              <h3 className="font-semibold text-primary text-2xl mb-3">{item.title}</h3>

              <div
                className="down_styling para_styling"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AboutUsContent;