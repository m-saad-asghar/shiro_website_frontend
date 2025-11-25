import ReactPlayer from "react-player";
import Icons from "@/Constants/Icons";
import { useMemo, useState, type FC } from "react";
import ImagesUrl from "@/helpers/ImagesURL";
import { Skeleton } from "@/Components/ui/skeleton";
import { useTranslation } from "react-i18next";

type BannerVideoProps = {
  video: any;
  status: "pending" | "error" | "success";
};

const BannerVideo: FC<BannerVideoProps> = ({ video, status }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { t } = useTranslation();

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const renderSkeltonVideo = useMemo(() => {
    return [...Array(1)].map((_, index: number) => (
      <Skeleton
        className="w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-2xl bg-gray-200 shadow-sm flex-center"
        key={index}
      >
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white absolute flex-center cursor-pointer shadow-lg">
          <Icons.FaPlay className="text-[#094834] text-xl" />
        </div>
      </Skeleton>
    ));
  }, []);

  return (
    <section className="w-full py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
              <span className="text-[#094834] font-medium text-sm">
                {t("Company Video")}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#094834] mb-6 leading-tight">
              {t("Discover Shiro Real Estate")}
            </h2>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {t(
                "Watch our company video to learn more about our mission, values, and commitment to excellence in Dubai's real estate market."
              )}
            </p>
          </div>

          {/* Video Container */}
          <div className="relative">
            {status == "pending" || status == "error" ? (
              renderSkeltonVideo
            ) : (
              <div className="w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-2xl relative overflow-hidden shadow-2xl">
                <ReactPlayer
                  playing={isPlaying}
                  wrapper={({ children }) => (
                    <div className="w-full h-full">{children}</div>
                  )}
                  loop
                  muted={true}
                  style={{
                    borderRadius: "16px",
                  }}
                  width="100%"
                  height="100%"
                  url={ImagesUrl(video)}
                />
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <button
                      onClick={handlePlayClick}
                      className="group w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300"
                      aria-label="Play company video"
                    >
                      <Icons.FaPlay className="text-[#094834] text-xl group-hover:text-[#9f8151] transition-colors duration-200" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerVideo;
