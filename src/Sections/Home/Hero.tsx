import { lazy, Suspense, useEffect, useState, memo } from "react";
import { Helmet } from "react-helmet";
import Video from "../../assets/Images/Home/Hero/aerial-view-dubai.webm";
import { MultiSearch } from "@/Components";

// ✅ Lazy load ReactPlayer (keeps initial JS smaller)
const ReactPlayer = lazy(() => import("react-player/lazy"));

const Hero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);

  // ✅ Preload the video ASAP (helps first paint start sooner on many setups)
  useEffect(() => {
    if (!Video) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = Video;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <>
      {/* ✅ Also preload via Helmet (safe + consistent) */}
      <Helmet>
        <link rel="preload" as="video" href={Video} />
      </Helmet>

      {/* Hero takes full viewport height minus the header (≈70px) */}
      <div className="w-full h-[calc(100vh-70px)] relative overflow-hidden mt-[70px] md:mt-0">
        {/* Background video layer */}
        <div className="absolute inset-0">
          {/* ✅ Instant placeholder until video is ready */}
          {!isVideoLoaded && !isVideoError && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#094834] to-[#d3c294] animate-pulse" />
          )}

          {/* ✅ Error fallback */}
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
              url={Video}
              playing={!isVideoError}
              muted
              loop
              playsinline
              width="100%"
              height="100%"
              onReady={() => setIsVideoLoaded(true)}
              onError={() => setIsVideoError(true)}
              wrapper={({ children }: { children: React.ReactNode }) => (
                <div className="w-full h-full">{children}</div>
              )}
              config={{
                file: {
                  forceVideo: true,
                  attributes: {
                    autoPlay: true,
                    muted: true,
                    loop: true,
                    playsInline: true,
                    preload: "auto",
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
    </>
  );
};

export default memo(Hero);
