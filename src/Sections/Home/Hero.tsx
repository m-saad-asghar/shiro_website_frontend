import { lazy, Suspense, useState } from "react";
import Video from "../../assets/Images/Home/Hero/aerial-view-dubai.webm";
import { memo } from "react";
import { MultiSearch } from "@/Components";

// Lazy load ReactPlayer
const ReactPlayer = lazy(() => import("react-player/lazy"));

const Hero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);

  return (
    <div className="w-full h-[430px] md:h-[555px] lg:h-[705px] relative flex flex-col overflow-visible mt-[70px] md:mt-0">
      {/* Loading Placeholder */}
      {!isVideoLoaded && !isVideoError && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#094834] to-[#d3c294] animate-pulse" />
      )}

      {/* Error Fallback */}
      {isVideoError && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#094834] to-[#d3c294]" />
      )}

      {/* Video Player */}
      <Suspense
        fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-[#094834] to-[#d3c294] animate-pulse" />
        }
      >
        <ReactPlayer
          playing
          onReady={() => setIsVideoLoaded(true)}
          onError={() => setIsVideoError(true)}
          wrapper={({ children }: { children: React.ReactNode }) => (
            <div className="w-full h-full">{children}</div>
          )}
          loop
          muted={true}
          width="100%"
          height="100%"
          url={Video}
          config={{
            file: {
              attributes: {
                autoPlay: true,
                muted: true,
                loop: true,
                playsInline: true,
                preload: "metadata", // Load metadata only
              },
            },
          }}
        />
      </Suspense>

      {/* Overlay Layer for Darkening */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="container relative z-20">
        <MultiSearch />
      </div>
    </div>
  );
};

export default memo(Hero);
