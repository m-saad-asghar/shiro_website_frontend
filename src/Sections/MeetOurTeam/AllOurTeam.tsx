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

  // ✅ First section (keep as is)
  const [team, setTeam] = useState<TeamMember[]>([]);

  // ✅ Second section (agents)
  const [agents, setAgents] = useState<TeamMember[]>([]);

  const [error, setError] = useState<string | null>(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/fetch_employees`;
  const EMPLOYEE_IMG_BASE = `${import.meta.env.VITE_IMAGE_URL || ""}`; // optional
  const PLACEHOLDER = employeeImagesUrl("default_employee.png");

  useEffect(() => {
    let mounted = true;

    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API_URL, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const json = await res.json();

        if (!mounted) return;

        if (res.ok && json?.status === 1) {
          // ✅ KEEP FIRST SECTION WORKING (do not touch structure)
          // if backend returns array at json.data -> setTeam(json.data)
          // if backend returns single object at json.data -> put in array
          if (Array.isArray(json?.data)) {
            setTeam(json.data);
          } else if (json?.data && typeof json.data === "object") {
            setTeam([json.data]);
          } else {
            setTeam([]);
          }

          // ✅ NEW: SECOND SECTION from json.agents
          if (Array.isArray(json?.agents)) {
            setAgents(json.agents);
          } else {
            setAgents([]);
          }
        } else {
          setError(t("Failed to load team members"));
          setTeam([]);
          setAgents([]);
        }
      } catch (e) {
        if (!mounted) return;
        setError(t("Failed to load team members"));
        setTeam([]);
        setAgents([]);
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

  // ✅ FIRST SECTION CARDS (UNCHANGED)
  const cards = useMemo(() => {
    const buildImg = (file: string | null) => {
      if (file && (file.startsWith("http://") || file.startsWith("https://")))
        return file;
      if (!file) return PLACEHOLDER;

      const path = `${EMPLOYEE_IMG_BASE}/${file}`.replace(/([^:]\/)\/+/g, "$1");
      return path;
    };

    return team.map((m) => {
      const imgSrc = m.profile_picture
        ? employeeImagesUrl(m.profile_picture)
        : PLACEHOLDER;

      return (
        <div key={m.id} className="flex flex-col items-center text-center">
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

          <h3 className="mt-6 font-semibold text-primary text-2xl">{m.name}</h3>

          <p className="mt-1 font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
            {m.position}
          </p>
        </div>
      );
    });
  }, [team, PLACEHOLDER, EMPLOYEE_IMG_BASE]);

  // ✅ SECOND SECTION CARDS (NEW: agents with images)
  const agentCards = useMemo(() => {
    return agents.map((a) => {
      const imgSrc = a.profile_picture
        ? employeeImagesUrl(a.profile_picture)
        : PLACEHOLDER;

      return (
        <div key={a.id} className="flex flex-col items-center text-center">
          <div className="w-[270px] h-[270px] rounded-full overflow-hidden bg-gray-100 shadow-sm">
            <img
              src={imgSrc}
              alt={a.name}
              className="w-full h-full cursor-pointer object-cover transition-transform ease-in-out hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
              }}
              loading="lazy"
            />
          </div>

          <h3 className="mt-6 font-semibold text-primary text-2xl">{a.name}</h3>

          <p className="mt-1 font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
            {a.position}
          </p>
        </div>
      );
    });
  }, [agents, PLACEHOLDER]);

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

  if (!team.length && !agents.length) {
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
      <section className="py-10 lg:py-20 pb-10 lg:pb-20">
        {/* ✅ FIRST SECTION (DO NOT TOUCH) */}
        <div className="custom_container mx-auto px-4">
          <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {t("Shiro Estate Professionals")}
          </h1>
          <p className="down_styling para_styling">
            {t(
              "Shiro Estate is home to a team of over 50 real estate professionals operating across the UAE and international markets. We combine in-depth market expertise with full accountability for every project — always focused on delivering results that matter to you. Our strength lies in a highly coordinated team where each specialist is an expert in their field: from investment analysis and sales to property management, legal support, and premium client service."
            )}
          </p>

          <div className="mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 py-16">
              {cards}
            </div>
          </div>
        </div>

        {/* ✅ SECOND SECTION (NOW WITH IMAGES FROM AGENTS) */}
        <div className="custom_container mx-auto px-4">
          <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {t("A Team That Speaks Your Language")}
          </h1>
          <p className="down_styling para_styling">{t("Our consultants are fluent in multiple languages, including English, Arabic, and other international languages. This allows us to work seamlessly with clients from around the world. Wherever you are and whatever language you speak, we ensure clear, comfortable, and barrier-free communication.")}</p>

          <div className="mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 py-16">
              {agentCards}
            </div>
          </div>
        </div>

        <div className="custom_container mx-auto px-4">
          <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {t("Proven Professionalism")}
          </h1>
          <p 
          className="down_styling para_styling">{t("Our advantage is real-world experience and up-to-date market knowledge. We continuously analyse market dynamics, track emerging trends, and invest in ongoing team education to stay ahead.")}
          </p><br/>
          <p 
          className="down_styling para_styling">{t("You are Always Our Top Priority.")}
          </p><br/>
           <p 
          className="down_styling para_styling">{t("We value trust and focus on building long-term relationships. For us, it’s not just about closing a deal — it’s about helping you achieve your goals.")}
          </p><br/>
          <p 
          className="down_styling para_styling">{t("With Shiro Estate, You Receive:")}
          </p><br/>
          <ul className="down_styling para_styling">
            <li>
              ✓ A dedicated personal manager guiding you from initial consultation to deal completion
            </li>
            <li>
              ✓ A tailored strategy designed around your goals
            </li>
            <li>
              ✓ Full transparency at every stage and seamless collaboration from our expert team
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default AllOurTeam;
