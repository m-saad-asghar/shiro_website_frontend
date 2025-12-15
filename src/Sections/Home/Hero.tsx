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
    // Hero takes full viewport height minus the header (≈70px)
    <div className="w-full h-[calc(100vh-70px)] relative overflow-hidden mt-[70px] md:mt-0">
      {/* Background video layer */}
      <div className="absolute inset-0">
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
            muted
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
                  preload: "metadata",
                },
              },
            }}
          />
        </Suspense>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* FOREGROUND CONTENT – CENTERED BOTH WAYS */}
      <div className="relative z-20 h-full flex items-center justify-start custom_container">
        <MultiSearch />
      </div>
    </div>
  );
};

export default memo(Hero);
