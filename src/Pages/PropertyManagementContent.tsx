// PropertyManagementContent.tsx
import React from "react";
import ImagesUrl from "@/helpers/ImagesURL";
import ServiceImagesUrl from "@/helpers/serviceImagesURL";

const PropertyManagementContent: React.FC = () => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT: CONTENT */}
          <div>
            <h2 className="mb-8 hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
              Turnkey Property Management
            </h2>

            <p className="down_styling para_styling font-bold">
            Your property in Dubai can generate income—without your involvement.
            </p><br/>
             <p className="down_styling para_styling">
            Rental property is a profitable investment when managed by professionals. We handle every process — from property assessment and tenant selection to legal support and payment control.
            </p><br/>
            <p className="down_styling para_styling">
            Start with a rental market analysis and find out how much your property can earn today.
            </p>

            <button
              onClick={() => {
  const section = document.getElementById("list_with_us");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}}
              type="button"
              className="mt-10 w-fit bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 border-radius shadow-lg hover:shadow-xl cursor-pointer transition"
            >
              Get a Free Income Assessment
            </button>
          </div>

          {/* RIGHT: IMAGE */}
          <div className="w-full">
            <div className="w-full overflow-hidden change_border bg-black/5">
              <img
                src={ServiceImagesUrl("p_management_services_image.jpg")}
                alt="Services"
                className="w-full h-[280px] sm:h-[380px] lg:h-[520px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyManagementContent;