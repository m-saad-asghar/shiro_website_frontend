import { useEffect, useMemo, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { LoaderPage } from "@/Components";

const Details: FC = () => {
  const { t } = useTranslation();

  return (
    <>
    <section className="py-10 lg:py-20">
      <div className="custom_container mx-auto px-4">
         <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
        {t("Need Assistance?")}
      </h1>
       <p className="down_styling para_styling">
                {t(
            "Our team at Shiro Estate is always here to support you. Whether you're exploring real estate options, need advice on the Dubai property market, or have any questions about our services, we are ready to help."
          )}
</p><br/>
 <p className="down_styling para_styling">
                {t(
            "For any inquiries or personalized guidance, reach out to our dedicated Customer Service team at +971527186284. We are committed to providing you with the best real estate solutions and ensuring a smooth experience."
          )}
</p><br/>
 <p className="down_styling para_styling">
                {t(
            "We’re just a call away to assist you with all your property needs!"
          )}
</p>

      </div>
    </section>
    </>
  );
};

export default Details;