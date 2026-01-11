import useQueryGet from "@/hooks/useQueryGet";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { BannerVideo } from "@/Sections/AboutUs";
import { ContactForm, StayInTheLoop } from "@/Sections/Home";
import { AllOurTeam } from "@/Sections/MeetOurTeam";
import StaticServices from "@/Services/StaticServices";
import { useEffect, useState } from "react";
import ImagesUrl from "@/helpers/ImagesURL";

const MeetOurTeam = () => {
   const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12); // Items per page

  const { data: ourTeam } = useQueryGet(["ourTeam", currentPage, perPage], () =>
    StaticServices.OurTeam({
      paginate: true,
      per_page: perPage,
      page: currentPage,
    })
  );

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <>
      <Helmet>
        <title>Meet Our Team | Shiro Real Estate Experts in Dubai</title>
        <meta
          name="description"
          content="Meet the professional team behind Shiro Real Estate. Our experienced agents and consultants are dedicated to finding your perfect property in Dubai."
        />
      </Helmet>
      <>
       <div className="w-full h-[91vh] developer_listing_styling">
        <img
          src={ImagesUrl("meet_the_team_main_image.jpeg")}
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
            {t("Shiro Estate Team")}
          </h1>

          <p className="text-sm sm:text-base">
            <span className="text-white text-xl">
              {t(
                "Real Estate Experts in the UAE and Worldwide"
              )}
            </span>
          </p>

          {/* <button
              onClick={() => {
  const section = document.getElementById("list_with_us");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}}
            className="w-fit bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 shadow-lg transition"
          >
            {t("Enquire Now")}
          </button> */}
        </div>
       </div>
        <div>
          <AllOurTeam
          />
          {/* <AllOurTeam
            item={ourTeam?.team}
            pagination={ourTeam?.pagination}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          /> */}

          {/* Company Video Section */}
          {/* <BannerVideo video="video" status="error" /> */}

          {/* Contact Form Section */}
          {/* <div className="pb-16" id="list_with_us">
            <ContactForm/>
          </div> */}

          {/* Newsletter Section */}
          {/* <StayInTheLoop /> */}
        </div>
      </>
    </>
  );
};

export default MeetOurTeam;
