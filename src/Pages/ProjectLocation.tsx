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

        {/* STACKED: TEXT → IMAGE */}
        <div className="flex flex-col gap-8">

          {/* TEXT FIRST */}
          <div className="w-full text-white">
            {title && (
              <h1 className="heading_space font-semibold text-4xl">
                {title}
              </h1>
            )}

            {description && (
              <div
                className="down_styling para_styling !text-[#ffffff]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>

          {/* IMAGE SECOND (HALF HEIGHT) */}
          {main_image && (
            <div className="w-full overflow-hidden change_border shadow-xl">
              <img
                src={ProjectImagesUrl(main_image)}
                alt={title || "Project Location"}
                className="w-full object-cover max-h-[320px] md:max-h-[520px]"
              />
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
