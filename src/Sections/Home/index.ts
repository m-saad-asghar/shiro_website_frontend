// Only export Hero (used immediately in Home)
export { default as Hero } from "./Hero";

// Export components used in other pages (not lazy loaded)
export { default as ContactForm } from "./ContactForm";
export { default as Partners } from "./Partners";
export { default as StayInTheLoop } from "./StayInTheLoop";
export { default as SummaryBlog } from "./SummaryBlog";
export { default as OurClients } from "./OurClients";

// Note: The following are lazy-loaded in Home.tsx only:
// - ExploreProperty (lazy)
// - CustomerService (lazy)
// - Box (lazy)
// - PremierMarketplace (lazy)
