import { useEffect, useMemo, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { LoaderPage } from "@/Components";
import employeeImagesUrl from "@/helpers/employeeImagesURL";
import empImagesUrl from "@/helpers/empImagesURL";
import { useNavigate } from "react-router-dom";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carousel";

interface TeamMember {
  id: number | string;
  name: string;
  position: string;
  slug: string;
  profile_picture: string | null;
}

const AllOurTeamCarausal: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/fetch_employees`;
  const PLACEHOLDER = empImagesUrl("default_employee.png");

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

        if (res.ok && json?.status === 1 && Array.isArray(json?.data)) {
          setTeam(json.data);
        } else {
          setError(t("Failed to load team members"));
          setTeam([]);
        }
      } catch {
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

  const items = useMemo(() => team ?? [], [team]);

  if (loading) {
    return (
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="custom_container mx-auto px-4">
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
        <div className="custom_container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-600 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="custom_container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-600 text-lg">{t("No team members found")}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 lg:py-13 pb-20 lg:pb-20">
      <div className="custom_container mx-auto relative">
         <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
        {t("Leadership")}
      </h1>
        {/* ✅ Shadcn Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          {/* ✅ Arrows around like screenshot */}
          <CarouselPrevious className="hidden lg:flex absolute -left-10 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50" />
          <CarouselNext className="hidden lg:flex absolute -right-10 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50" />

          <CarouselContent className="py-16">
            {items.map((m) => {
              const imgSrc = m.profile_picture
                ? empImagesUrl(m.profile_picture)
                : PLACEHOLDER;

              return (
                <CarouselItem
                  key={m.id}
                  className="
                    basis-full
                    sm:basis-1/2
                    md:basis-1/3
                    xl:basis-1/4
                  "
                >
                  {/* ✅ Card UI unchanged */}
                  <div className="flex flex-col items-center text-center">
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

                    <h3 className="mt-6 font-semibold text-primary text-2xl">
                      {m.name}
                    </h3>

                    <p className="mt-1 font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
                      {m.position}
                    </p>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      <div style={{display:'flex', justifyContent:'center'}}>
        <button onClick={() => navigate("/team")}
        type="submit" 
        className="search_btn_styling change_border rounded-[4px] font-NeueHaasGrotesk !text-[16px] md:text-[14px] capitalize flex-center cursor-pointer search_btn_styling h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold change_border transition-all duration-[.4s] flex items-center justify-center gap-2 flex-center w-fit min-h-[50px] min-w-[200px] disabled:opacity-70 disabled:cursor-not-allowed">{t("Meet Our Team")}</button>
      </div>
    </section>
  );
};

export default AllOurTeamCarausal;
