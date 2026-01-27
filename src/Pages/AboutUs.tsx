import useQueryGet from "@/hooks/useQueryGet";
import { Helmet } from "react-helmet";
import { BannerVideo, OurCeo } from "@/Sections/AboutUs";
import { StayInTheLoop } from "@/Sections/Home";
import StaticServices from "@/Services/StaticServices";
import { useTranslation } from "react-i18next";
import MessageFromFounder from "@/Components/MessageFromFounder";
import MessageFromCeo from "@/Components/MessageFromCeo";
import AllOurTeamCarausal from "@/Sections/MeetOurTeam/AllOurTeamCarausal";
import { Map } from "@/Sections/ContactUs";
import Statistics from "@/Sections/AboutUs/Statistics";
import ImagesUrl from "@/helpers/ImagesURL";
import { useNavigate } from "react-router-dom";
import AboutUsContent from "@/Components/AboutUsContent";
import AboutUsVideo from "@/Components/AboutUsVideo";
import MarketGoalsCarousel from "@/Components/MarketGoalsCarousel";
import AboutDataServicesType from "@/assets/Data/Home//AboutDataServicesType";
import CardWithIcons from "@/Components/Home/CustomerService/CardWithIcons";


const AboutUs = () => {
  // const { data: aboutUs, status } = useQueryGet(
  //   ["aboutUs"],
  //   StaticServices.aboutUs
  // );
   const { t } = useTranslation();
   const navigate = useNavigate();

   const renderCard = AboutDataServicesType().map((item) => (
    <div key={item.id} className="transition-all duration-300 cards_styling">
      <CardWithIcons item={item} />
    </div>
  ));

  return (
    <>
      <Helmet>
        <title>About Shiro Real Estate | Leading Dubai Property Agency</title>
        <meta
          name="description"
          content="Learn about Shiro Real Estate, Dubai's premier property agency. Our experienced team provides exceptional real estate services with expertise and dedication."
        />
      </Helmet>
      <>
        <div 
        // className="py-10 lg:py-20 pb-8 lg:pb-8"
        >
           {/* <h1 style={{fontWeight: 600}} className="custom_container text-center !text-[#9f8151] hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
       "{t("EXCELLENCE BEYOND COMPARE")}"
      </h1> */}

       <section className="relative w-full h-[91vh] overflow-hidden developer_listing_styling">
            <img
              src={ImagesUrl("about_us_banner.jpeg")}
              alt="List Your Property Main Banner"
              className="w-full h-full object-cover"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

            <div
              className="
                custom_container
                develop_heading_styling
              "
            >
              <h1 className="hidden md:block w-full lg:w-[100%] project_text font-bold !text-white drop-shadow-lg tracking-wide leading-tight content_general">
                {t("Expertise That Shapes the Market:")} <br />
  {t("Discover")}
              </h1>

              <p className="text-sm sm:text-base">
                <span className="text-white text-xl">
                  {t("Shiro Estate is one of the UAE's leading real estate agencies driven by a powerful combination of strategic thinking, in-depth market expertise, and a highly personalized approach. We help our clients invest with confidence and manage assets across the world’s most dynamic property markets.")}
                </span>
              </p>

              <button
      onClick={() => navigate("/team")}


                className="
                  w-fit bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 border-radius shadow-lg hover:shadow-xl cursor-pointer transition
                "
              >
                {t("Meet Our Team")}
              </button>
            </div>
          </section>

          <div className="custom_container py-15 lg:py-20 !pb-0">
         <h1 style={{paddingBottom: 15}} className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
        {t("A Winning Strategy Built on Growth and Trust")}
      </h1>
       <p className="down_styling para_styling">
                {t(
            "Shiro Estate was founded with a clear understanding: today’s real estate market requires more than just brokers — it demands strategic advisors and trusted partners who build long-term relationships based on transparency, trust, and measurable results. That is why our role goes far beyond closing transactions. We support our clients at every stage — from property selection and investment analysis to transaction execution and professional asset management."
          )}
</p><br/>
 <p className="down_styling para_styling">
                {t(
            "This philosophy defines Shiro Estate’s leadership, grounded in integrity, accountability, and continuous development. It enables us to work successfully with local and international investors, private clients, and corporations worldwide."
          )}
</p>

      </div>

          <div className="custom_container flex flex-col lg:flex-row items-stretch">

 <div className="leadership_styling flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-0">
  <div className="flex-1 flex">
    <MessageFromFounder />
  </div>

  <div className="hidden lg:block w-px bg-gray-300 self-stretch mx-8" />

  <div className="flex-1 flex">
    <MessageFromCeo />
  </div>
</div>


</div>

<div className="custom_container py-22 lg:py-22 !pb-0">
            <AboutUsVideo />
</div>

<div className="custom_container py-22 lg:py-22 !pb-0">
            <AboutUsContent />
</div>


 {/* <div 
 >
        <MessageFromFounder />
      </div>
     <div className="!pt-0 py-12 lg:py-10 pb-12 lg:pb-12">
        <MessageFromCeo />
      </div> */}
       <div>
        <Statistics/>
      </div>

      <div>
        <MarketGoalsCarousel/>
      </div>

       <div className="custom_container py-10 lg:py-20">
         <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
        {t("Our Core Values")}
      </h1>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-[15px] gap-[20px] lg:mt-[25px] ">
          {renderCard}
        </div>

      </div>
      {/* <div style={{marginBottom: '8px'}}>
        <AllOurTeamCarausal />
      </div>
      <div>
        <Map />
      </div> */}

        {/* <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {t("Our Trusted Developers")}
        </h2> */}

          {/* <BannerVideo video={aboutUs?.about_us?.video_url} status={status} /> */}
          {/* <OurCeo item={aboutUs?.about_us} /> */}
          {/* <StayInTheLoop /> */}
        </div>
      </>
    </>
  );
};

export default AboutUs;
