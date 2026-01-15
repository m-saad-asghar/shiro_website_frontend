import useQueryGet from "@/hooks/useQueryGet";
import { Helmet } from "react-helmet";
import { Deatils, Map, RecommendedForYou } from "@/Sections/ContactUs";
import { StayInTheLoop } from "@/Sections/Home";
import StaticServices from "@/Services/StaticServices";
import Details from "@/Sections/ContactUs/Details";
import {ContactForm} from "@/Sections/Home";
import ImagesUrl from "@/helpers/ImagesURL";
import { useTranslation } from "react-i18next";

const ContactUs = () => {
  const { t } = useTranslation();

  // const { data: contactUs, status } = useQueryGet(
  //   ["contactUs"],
  //   StaticServices.contact
  // );

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
      <div className="relative w-full h-[91vh] overflow-hidden developer_listing_styling">
        <img
          src={ImagesUrl("contact_us_main_page.jpg")}
          alt="Services Banner"
          className="w-full h-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent"></div>
        <div
          className="
            custom_container
            develop_heading_styling
          "
        >
        <h1 className="hidden md:block project_text font-bold !text-white drop-shadow-lg tracking-wide leading-tight content_general">
            {t("Visit Our Office")}
          </h1>

          <p className="text-sm sm:text-base">
            <span className="text-white text-xl">
              {t(
                "Our offices are located in convenient, central areas of the city. We invite you to meet us in person to discuss your goals and find the perfect real estate solution."
              )}
            </span>
          </p>

          <button
              onClick={() => {
  const section = document.getElementById("list_with_us");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}}
            className="w-fit bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 shadow-lg transition"
          >
            {t("Enquire Now")}
          </button>
        </div>
       </div>
      <div className="">
        {/* <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]"> */}
          {/* <Bennar
            pathName="Contact"
            title="Contact Shiro"
            desc="Shiro is dedicated to providing outstanding service across Dubai and even beyond. This is your direct line to our experienced team, whether you're questioning, seeking information, or requiring personalized help. Your needs come first, and we're here to make sure every interaction with us leaves you feeling heard, valued, and empowered."
          /> */}
          {/* <Deatils item={contactUs?.contact_info?.office} status={status} /> */}
          <Details />
          <div className="pb-16" id="list_with_us">
            <ContactForm/>
          </div>
          <Map />
          {/* <RecommendedForYou /> */}
          {/* <StayInTheLoop /> */}
        </div>
      </>
    </>
  );
};

export default ContactUs;
