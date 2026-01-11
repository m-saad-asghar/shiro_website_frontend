import { useEffect, useMemo, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { LoaderPage } from "@/Components";
import ContactDataServicesType from "@/assets/Data/Home//ContactDataServicesType";
import CardWithIcons from "@/Components/Home/CustomerService/CardWithIcons";
import { useNavigate } from "react-router-dom";

const Details: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const renderCard = ContactDataServicesType().map((item) => (
    <div key={item.id} className="transition-all duration-300 cards_styling">
      <CardWithIcons item={item} />
    </div>
  ));

  return (
    <>
    <section className="py-10 lg:py-20">
      <div className="custom_container mx-auto px-4">
         <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
        {t("Need Assistance?")}
      </h1>
       <p className="down_styling para_styling">
                {t(
            "Shiro Estate — your trusted real estate expert in the UAE and beyond. Combining strategic thinking, deep market knowledge, and a personalized approach, we help clients invest intelligently and professionally manage assets across the world’s most promising markets."
          )}
</p>

      </div>

      <div className="custom_container py-10 lg:py-15">
         <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
        {t("Your Success Begins with a Personal Meeting")}
      </h1>
       <p className="down_styling para_styling">
                {t(
            "We invite you for a one-on-one real estate consultation at one of our Dubai offices. Let us help turn your plans into reality."
          )}
</p>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-[25px] gap-[20px] lg:mt-[50px] ">
          {renderCard}
        </div>

      </div>

      <div className="custom_container mx-auto px-4">
         <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
        {t("Discover Shiro Estate")}
      </h1>
       <p className="down_styling para_styling">
                {t(
            "Explore our exclusive collection of premium properties and bespoke real estate services designed to meet the highest standards of excellence."
          )}
</p>

<div style={{marginTop: 40, justifyContent: 'center', display: 'flex'}}>
   <button
          type="button"
          onClick={() => navigate("/buy/properties-for-sale")}
          className="search_btn_styling change_border font-NeueHaasGrotesk !text-[16px] md:text-[14px] capitalize flex-center cursor-pointer search_btn_styling h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold change_border transition-all duration-[.4s] flex items-center justify-center gap-2 flex-center w-fit min-h-[50px] min-w-[200px] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Explore Properties
        </button>
</div>

      </div>
    </section>
    </>
  );
};

export default Details;