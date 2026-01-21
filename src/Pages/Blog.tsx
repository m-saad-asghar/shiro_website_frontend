import useQueryGet from "@/hooks/useQueryGet";
import { Helmet } from "react-helmet";
import { AllBlog } from "@/Sections/Blog";
import { ContactForm, StayInTheLoop } from "@/Sections/Home";
import BlogServices from "@/Services/BlogServices";

const Blog = () => {
  const { data, status } = useQueryGet(["allBlog"], BlogServices.AllBlogs);

  return (
    <>
      <Helmet>
        <title>Dubai Real Estate Blog | Shiro Property Insights & News</title>
        <meta
          name="description"
          content="Stay updated with the latest Dubai real estate news, market trends, investment tips, and property insights from Shiro Real Estate experts."
        />
      </Helmet>
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        {/* Hero Banner */}

        {/* Blog Posts Section */}
        <AllBlog
          pagination={data?.pagination}
          item={data?.blogs}
          status={status}
        />

        {/* Contact Form Section */}
        <ContactForm display_name="contact-us-form-via-blogs-page-of-website"/>

        {/* Newsletter Section */}
        <StayInTheLoop />
      </div>
    </>
  );
};

export default Blog;
