import Icons from "@/Constants/Icons";
import { FavoiteContext } from "@/Context/FavoiteContext";
import { useContext, type FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

type HeaderSinglePropertyProps = {
  is_favorite: boolean;
};

const HeaderSingleProperty: FC<HeaderSinglePropertyProps> = ({
  is_favorite,
}) => {
  const navigate = useNavigate();
  const Params = useParams();
  const { t } = useTranslation();

  // toggle isFavorite
  const { isFavorite, toggleFavoriteOptimistic, token } =
    useContext(FavoiteContext);

  const handleFavoite = async () => {
    if (token) {
      try {
        const propertyId = Number(Params?.id);
        await toggleFavoriteOptimistic(propertyId);
      } catch (error) {
        // Error handling
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-0 flex items-center justify-between pt-5"
    >
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors duration-200 group"
      >
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
          <Icons.FaLongArrowAltLeft className="w-5 h-5" />
        </div>
        <span className="text-base  capitalize">
          {t("Back to Listings")}
        </span>
      </motion.button>

      {/* Save Button */}
      {/* <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleFavoite}
        className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${
          isFavorite.includes(Number(Params.id)) === true || is_favorite == true
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        }`}
      >
        <Icons.IoMdHeart className="w-5 h-5" />
        <span className="text-base font-semibold capitalize">{t("save")}</span>
      </motion.button> */}
    </motion.div>
  );
};

export default HeaderSingleProperty;
