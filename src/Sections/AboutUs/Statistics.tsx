import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";

const GOLD = "#9f8151";

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-8 h-8 flex items-center justify-center shrink-0">
    {children}
  </div>
);

const Statistics: FC = () => {
  const { t } = useTranslation();

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasStarted = useRef(false);

  const [years, setYears] = useState(0);
  const [properties, setProperties] = useState(0);
  const [clients, setClients] = useState(0);
  const [success, setSuccess] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          startCounting();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const startCounting = () => {
    const duration = 4000; // 5 seconds
    const interval = 50;
    const steps = duration / interval;

    const targets = {
      years: 20,
      properties: 1000,
      clients: 500,
      success: 98,
    };

    let step = 0;

    const timer = setInterval(() => {
      step++;

      setYears(Math.min(Math.round((targets.years / steps) * step), targets.years));
      setProperties(
        Math.min(Math.round((targets.properties / steps) * step), targets.properties)
      );
      setClients(
        Math.min(Math.round((targets.clients / steps) * step), targets.clients)
      );
      setSuccess(
        Math.min(Math.round((targets.success / steps) * step), targets.success)
      );

      if (step >= steps) clearInterval(timer);
    }, interval);
  };

  return (
    <section ref={sectionRef} className="py-22 lg:py-22 !pb-24">
      <div className="custom_container mx-auto px-4">
        <h1 className="ach_spacing hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">Achievements</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex gap-4 px-6 py-6 relative">
            <span className="absolute left-0 top-0 h-full w-[1px]" style={{ backgroundColor: GOLD }} />
            <IconWrapper>
              <Icons.IoIosArrowUp style={{ color: GOLD, fontSize: 28 }} />
            </IconWrapper>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2 !text-[#9f8151]">{years}+</h3>
              <p className="text-sm text-gray-600 font-medium !text-[#0b4a35] font-semibold">{t("Years of Experience")}</p>
            </div>
          </div>

          <div className="flex gap-4 px-6 py-6 relative">
            <span className="absolute left-0 top-0 h-full w-[1px]" style={{ backgroundColor: GOLD }} />
            <IconWrapper>
              <Icons.IoHomeOutline style={{ color: GOLD, fontSize: 28 }} />
            </IconWrapper>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2 !text-[#9f8151]">{properties}+</h3>
              <p className="text-sm text-gray-600 font-medium !text-[#0b4a35] font-semibold">{t("Properties Sold")}</p>
            </div>
          </div>

          <div className="flex gap-4 px-6 py-6 relative">
            <span className="absolute left-0 top-0 h-full w-[1px]" style={{ backgroundColor: GOLD }} />
            <IconWrapper>
              <Icons.IoPerson style={{ color: GOLD, fontSize: 28 }} />
            </IconWrapper>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2 !text-[#9f8151]">{clients}+</h3>
              <p className="text-sm text-gray-600 font-medium !text-[#0b4a35] font-semibold">{t("Happy Clients")}</p>
            </div>
          </div>

          <div className="flex gap-4 px-6 py-6 relative">
            <span className="absolute left-0 top-0 h-full w-[1px]" style={{ backgroundColor: GOLD }} />
            <IconWrapper>
              <Icons.IoStar style={{ color: GOLD, fontSize: 28 }} />
            </IconWrapper>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2 !text-[#9f8151]">{success}%</h3>
              <p className="text-sm text-gray-600 font-medium !text-[#0b4a35] font-semibold">{t("Success Rate")}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Statistics;
