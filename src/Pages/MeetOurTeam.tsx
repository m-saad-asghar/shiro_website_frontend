import useQueryGet from "@/hooks/useQueryGet";
import { Helmet } from "react-helmet";
import { BannerVideo } from "@/Sections/AboutUs";
import { ContactForm, StayInTheLoop } from "@/Sections/Home";
import { AllOurTeam } from "@/Sections/MeetOurTeam";
import StaticServices from "@/Services/StaticServices";
import { useEffect, useState } from "react";

const MeetOurTeam = () => {
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
        <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
          {/* Team Members Section */}
          <AllOurTeam
            item={ourTeam?.team}
            pagination={ourTeam?.pagination}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          {/* Company Video Section */}
          <BannerVideo video="video" status="error" />

          {/* Contact Form Section */}
          <ContactForm />

          {/* Newsletter Section */}
          <StayInTheLoop />
        </div>
      </>
    </>
  );
};

export default MeetOurTeam;
