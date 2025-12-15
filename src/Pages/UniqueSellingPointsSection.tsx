"use client";

import React from "react";
import ProjectImagesUrl from "@/helpers/projectImagesURL";

type UniqueSellingPoints = {
  title?: string;
  description?: string; // HTML from DB
  main_image?: string;
};

type UniqueSellingPointsSectionProps = {
  unique_selling_points?: UniqueSellingPoints | null;
};

export default function UniqueSellingPointsSection({
  unique_selling_points,
}: UniqueSellingPointsSectionProps) {
  // Safety guard (don’t render if no data)
  if (!unique_selling_points) return null;

  const {
    title,
    description,
    main_image,
  } = unique_selling_points;

  return (
    <section className="w-full bg-[#094834] custom_container">
      <div className="selling_points_container">
        {/* 50/50 grid – stack on mobile */}
        <div className="grid grid-cols-1 items-center gap-20 md:grid-cols-2 md:gap-12">
          
          {/* LEFT: Image */}
         <div className="w-full h-full">
  <div className="h-full overflow-hidden change_border shadow-xl">
    <img
      src={ProjectImagesUrl(main_image)}
      alt={title || "Unique Selling Points"}
      className="h-full w-full object-cover"
    />
  </div>
</div>

          {/* RIGHT: Content */}
          <div className="w-full text-white">
            {title && (
               <h1 className="heading_space font-semibold text-4xl">
               {title}
              </h1>
            )}

            {/* HTML Content from DB */}
            {description && (
              <p
                className="down_styling para_styling !text-[#ffffff]"
                dangerouslySetInnerHTML={{ __html: description }}
              ></p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}