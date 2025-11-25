import { Btn } from "@/Components";
import Icons from "@/Constants/Icons";
import { useTranslation } from "react-i18next";

const Hero = () => {
    const { t } = useTranslation();
  
  return (
    <div className="container h-full ">
      <p className="text-[12px] md:text-[16px] font-[400] text-primary capitalize py-[16px]">
        {t("Home")} / {t("about")}
      </p>
      <div className="w-full lg:w-[50%] m-auto  flex-center flex-col gap-[25px]">
        <h1 className="text-[32px] md:text-[40px] lg:text-[56px] font-[600] text-primary text-center">
          {t("We take pride in our diversity.")}
        </h1>
        <p className="text-[14px] md:text-[16px] font-[400] text-dark text-center md:text-start">
          {t("At shiro, we are your one-stop-shop for all things real estate.")}
        </p>
        <div className="w-full justify-center flex-col md:flex-row gap-[20px] items-center">
            <div className="w-full md:w-[218px]">
                <Btn type="primary" text={t("meet our team")} isIcons=<Icons.RxArrowTopRight/> conClass="flex-row-reverse items-center gap-[10px] font-[600]"/>
            </div>
            <div className="w-full md:w-[218px]">
                <Btn type="secandry" text={t("contact our team")} conClass="flex-row-reverse items-center gap-[10px] font-[600]" isIcons=<Icons.MdPhoneIphone />  />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
