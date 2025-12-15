"use client";

import React, { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import type { SlideImage, LightboxProps } from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import { useTranslation } from "react-i18next";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import ProjectImagesUrl from "@/helpers/projectImagesURL";

type GalleryProps = {
  images: string[];
};

export default function Gallery({ images }: GalleryProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const { t } = useTranslation();

 const slides = useMemo<SlideImage[]>(
  () => (images || []).map((src) => ({ src: ProjectImagesUrl(src) })),
  [images]
);

  const handleOpen = (startIndex: number): void => {
    if (!images || images.length === 0) return;
    setIndex(startIndex);
    setOpen(true);
  };

  const onView: NonNullable<LightboxProps["on"]> = {
    view: ({ index: currentIndex }: { index: number }) => setIndex(currentIndex),
  };

  // ✅ if no images, render nothing
  if (!images || images.length === 0) return null;

  return (
    <>
      <section className="gallery_container_new" id="gallery">
        <div className="gallery-grid">
          {images.slice(0, 4).map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              className="gallery-item"
              onClick={() => handleOpen(i)}
            >
              <img
                 src={ProjectImagesUrl(src)}
                alt={`Gallery image ${i + 1}`}
                className="gallery-image"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        <div className="consultation_btn_style btn_cen custom_spacing_btn mid_btn">
          <button
            onClick={() => handleOpen(0)}
            className="bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 rounded-md shadow-lg transition"
          >
            {t("Explore Gallery")}
          </button>
        </div>

        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={slides}
          index={index}
          plugins={[Thumbnails]}
          on={onView}
          thumbnails={{ position: "bottom" }}
        />

        <style>{`
          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-top: 20px;
          }

          .gallery-item {
            position: relative;
            cursor: pointer;
            padding: 0;
            border: none;
            background: transparent;
            overflow: hidden;
            border-radius: 8px;
          }

          .gallery-image {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .gallery-item:hover .gallery-image {
            transform: scale(1.05);
          }

          @media (max-width: 1024px) {
            .gallery-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 640px) {
            .gallery-grid {
              grid-template-columns: repeat(1, 1fr);
            }
          }
        `}</style>
      </section>
    </>
  );
}
