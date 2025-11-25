import useQueryGet from "@/hooks/useQueryGet";
import { Helmet } from "react-helmet";
import { Deatils, Map, RecommendedForYou } from "@/Sections/ContactUs";
import { StayInTheLoop } from "@/Sections/Home";
import StaticServices from "@/Services/StaticServices";

const ContactUs = () => {
  const { data: contactUs, status } = useQueryGet(
    ["contactUs"],
    StaticServices.contact
  );

  return (
    <>
      <Helmet>
        <title>Contact Shiro Real Estate Dubai | Get in Touch Today</title>
        <meta
          name="description"
          content="Contact Shiro Real Estate for all your property needs in Dubai. Visit our office, call us, or send a message. Expert real estate consultation available."
        />
      </Helmet>
      <>
        <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
          {/* <Bennar
            pathName="Contact"
            title="Contact Shiro"
            desc="Shiro is dedicated to providing outstanding service across Dubai and even beyond. This is your direct line to our experienced team, whether you're questioning, seeking information, or requiring personalized help. Your needs come first, and we're here to make sure every interaction with us leaves you feeling heard, valued, and empowered."
          /> */}
          <Deatils item={contactUs?.contact_info?.office} status={status} />
          <Map />
          <RecommendedForYou />
          <StayInTheLoop />
        </div>
      </>
    </>
  );
};

export default ContactUs;
