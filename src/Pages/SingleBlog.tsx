import { Helmet } from "react-helmet";

import useQueryGet from "@/hooks/useQueryGet";
import { ContactForm, StayInTheLoop } from "@/Sections/Home";
import { OurBlog } from "@/Sections/SingleBlog";
import BlogServices from "@/Services/BlogServices";
import { useParams } from "react-router-dom";

const SingleBlog = () => {
  const { slug } = useParams();

  // Extract ID from slug (ID is at the end, separated by underscore or hyphen)
  // Example: "Ahmed_Test_1" or "title-123"
  const extractIdFromSlug = (slug: string | undefined): string | undefined => {
    if (!slug) return undefined;

    // Try underscore separator first (current format)
    const partsByUnderscore = slug.split("_");
    const lastPartUnderscore = partsByUnderscore[partsByUnderscore.length - 1];

    if (
      lastPartUnderscore &&
      !isNaN(Number(lastPartUnderscore)) &&
      lastPartUnderscore.trim() !== ""
    ) {
      return lastPartUnderscore;
    }

    // Fallback: try hyphen separator
    const partsByHyphen = slug.split("-");
    const lastPartHyphen = partsByHyphen[partsByHyphen.length - 1];

    if (
      lastPartHyphen &&
      !isNaN(Number(lastPartHyphen)) &&
      lastPartHyphen.trim() !== ""
    ) {
      return lastPartHyphen;
    }

    // Fallback: try to find number at the end
    const match = slug.match(/(?:[_-]|^)(\d+)$/);
    if (match && match[1]) {
      return match[1];
    }

    return undefined;
  };

  const id = extractIdFromSlug(slug);
  const { data, status } = useQueryGet(["singleBlog", id || ""], () =>
    BlogServices.SingleBlog(id || "")
  );

  // If data is not available yet, show simple loading message
  if (status === "pending") {
    return (
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading blog post...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // If no data, show error message
  if (!data?.blog) {
    return (
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Blog post not found
            </h2>
            <p className="text-gray-600 mb-8">
              The blog post you're looking for doesn't exist or has been
              removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {data?.blog?.meta_title || data?.blog?.title} | Shiro Real Estate
          Agency In Dubai
        </title>
        <meta
          name="description"
          content={data?.blog?.meta_description || data?.blog?.description}
        />
      </Helmet>
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        <OurBlog item={data?.blog} />
        <ContactForm display_name="contact-us-form-via-blog-details-page-of-website"/>
        <StayInTheLoop />
      </div>
    </>
  );
};

export default SingleBlog;
