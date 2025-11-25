import { FavoriteCard } from "@/Components/MyProperty";
import { Skeleton } from "@/Components/ui/skeleton";
import useQueryGet from "@/hooks/useQueryGet";
import FavouritesServices from "@/Services/FavouritesServices";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const AllFavorites = () => {
  const { t } = useTranslation();
  const { data: myFavorites, status } = useQueryGet(
    ["allFavorites"],
    FavouritesServices.AllFavourite
  );

  const renderCard = useMemo(() => {
    return myFavorites?.favourites?.map((item: any, index: number) => (
      <motion.div
        key={item.id || index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <FavoriteCard item={item} />
      </motion.div>
    ));
  }, [myFavorites]);

  const renderSkeltonCard = useMemo(() => {
    return [...Array(6)].map((_, index: number) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <Skeleton className="h-80 w-full rounded-2xl bg-gray-200 border border-gray-300" />
      </motion.div>
    ));
  }, []);

  return (
    <div className="flex-1 bg-gray-50/50">
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {t("My Favorites")}
              </h2>
              <p className="text-gray-600">
                {t("Your saved properties and favorites")}
              </p>
            </div>

            {/* Stats */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {myFavorites?.favourites?.length || 0}
                </div>
                <div className="text-sm text-gray-500">{t("Properties")}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {status === "pending" || status === "error" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderSkeltonCard}
          </div>
        ) : myFavorites?.favourites?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("No favorites yet")}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {t(
                "Start exploring properties and add them to your favorites to see them here"
              )}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderCard}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFavorites;
