import { useEffect, useMemo, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { LoaderPage } from "@/Components";
import employeeImagesUrl from "@/helpers/employeeImagesURL";
import empImagesUrl from "@/helpers/empImagesURL";
import { Link } from "react-router-dom";

interface TeamMember {
  id: number | string;
  name: string;
  position: string;
  slug: string;
  profile_picture: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  description: string | null;
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
  const PLACEHOLDER = empImagesUrl("default_employee.png");

  // ✅ reduced circle size (only applies where used)
  const AGENT_AVATAR_CLASS = "w-[210px] h-[210px]"; // desktop
  const AGENT_AVATAR_CLASS_MOBILE = "w-[160px] h-[160px]"; // mobile

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
          if (Array.isArray(json?.data)) {
            setTeam(json.data);
          } else if (json?.data && typeof json.data === "object") {
            setTeam([json.data]);
          } else {
            setTeam([]);
          }

          // ✅ SECOND SECTION from json.agents
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
    return team.map((m) => {
      const imgSrc = m.profile_picture ? empImagesUrl(m.profile_picture) : PLACEHOLDER;

      const hasDescription =
        typeof m.description === "string" && m.description.trim() !== "";

      const ImageWrapper = ({ children }: { children: React.ReactNode }) =>
        hasDescription ? (
          <Link to={`/team/${m.slug}`} aria-label={`View ${m.name} profile`}>
            {children}
          </Link>
        ) : (
          <>{children}</>
        );

      return (
        <div key={m.id} className="flex flex-col items-center text-center">
          <ImageWrapper>
            <div className="w-[300px] h-[300px] rounded-full overflow-hidden bg-gray-100 shadow-sm cursor-pointer">
              <img
                src={imgSrc}
                alt={m.name}
                style={{ height: 330, width: 330 }}
                className="w-full h-full object-cover transition-transform ease-in-out hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
                }}
                loading="lazy"
              />
            </div>
          </ImageWrapper>

          <h3 className="mt-6 font-semibold text-primary text-2xl">{m.name}</h3>

          <p className="mt-1 font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
            {m.position}
          </p>
        </div>
      );
    });
  }, [team, PLACEHOLDER]);

  // ✅ SECOND SECTION CARDS (agents) — circle retained + reduced size
const agentCards = useMemo(() => {
  return agents.map((a) => {
    const imgSrc = a.profile_picture ? empImagesUrl(a.profile_picture) : PLACEHOLDER;

    const hasDescription =
      typeof a.description === "string" && a.description.trim() !== "";

    const ImageWrapper = ({ children }: { children: React.ReactNode }) =>
      hasDescription ? (
        <Link to={`/team/${a.slug}`} aria-label={`View ${a.name} profile`}>
          {children}
        </Link>
      ) : (
        <>{children}</>
      );

    return (
      <div key={a.id} className="flex flex-col items-center text-center">
        <ImageWrapper>
          {/* ✅ MUST be square + overflow-hidden + rounded-full */}
          <div className="w-[170px] md:w-[230px] lg:w-[230px] aspect-square rounded-full overflow-hidden bg-gray-100 shadow-sm cursor-pointer">
            <img
              src={imgSrc}
              alt={a.name}
              className="w-full h-full object-cover transition-transform ease-in-out hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
              }}
              loading="lazy"
            />
          </div>
        </ImageWrapper>

        <h3 className="mt-6 font-semibold text-primary text-2xl">{a.name}</h3>

        <p className="mt-1 font-semibold text-sm mb-1 text-[#9f8151]">{a.position}</p>

        {/* CONTACT ICONS */}
        <div className="w-full flex justify-center">
          {/* EMAIL */}
          {a.email && (
            <a
              href={`mailto:${a.email}?subject=${encodeURIComponent(
                "Website Inquiry | Shiro Estate"
              )}&body=${encodeURIComponent(
                `Hi ${a.name},\n\nI’m reaching out via the Shiro Estate website. I’m interested in one of the properties managed by Shiro Estate and would like more details.\n\nPlease share availability, pricing, and next steps.\n\nThank you,`
              )}`}
              aria-label={`Email ${a.name}`}
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
          )}

          {/* WHATSAPP */}
          {a.whatsapp && (
            <a
              href={`https://wa.me/${String(a.whatsapp)
                .replace(/\D/g, "")}?text=${encodeURIComponent(
                `Hi ${a.name},\n\nI’m reaching out through the Shiro Estate website. I’m interested in one of the properties represented by Shiro Estate and would like more information.\n\nCould you please share availability, pricing, and the next steps?\n\nThank you.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${a.name}`}
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
          )}
        </div>
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
          <h1
            style={{ paddingBottom: 15 }}
            className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general"
          >
            {t("United for Your Success")}
          </h1>
          <p className="down_styling para_styling">
            {t(
              "Shiro Estate is home to a team of over 50 real estate professionals operating across the UAE and international markets. We combine in-depth market expertise with full accountability for every project — always focused on delivering results that matter to you. Our strength lies in a highly coordinated team where each specialist is an expert in their field: from investment analysis and sales to property management, legal support, and premium client service."
            )}
          </p>

          <div className="mx-auto">
            {/* MOBILE: ALL STACKED */}
            <div className="flex flex-col items-center gap-8 py-16 md:hidden">
              {cards}
            </div>

            {/* DESKTOP & UP */}
            <div className="hidden md:block">
              {/* FIRST ROW – 2 CENTERED */}
              <div className="flex justify-around gap-6 md:gap-8 py-16">
                {cards.slice(0, 2)}
              </div>

              {/* REMAINING CARDS – NORMAL GRID */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-16">
                {cards.slice(2)}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ SECOND SECTION (ONLY THIS LAYOUT CHANGED) */}
        <div className="custom_container mx-auto px-4">
          <h1
            style={{ paddingBottom: 15 }}
            className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general"
          >
            {t("A Team That Speaks Your Language")}
          </h1>
          <p className="down_styling para_styling">
            {t(
              "Our consultants are fluent in multiple languages, including English, Arabic, and other international languages. This allows us to work seamlessly with clients from around the world. Wherever you are and whatever language you speak, we ensure clear, comfortable, and barrier-free communication."
            )}
          </p>

          {/* ✅ Agent cards grid:
              - Mobile: 2 columns
              - Desktop: 5 columns */}
          <div className="mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 py-16">
              {agentCards}
            </div>
          </div>
        </div>

        <div className="custom_container mx-auto px-4">
          <h1
            style={{ paddingBottom: 15 }}
            className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general"
          >
            {t("Proven Professionalism")}
          </h1>
          <p className="down_styling para_styling">
            {t(
              "Our advantage is real-world experience and up-to-date market knowledge. We continuously analyse market dynamics, track emerging trends, and invest in ongoing team education to stay ahead."
            )}
          </p>
          <br />
          <p className="down_styling para_styling">{t("You are Always Our Top Priority.")}</p>
          <br />
          <p className="down_styling para_styling">
            {t(
              "We value trust and focus on building long-term relationships. For us, it’s not just about closing a deal — it’s about helping you achieve your goals."
            )}
          </p>
          <br />
          <p className="down_styling para_styling">{t("With Shiro Estate, You Receive:")}</p>
          <br />
          <ul className="down_styling para_styling">
            <li>✓ A dedicated personal manager guiding you from initial consultation to deal completion</li>
            <li>✓ A tailored strategy designed around your goals</li>
            <li>✓ Full transparency at every stage and seamless collaboration from our expert team</li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default AllOurTeam;
