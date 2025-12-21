import { useState, useEffect, useCallback, useMemo, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/Components/ui/skeleton";
import { useTranslation } from "react-i18next";
import ListingImagesUrl from "@/helpers/listingImagesURL";
import Icons from "@/Constants/Icons";

type GalleryProps = {
  item: any; // array of image urls
  status: "pending" | "error" | "success";
};

const Gallery: FC<GalleryProps> = ({ item, status }) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  // Filter out empty images
  const validImages = useMemo(() => {
    return (item?.filter((img: string) => img && img.trim() !== "") || []) as string[];
  }, [item]);

  const openGallery = (index: number) => {
    setSelectedImage(index);
    setIsOpen(true);
  };

  const closeGallery = useCallback(() => {
    setIsOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    if (!validImages.length) return;
    setSelectedImage((p) => (p + 1) % validImages.length);
  }, [validImages]);

  const prevImage = useCallback(() => {
    if (!validImages.length) return;
    setSelectedImage((p) => (p === 0 ? validImages.length - 1 : p - 1));
  }, [validImages]);

  // Keyboard + lock scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeGallery, nextImage, prevImage]);

  if (status === "pending" || status === "error") {
    return (
      <div className="w-full space-y-4 md:space-y-6">
        <Skeleton className="w-full h-[300px] md:h-[420px] lg:h-[520px] bg-gray-200" />
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <Skeleton className="w-full h-[180px] md:h-[220px] lg:h-[250px] bg-gray-200" />
          <Skeleton className="w-full h-[180px] md:h-[220px] lg:h-[250px] bg-gray-200" />
        </div>
      </div>
    );
  }

  if (validImages.length === 0) return null;

  const moreCount = Math.max(0, validImages.length - 3);

  return (
    <>
      {/* ===== MAIN LAYOUT ===== */}
<div className="w-full">
  <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-6">

    {/* LEFT BIG IMAGE */}
    <motion.div
      className="relative overflow-hidden change_border cursor-pointer group"
      onClick={() => openGallery(0)}
    >
      <img
        src={ListingImagesUrl(validImages[0])}
        className="w-full 
          h-[360px] 
          sm:h-[420px] 
          md:h-[480px] 
          lg:h-[680px]   /* ⬅️ +30% height */
          object-cover change_border"
        alt="Main Property"
      />

      <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl flex items-center gap-2 text-primary shadow-lg">
        <Icons.IoImageOutline className="w-5 h-5" />
        <span className="text-sm font-semibold">
          {validImages.length} {t("Photos")}
        </span>
      </div>
    </motion.div>

    {/* RIGHT COLUMN */}
    <div className="
      grid 
      grid-cols-1          /* 📱 mobile: stacked */
      sm:grid-cols-1 
      lg:grid-cols-1       /* 🖥 desktop: stacked */
      gap-4 md:gap-6
    ">

      {/* IMAGE 2 */}
      {validImages[1] && (
        <motion.div
          className="relative overflow-hidden change_border cursor-pointer group"
          onClick={() => openGallery(1)}
        >
          <img
            src={ListingImagesUrl(validImages[1])}
            className="w-full 
              h-[240px] 
              sm:h-[280px] 
              md:h-[320px] 
              lg:h-[330px]   /* ⬅️ half of left */
              object-cover change_border"
            alt="Property 2"
          />
        </motion.div>
      )}

      {/* IMAGE 3 */}
      {validImages[2] && (
        <motion.div
          className="relative overflow-hidden change_border cursor-pointer group"
          onClick={() => openGallery(2)}
        >
          <img
            src={ListingImagesUrl(validImages[2])}
            className="w-full 
              h-[240px] 
              sm:h-[280px] 
              md:h-[320px] 
              lg:h-[330px]   /* ⬅️ half of left */
              object-cover change_border"
            alt="Property 3"
          />

          {validImages.length > 3 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-white text-3xl font-bold">
                +{validImages.length - 3}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  </div>
</div>


      {/* ======= OVERLAY GALLERY (main preview + thumbnails below) ======= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[9999] p-4 md:p-8"
            onClick={closeGallery}
          >
            <div
              className="w-full h-full max-w-6xl mx-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between text-white mb-4">
                <div className="text-sm font-semibold">
                  {selectedImage + 1} / {validImages.length}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevImage}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all"
                    aria-label="Previous image"
                  >
                    <Icons.IoChevronBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all"
                    aria-label="Next image"
                  >
                    <Icons.IoChevronForward className="w-5 h-5" />
                  </button>

                  <button
                    onClick={closeGallery}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all"
                    aria-label="Close gallery"
                  >
                    <Icons.LiaTimesSolid className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main preview */}
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex items-center justify-center"
              >
                <img
                  src={ListingImagesUrl(validImages[selectedImage])}
                  alt={`Property ${selectedImage + 1}`}
                  className="max-w-full max-h-[62vh] md:max-h-[70vh] object-contain rounded-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%239ca3af'%3ENo Image Available%3C/text%3E%3C/svg%3E";
                  }}
                />
              </motion.div>

              {/* Thumbnails (all images down) */}
              <div className="mt-4">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {validImages.map((src, idx) => (
                    <button
                      key={`${src}-${idx}`}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative flex-shrink-0 rounded-lg overflow-hidden border transition-all ${
                        idx === selectedImage ? "border-white" : "border-white/20 hover:border-white/60"
                      }`}
                      aria-label={`Open image ${idx + 1}`}
                    >
                      <img
                        src={ListingImagesUrl(src)}
                        alt={`Thumb ${idx + 1}`}
                        className="w-[90px] h-[64px] md:w-[110px] md:h-[78px] object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/src/assets/Images/Property/placeholder-property.jpg";
                        }}
                      />
                      {idx === selectedImage && (
                        <div className="absolute inset-0 ring-2 ring-white/80" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
