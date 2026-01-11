// useContactDataServices.ts
import { useMemo } from "react";
import type { ContactDataService } from "../../../Types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ✅ Icons
import {
  MdOutlineLocationOn,
  MdOutlineSchedule,
  MdOutlineSupportAgent,
  MdOutlineBusiness,
} from "react-icons/md";

const ICON_CLASS =
  "text-[#0b4a35] w-15 h-15 mb-4 transition-transform duration-300 group-hover:scale-110";

const useContactDataServices = (): ContactDataService[] => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMemo(
    () => [
      {
        id: 1,
        icon: <MdOutlineLocationOn className={ICON_CLASS}  />,
        title: t("Convenient Locations"),
        desc: t(
          "Our offices are situated in key areas of the city for your ease of access."
        ),
        
        
      },
      {
        id: 2,
        icon: <MdOutlineSchedule className={ICON_CLASS} />,
        title: t("At a Time That Suits You"),
        desc: t(
          "We work around your schedule to discuss your goals without rushing."
        ),
    
       
      },
      {
        id: 3,
        icon: <MdOutlineSupportAgent className={ICON_CLASS} />,
        title: t("Experts at Your Service"),
        desc: t(
          "Receive comprehensive support from professionals with deep market expertise at every stage of your investment journey."
        ),
       
       
      },
      {
        id: 4,
        icon: <MdOutlineBusiness className={ICON_CLASS} />,
        title: t("Office in Dubai"),
        desc: t(
          "Meet the Shiro Estate team in person and explore the best strategies to achieve your real estate objectives."
        ),
       
       
      },
    ],
    [t, navigate]
  );
};

export default useContactDataServices;