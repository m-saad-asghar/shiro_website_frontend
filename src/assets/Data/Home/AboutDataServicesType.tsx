// useAboutDataServices.ts
import { useMemo } from "react";
import type { AboutDataService } from "../../../Types";
import { useTranslation } from "react-i18next";

// ✅ Icons (values-focused)
import {
  MdOutlineVerified,
  MdOutlineTrendingUp,
  MdOutlineLightbulb,
  MdOutlineHandshake,
} from "react-icons/md";

const ICON_CLASS =
  "text-[#0b4a35] w-14 h-14 mb-4 transition-transform duration-300 group-hover:scale-110";

const useAboutDataServices = (): AboutDataService[] => {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        id: 1,
        icon: <MdOutlineVerified className={ICON_CLASS} />,
        title: t("Integrity"),
        desc: t(
          "We uphold the highest ethical standards and complete transparency at every stage of each transaction."
        ),
      },
      {
        id: 2,
        icon: <MdOutlineTrendingUp className={ICON_CLASS} />,
        title: t("Results"),
        desc: t(
          "We are driven by excellence and outcomes that consistently exceed client expectations."
        ),
      },
      {
        id: 3,
        icon: <MdOutlineLightbulb className={ICON_CLASS} />,
        title: t("Innovation"),
        desc: t(
          "We leverage advanced analytics and forward-thinking strategies in a highly competitive market."
        ),
      },
      {
        id: 4,
        icon: <MdOutlineHandshake className={ICON_CLASS} />,
        title: t("Trust"),
        desc: t(
          "We build long-term relationships founded on responsibility, reliability, and mutual respect."
        ),
      },
    ],
    [t]
  );
};

export default useAboutDataServices;