import { DataCustomerServices } from "../../assets/Data/Home";
import { Card } from "../../Components/Home/CustomerService";
import { useTranslation } from "react-i18next";

const CustomerService = () => {
  const { t } = useTranslation();

  const renderCard = DataCustomerServices().map((item) => (
    <div key={item.id} className="transition-all duration-300">
      <Card item={item} />
    </div>
  ));

  return (
    <section className="w-full py-12 md:py-2 lg:py-4">
      <div className="container mx-auto px-4">
        <h2 className="text-[24px] md:text-[32px] text-primary font-[600] text-center">
          {t("Dubai real estate solutions focused around excellent")}
          <br className=" hidden lg:flex" /> {t("customer service.")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-[25px] gap-[20px] lg:mt-[50px] ">
          {renderCard}
        </div>
      </div>
    </section>
  );
};

export default CustomerService;
