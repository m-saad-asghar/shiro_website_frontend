// ServicesContent.tsx
import React from "react";
import ImagesUrl from "@/helpers/ImagesURL";

const ServicesContent: React.FC = () => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT: CONTENT */}
          <div>
            <h2 style={{paddingBottom: 15}} className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
              Your Trusted Real Estate Partner
            </h2>

            <p className="down_styling para_styling">
            With Shiro Estate, you gain a strategic partner with world-class expertise. We manage real estate transactions remotely, ensuring safety, efficiency, and optimal terms, no matter where you are. Our role is more than advisory — we act as your strategic operator, sourcing properties, crafting strategies, leading negotiations, and overseeing every legal and financial detail.
            </p><br/>
             <p className="down_styling para_styling">
            We focus on what matters most to our clients — whether it’s identifying and analyzing high-yield properties, securing optimal mortgage and financing solutions, or providing full rental management, oversight, and asset value enhancement. Our specialists ensure a seamless and transparent process from start to finish.
            </p>

            {/* <button
              onClick={() => {
  const section = document.getElementById("list_with_us");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}}
              type="button"
              className="mt-10 w-fit bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 border-radius shadow-lg hover:shadow-xl cursor-pointer transition"
            >
              Enquire now
            </button> */}
          </div>

          {/* RIGHT: IMAGE */}
          <div className="w-full">
            <div className="w-full overflow-hidden change_border bg-black/5">
              <img
                src={ImagesUrl("services_side_image.jpeg")}
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

export default ServicesContent;