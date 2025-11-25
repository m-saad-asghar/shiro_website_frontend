import UseQueryPost from "@/hooks/useQueryPost";
import useQueryGet from "@/hooks/useQueryGet";
import FavouritesServices from "@/Services/FavouritesServices";
import Cookies from "js-cookie";
import {
  createContext,
  useState,
  type FC,
  useCallback,
  useEffect,
} from "react";

export const FavoiteContext = createContext<any>(null);
type TypesFavoiteProviderProps = {
  children: any;
};

export const FavoiteProvider: FC<TypesFavoiteProviderProps> = ({
  children,
}) => {
  const { mutateAsync } = UseQueryPost(
    ["toggleFavorite"],
    FavouritesServices.ToggleFavourite
  );
  const [isFavorite, setIsFavorite] = useState<any[]>([]);
  const token = Cookies.get("token");

  // Load initial favorites from server
  const { data: favoritesData } = useQueryGet(
    ["allFavorites"],
    FavouritesServices.AllFavourite,
    undefined, // onSuccess callback
    !!token // Only fetch if user is logged in
  );

  // Update local state when favorites data is loaded
  useEffect(() => {
    if (favoritesData?.favourites) {
      const favoriteIds = favoritesData.favourites.map((item: any) => item.id);
      setIsFavorite(favoriteIds);
    }
  }, [favoritesData]);

  // Helper function to toggle favorite optimistically
  const toggleFavoriteOptimistic = useCallback(
    async (propertyId: number) => {
      const isCurrentlyFavorite = isFavorite.includes(propertyId);

      // Update UI immediately (optimistic update)
      if (isCurrentlyFavorite) {
        setIsFavorite((prev: any) =>
          prev.filter((id: any) => id !== propertyId)
        );
      } else {
        setIsFavorite((prev: any) => [...prev, propertyId]);
      }

      try {
        // Call the API
        await mutateAsync({ property_id: propertyId });
      } catch (error) {
        // Revert the optimistic update if API call fails
        if (isCurrentlyFavorite) {
          setIsFavorite((prev: any) => [...prev, propertyId]);
        } else {
          setIsFavorite((prev: any) =>
            prev.filter((id: any) => id !== propertyId)
          );
        }
        throw error;
      }
    },
    [isFavorite, mutateAsync]
  );

  return (
    <FavoiteContext.Provider
      value={{
        isFavorite,
        setIsFavorite,
        token,
        mutateAsync,
        toggleFavoriteOptimistic,
      }}
    >
      {children}
    </FavoiteContext.Provider>
  );
};
