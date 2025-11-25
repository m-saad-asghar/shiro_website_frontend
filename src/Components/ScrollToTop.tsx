import { useEffect, useState, useCallback } from "react";
import Icons from "@/Constants/Icons";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Use useCallback for better performance
  const handleScroll = useCallback(() => {
    // Show/hide button
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    // Calculate scroll progress immediately
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    // Update progress immediately without delay
    setScrollProgress(Math.min(scrollPercent, 100));
  }, []);

  useEffect(() => {
    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-50">
          {/* Progress Circle */}
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            {/* Background Circle */}
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#e5e7eb"
              strokeWidth="2"
              fill="transparent"
            />
            {/* Progress Circle - No transition for immediate response */}
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#9f8151"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${
                2 * Math.PI * 28 * (1 - scrollProgress / 100)
              }`}
              className="transition-transform duration-150 ease-out"
              style={{
                filter: "drop-shadow(0 0 4px rgba(159, 129, 81, 0.4))",
                transformOrigin: "center",
              }}
            />
          </svg>

          {/* Button */}
          <button
            onClick={scrollToTop}
            className="absolute top-2 left-2 w-12 h-12 bg-[#094834] text-white rounded-full shadow-lg hover:bg-[#0a5a3f] transition-all duration-200 ease-out flex items-center justify-center group cursor-pointer"
            style={{
              boxShadow: "0 4px 12px rgba(9, 72, 52, 0.3)",
            }}
            aria-label="Scroll to top"
          >
            <Icons.IoIosArrowUp
              size={24}
              className="transition-transform duration-200 ease-out group-hover:-translate-y-1"
            />
          </button>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
