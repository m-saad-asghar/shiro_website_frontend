import useQueryGet from "@/hooks/useQueryGet";
import { Helmet } from "react-helmet";
import { BannerVideo, OurCeo } from "@/Sections/AboutUs";
import { StayInTheLoop } from "@/Sections/Home";
import StaticServices from "@/Services/StaticServices";

const AboutUs = () => {
  const { data: aboutUs, status } = useQueryGet(
    ["aboutUs"],
    StaticServices.aboutUs
  );
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
        <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
          <BannerVideo video={aboutUs?.about_us?.video_url} status={status} />
          <OurCeo item={aboutUs?.about_us} />
          <StayInTheLoop />
        </div>
      </>
    </>
  );
};

export default AboutUs;
