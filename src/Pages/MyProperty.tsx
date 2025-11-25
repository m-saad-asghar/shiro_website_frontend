import { Helmet } from "react-helmet";
import { AllFavorites, SideBar, TopBar } from "@/Sections/MyProperty";

const MyProperty = () => {
  return (
    <>
      <Helmet>
        <title>My Properties | Shiro Real Estate - Saved Favorites</title>
        <meta
          name="description"
          content="View your saved properties and favorites. Manage your property watchlist and track listings you're interested in with Shiro Real Estate."
        />
      </Helmet>
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] min-h-screen">
          <SideBar />
          <div className="flex flex-col">
            <TopBar />
            <AllFavorites />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProperty;
