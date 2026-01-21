"use client";

import React from "react";

type ProjectLocation = {
  title?: string;
  description?: string; // HTML from DB
  map_link?: string | number | null;
};

type ProjectLocationSectionProps = {
  project_location?: ProjectLocation | null;
};

export default function ProjectLocationSection({
  project_location,
}: ProjectLocationSectionProps) {
  if (!project_location) return null;

  const { title, description, map_link } = project_location;

  // ✅ iframe src must be string | undefined
  const mapSrc =
    typeof map_link === "string" && map_link.trim() !== "" ? map_link : undefined;

  return (
    <section className="w-full bg-[#094834] custom_container">
      <div className="location_container">
        <div className="w-full flex flex-col gap-4 md:gap-6">
          {/* TEXT BLOCK */}
          <div
            className="
              change_border
              bg-[#FFFFFF]
              backdrop-blur-xl
              shadow-2xl
              border border-white/30
              p-6 md:p-10
              w-full
            "
          >
            {title && (
              <h2 className="w-full text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
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

          {/* MAP BLOCK (only if mapSrc exists) */}
          {mapSrc && (
            <div
              className="
                relative
                w-full
                overflow-hidden
                change_border
                shadow-xl
                min-h-[420px] md:min-h-[560px]
                mt-0
              "
            >
              {/* OLD MAP (keep commented) */}
              {/* <iframe
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${lat},${lng}&t=h&z=16&output=embed`}
                title="Project Location Map"
              /> */}

              <iframe
                className="absolute inset-0 w-full h-full border-0"
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Project Location Map"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
