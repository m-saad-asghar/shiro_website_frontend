import useQueryGet from "@/hooks/useQueryGet";
import { Helmet } from "react-helmet";
import { ContactForm, Partners, StayInTheLoop } from "@/Sections/Home";
import { AllServices, Hero, ServicesAgency } from "@/Sections/Services";
import OurServices from "@/Services/OurServices";

const Services = () => {
  const { data: allServices, status } = useQueryGet(
    ["allServices"],
    OurServices.AllServices
  );

  return (
    <>
      <Helmet>
        <title>Real Estate Services in Dubai | Shiro Property Solutions</title>
        <meta
          name="description"
          content="Comprehensive real estate services in Dubai including property sales, rentals, management, and investment consultation. Professional solutions for all your property needs."
        />
      </Helmet>
      <div className="w-full h-full pt-[70px] md:pt-[80px] lg:pt-[70px]">
        <Hero />
        <ServicesAgency />
        <AllServices item={allServices?.services} status={status} />
        {/* <OurChannel /> */}
        <Partners conClass="bg-light" />
        <ContactForm />
        <StayInTheLoop />
      </div>
    </>
  );
};

export default Services;
