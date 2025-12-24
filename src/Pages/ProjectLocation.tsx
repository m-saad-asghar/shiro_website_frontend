"use client";

import React from "react";
import ProjectImagesUrl from "@/helpers/projectImagesURL";

type ProjectLocation = {
  title?: string;
  description?: string; // HTML from DB
  main_image?: string;
};

type ProjectLocationSectionProps = {
  project_location?: ProjectLocation | null;
};

export default function ProjectLocationSection({
  project_location,
}: ProjectLocationSectionProps) {
  if (!project_location) return null;

  const { title, description, main_image } = project_location;

  return (
    <section className="w-full bg-[#094834] custom_container">
      <div className="location_container">
        {main_image && (
          <div
            className="
              relative
              w-full
              overflow-hidden
              change_border
              shadow-xl
              min-h-[420px] md:min-h-[560px]
            "
          >
            {/* BACKGROUND IMAGE (auto height) */}
            <img
              src={ProjectImagesUrl(main_image)}
              alt={title || "Project Location"}
              className="
                absolute inset-0
                w-full h-full
                object-cover
              "
            />

            {/* OVERLAY LAYER */}
            <div className="relative z-10 flex items-start md:items-center h-full">
              <div
                className="
                  m-4 md:m-10
                  w-[100%] md:w-[620px] lg:w-[660px]
                 change_border
                  bg-[#FFFFFF66]
                  backdrop-blur-xl
                  shadow-2xl
                  border border-white/30
                  p-6 md:p-10
                "
              >
                {title && (
                  <h2 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
                    {title}
                  </h2>
                )}

                {description && (
                  <div
                    className="mt-4 down_styling para_styling"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
