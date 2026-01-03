import { useEffect, useMemo, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { LoaderPage } from "@/Components";
import employeeImagesUrl from "@/helpers/employeeImagesURL";

interface TeamMember {
  id: number | string;
  name: string;
  position: string;
  slug: string;
  profile_picture: string | null;
}

const AllOurTeam: FC = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(true);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ✅ Change these if your base URL or images path differs
  const API_URL = `${import.meta.env.VITE_API_URL}/fetch_employees`;
  const EMPLOYEE_IMG_BASE = `${import.meta.env.VITE_IMAGE_URL || ""}`; // optional if you have it
  const PLACEHOLDER = employeeImagesUrl("default_employee.png");
  // const PLACEHOLDER = `${EMPLOYEE_IMG_BASE}/default_employee.png`.replace(
  //   "//default_employee.png",
  //   "/default_employee.png"
  // );

  useEffect(() => {
    let mounted = true;

    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const json = await res.json();

        if (!mounted) return;

        if (res.ok && json?.status === 1 && Array.isArray(json?.data)) {
          setTeam(json.data);
        } else {
          setError(t("Failed to load team members"));
          setTeam([]);
        }
      } catch (e) {
        if (!mounted) return;
        setError(t("Failed to load team members"));
        setTeam([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchEmployees();

    return () => {
      mounted = false;
    };
  }, [API_URL, t]);

  const cards = useMemo(() => {
    const buildImg = (file: string | null) => {
      // If backend returns absolute URL someday, keep it
      if (file && (file.startsWith("http://") || file.startsWith("https://"))) {
        return file;
      }

      if (!file) return PLACEHOLDER;

      // If you store images in something like /storage/employees/
      // adjust this path to match your backend.
      // Example: `${EMPLOYEE_IMG_BASE}/employees/${file}`
      const path = `${EMPLOYEE_IMG_BASE}/${file}`.replace(/([^:]\/)\/+/g, "$1");
      return path;
    };

   return team.map((m) => {
  const imgSrc = m.profile_picture
    ? employeeImagesUrl(m.profile_picture)
    : PLACEHOLDER;

  return (
    <div key={m.id} className="flex flex-col items-center text-center">
      {/* Image Container */}
      <div className="w-[270px] h-[270px] rounded-full overflow-hidden bg-gray-100 shadow-sm">
  <img
    src={imgSrc}
    alt={m.name}
    className="w-full h-full cursor-pointer object-cover transition-transform ease-in-out hover:scale-105"
    onError={(e) => {
      (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
    }}
    loading="lazy"
  />
</div>


      {/* Text OUTSIDE container */}
      <h3 className="mt-6 font-semibold text-primary text-2xl">
        {m.name}
      </h3>

      <p className="mt-1 font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
        {m.position}
      </p>
    </div>
  );
});

  }, [team, PLACEHOLDER, EMPLOYEE_IMG_BASE]);

  if (loading) {
    return (
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <LoaderPage message={t("Loading team members...")} size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-600 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!team.length) {
    return (
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-600 text-lg">{t("No team members found")}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
    <section className="py-10 lg:py-20 pb-10 lg:pb-10">
      <div className="custom_container mx-auto px-4">
         <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
        {t("Shiro Estate Team")}
      </h1>
       <p className="down_styling para_styling">
                {t(
            "Our robust leadership and management team is dedicated to driving excellence across all departments and property verticals in Dubai. Going beyond operational oversight, the experienced managers and senior professionals at Shiro Estate provide strategic direction, governance, and a complete suite of integrated real estate solutions."
          )}
</p>

        <div className="mx-auto">
          {/* ✅ 4 per row on xl, 1 per row on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 py-16">
            {cards}
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default AllOurTeam;
