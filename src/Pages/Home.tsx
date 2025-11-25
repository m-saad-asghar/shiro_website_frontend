import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import { Hero } from "../Sections/Home";

// Lazy load components
const Partners = lazy(() => import("../Sections/Home/Partners"));
const CustomerService = lazy(() => import("../Sections/Home/CustomerService"));
const Box = lazy(() => import("../Sections/Home/Box"));
const ExploreProperty = lazy(() => import("../Sections/Home/ExploreProperty"));
const SummaryBlog = lazy(() => import("../Sections/Home/SummaryBlog"));
const ContactForm = lazy(() => import("../Sections/Home/ContactForm"));
const PremierMarketplace = lazy(
  () => import("../Sections/Home/PremierMarketplace")
);
const OurClients = lazy(() => import("../Sections/Home/OurClients"));
const StayInTheLoop = lazy(() => import("../Sections/Home/StayInTheLoop"));

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="w-full py-16 md:py-20 lg:py-24">
    <div className="container mx-auto px-4">
      <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
    </div>
  </div>
);

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Shiro Real Estate | Premier Property Agency in Dubai</title>
        <meta
          name="description"
          content="Discover luxury properties in Dubai with Shiro Real Estate. Browse apartments, villas, and commercial spaces for sale and rent. Expert real estate services since 2024."
        />
      </Helmet>
      <div className="w-full h-full">
        <Hero />

        <Suspense fallback={<LoadingSkeleton />}>
          <Partners />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <CustomerService />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <Box />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <ExploreProperty />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <SummaryBlog />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <ContactForm />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <PremierMarketplace />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <OurClients />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <StayInTheLoop />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
