// src/Pages/TeamDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import employeeImagesUrl from "@/helpers/employeeImagesURL";
import AgentProperties from "../Home/AgentProperties";

type Employee = {
  id: number;
  name: string;
  slug: string;
  position: string;
  description: string | null;
  profile_picture: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  brn?: number | null;
};

type Listing = {
  id: number;
  reference?: string | null;
  title?: string | null;
  price?: number | string | null;
  bedrooms?: string | null;
  bathrooms?: string | null;
  community?: string | null;
  sub_community?: string | null;
  property?: string | null;
  active?: number | null;
  is_featured?: number | null;
  images?: any;
  [key: string]: any;
};

type ApiResponse = {
  status: number;
  data: Employee;
  listings?: Listing[];
};

export default function TeamDetails() {
  const { slug } = useParams<{ slug: string }>();
  const PLACEHOLDER = employeeImagesUrl("default_employee.png");

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    const base = String(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
    const url = `${base}/fetch_employee_details/${encodeURIComponent(slug)}`;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(url, { headers: { Accept: "application/json" } });
        const j = (await res.json()) as ApiResponse;

        if (!res.ok || !j || j.status !== 1 || !j.data) {
          throw new Error("Employee not found.");
        }

        if (!isMounted) return;

        setEmployee(j.data);
        setListings(Array.isArray(j.listings) ? j.listings : []);
      } catch (e: any) {
        if (!isMounted) return;
        setEmployee(null);
        setListings([]);
        setError(e?.message || "Something went wrong.");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const imgSrc = useMemo(() => {
    if (!employee?.profile_picture) return PLACEHOLDER;
    return employeeImagesUrl(employee.profile_picture);
  }, [employee?.profile_picture, PLACEHOLDER]);

  if (loading) return null;
  if (error || !employee) return null;

  return (
    <div>
      <section className="custom_container mx-auto px-4 py-8 property_container_styling !pb-0">
        {/* ✅ Tight grid like reference */}
        <div className="grid grid-cols-12 gap-x-2 items-start">
          {/* IMAGE */}
          <div className="col-span-12 md:col-span-3">
            <div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 shadow-sm">
                <img
                  src={imgSrc}
                  alt={employee.name}
                  className="absolute inset-0 w-full h-full object-cover pt-[25px] md:pt-0"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
                  }}
                />
              </div>
            </div>

            {/* Meta */}
            <div className="mt-6">
              <p className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151] uppercase flex justify-center md:block">
                {employee.position}
              </p>

              <h2 className="font-semibold text-primary text-2xl flex justify-center md:block">
                {employee.name}
              </h2>

              {employee.brn ? (
                <p className="rounded-lg text-sm transition-all duration-200 mb-1 mt-1 text-[#9f8151] text_stying flex justify-center md:block">
                  BRN#: {employee.brn}
                </p>
              ) : null}

              <div className="w-full flex items-center justify-center md:items-start md:justify-start">
                {/* EMAIL */}
                {employee.email ? (
                  <a
                    href={`mailto:${employee.email}?subject=${encodeURIComponent(
                      "Website Inquiry | Shiro Estate"
                    )}&body=${encodeURIComponent(
                      `Hi ${employee.name},\n\nI’m reaching out via the Shiro Estate website. I’m interested in one of the properties managed by Shiro Estate and would like more details.\n\nPlease share availability, pricing, and next steps.\n\nThank you,`
                    )}`}
                    aria-label={`Email ${employee.name}`}
                    title="Email"
                    className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="50"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9f8151"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <polyline points="3 7 12 13 21 7" />
                    </svg>
                  </a>
                ) : null}

                {/* WHATSAPP */}
                {employee.whatsapp ? (
                  <a
                    href={`https://wa.me/${String(employee.whatsapp)
                      .replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Hi ${employee.name},\n\nI’m reaching out through the Shiro Estate website. I’m interested in one of the properties represented by Shiro Estate and would like more information.\n\nCould you please share availability, pricing, and the next steps?\n\nThank you.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${employee.name}`}
                    title="WhatsApp"
                    className="w-11 h-11 flex items-center justify-center hover:opacity-80 transition"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                      alt="WhatsApp"
                      className="w-15 h-15"
                      loading="lazy"
                    />
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {/* TEXT */}
          <div className="col-span-12 md:col-span-9 mt-8 md:mt-0 md:pl-4">
            <h3 style={{paddingBottom: 15}} className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
              About {employee.name}
            </h3>

            <div
              className="down_styling para_styling"
              dangerouslySetInnerHTML={{ __html: employee.description || "" }}
            />
          </div>
        </div>
      </section>

      {/* ✅ Pass listings from API to AgentProperties */}
      <div>
        <AgentProperties listings={listings} />
      </div>
    </div>
  );
}