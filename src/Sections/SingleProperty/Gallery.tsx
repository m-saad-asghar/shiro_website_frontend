import { useState, useEffect, useCallback, useMemo, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/Components/ui/skeleton";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";

type GalleryProps = {
  item: any;
  status: "pending" | "error" | "success";
};

const Gallery: FC<GalleryProps> = ({ item, status }) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Filter out empty images
  const validImages = useMemo(() => {
    return item?.filter((img: string) => img && img.trim() !== "") || [];
  }, [item]);

  const nextImage = useCallback(() => {
    if (selectedImage !== null && validImages.length > 0) {
      setSelectedImage((selectedImage + 1) % validImages.length);
    }
  }, [selectedImage, validImages]);

  const prevImage = useCallback(() => {
    if (selectedImage !== null && validImages.length > 0) {
      setSelectedImage(
        selectedImage === 0 ? validImages.length - 1 : selectedImage - 1
      );
    }
  }, [selectedImage, validImages]);

  // Handle keyboard navigation and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage !== null) {
        if (e.key === "Escape") {
          closeLightbox();
        } else if (e.key === "ArrowRight") {
          nextImage();
        } else if (e.key === "ArrowLeft") {
          prevImage();
        }
      }
    };

    // Prevent body scroll when lightbox is open
    if (selectedImage !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, closeLightbox, nextImage, prevImage]);

  if (status === "pending" || status === "error") {
    return (
      <div className="w-full space-y-4 md:space-y-6">
        <Skeleton className="w-full h-[300px] md:h-[400px] lg:h-[600px] rounded-2xl bg-gray-200" />
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <Skeleton className="w-full h-[200px] md:h-[250px] lg:h-[300px] rounded-2xl bg-gray-200" />
          <Skeleton className="w-full h-[200px] md:h-[250px] lg:h-[300px] rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (validImages.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-full space-y-4 md:space-y-6">
        {/* Main Image - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full rounded-2xl relative overflow-hidden group cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <img
            src={validImages[0]}
            className="w-full h-[300px] md:h-[400px] lg:h-[600px] object-cover rounded-2xl"
            alt="Main Property Image"
          />

          {/* Badge with photo count */}
          <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl flex items-center gap-2 text-primary shadow-lg">
            <Icons.IoImageOutline className="w-5 h-5" />
            <span className="text-sm font-semibold">
              {validImages.length} {t("photo")}
            </span>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        </motion.div>

        {/* Side Images - Grid Layout */}
        {validImages.length > 1 && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {/* Second Image */}
            {validImages[1] && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full h-[200px] md:h-[250px] lg:h-[300px] rounded-2xl overflow-hidden group cursor-pointer relative"
                onClick={() => openLightbox(1)}
              >
                <img
                  src={validImages[1]}
                  className="w-full h-full object-cover rounded-2xl"
                  alt="Property Image 2"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </motion.div>
            )}

            {/* Third Image */}
            {validImages[2] && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full h-[200px] md:h-[250px] lg:h-[300px] rounded-2xl overflow-hidden group cursor-pointer relative"
                onClick={() => openLightbox(2)}
              >
                <img
                  src={validImages[2]}
                  className="w-full h-full object-cover rounded-2xl"
                  alt="Property Image 3"
                />

                {/* Show "+X more" overlay if there are more than 3 images */}
                {validImages.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-all duration-300 flex flex-col items-center justify-center">
                    <Icons.IoImageOutline className="w-12 h-12 text-white mb-2" />
                    <span className="text-white text-2xl font-bold">
                      +{validImages.length - 3}
                    </span>
                    <span className="text-white text-sm mt-1">More Photos</span>
                  </div>
                )}

                {/* Regular hover overlay for 3rd image if no more images */}
                {validImages.length <= 3 && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-white transition-all duration-[.4s] z-[10000]"
              aria-label="Close gallery"
            >
              <Icons.LiaTimesSolid className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-[.4s] z-[10000]"
              aria-label="Previous image"
            >
              <Icons.IoChevronBack className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-[.4s] z-[10000]"
              aria-label="Next image"
            >
              <Icons.IoChevronForward className="w-6 h-6" />
            </button>

            {/* Image */}
            {validImages[selectedImage] && (
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-5xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={validImages[selectedImage]}
                  alt={`Property Image ${selectedImage + 1}`}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%239ca3af'%3ENo Image Available%3C/text%3E%3C/svg%3E";
                  }}
                />

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-semibold border border-white/20">
                  {selectedImage + 1} / {validImages.length}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
