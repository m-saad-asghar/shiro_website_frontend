import { Bennar } from "@/Components";
import { useTranslation } from "react-i18next";

const BannerSearch = () => {
  const { t } = useTranslation();

  return (
    <Bennar
      pathName={t("Blog")}
      title={t("News, Media Gallery & Insights")}
      desc={t(
        "Take a look at the latest Real Estate News, Videos & Insights from Dubai's leading real estate market."
      )}
    />
  );
};

export default BannerSearch;
