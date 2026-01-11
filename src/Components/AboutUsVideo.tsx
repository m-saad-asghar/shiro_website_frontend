// AboutUsVideo.tsx
import React, { useMemo, useState } from "react";
import ImagesUrl from "@/helpers/ImagesURL";

type Props = {
  className?: string;
};

const AboutUsVideo: React.FC<Props> = ({ className = "" }) => {
  const youtubeUrl = "https://youtu.be/8GiTgd1jT8s?si=R0B-RAlqt3Nnc02W";
  const thumbnailSrc = "/about_shiro_youtube_thumbnail.JPG";
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = useMemo(() => {
    try {
      const u = new URL(youtubeUrl);
      if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
      if (u.searchParams.get("v")) return u.searchParams.get("v")!;
      return "";
    } catch {
      return "";
    }
  }, [youtubeUrl]);

  const embedSrc = useMemo(() => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  }, [videoId]);

  return (
    <section className={`w-full ${className}`}>
      {/* ✅ Optional: control width like your page section */}
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full overflow-hidden rounded-2xl border border-primary/20 bg-white shadow-sm">
          {/* ✅ 16:9 wide frame (matches thumbnail/video) */}
          <div className="relative w-full aspect-video">
            {!isPlaying ? (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 w-full h-full group"
                aria-label="Play YouTube video"
              >
                <img
                  src={ImagesUrl(thumbnailSrc)}
                  alt="About Shiro video thumbnail"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-lg">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-primary translate-x-[1px]"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </button>
            ) : (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={embedSrc}
                title="About Shiro Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsVideo;
