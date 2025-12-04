import { DataCustomerServices } from "../../assets/Data/Home";
import { Card } from "../../Components/Home/CustomerService";
import { useTranslation } from "react-i18next";

const CustomerService = () => {
  const { t } = useTranslation();

  const renderCard = DataCustomerServices().map((item) => (
    <div key={item.id} className="transition-all duration-300 cards_styling">
      <Card item={item} />
    </div>
  ));

  return (
    <section className="w-full py-12 md:py-2 lg:py-4">
      <div className="custom_container mx-auto px-4">
         <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
             {t("Dubai real estate solutions focused around excellent")}
          </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-[25px] gap-[20px] lg:mt-[50px] ">
          {renderCard}
        </div>
      </div>
    </section>
  );
};

export default CustomerService;
