// PropertyManagementContent.tsx
import React from "react";
import ImagesUrl from "@/helpers/ImagesURL";
import ServiceImagesUrl from "@/helpers/serviceImagesURL";
import Icons from "@/Constants/Icons";
import { useTranslation } from "react-i18next";
import EnquireNowReactModal from "@/Components/Home/ContactForm/EnquireNowReactModal";

const PropertyManagementWhyUs: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-white">
      <div className="mx-auto py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

  {/* IMAGE */}
  <div className="w-full order-2 lg:order-1">
    <div className="w-full overflow-hidden change_border bg-black/5">
      <img
        src={ServiceImagesUrl("why_us_image copy.avif")}
        alt="Property management services"
        className="w-full h-[280px] sm:h-[380px] lg:h-[520px] object-cover"
        loading="lazy"
      />
    </div>
  </div>

  {/* CONTENT */}
  <div className="order-1 lg:order-2">
    <h2 className="mb-8 hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
      Why Choose Us
    </h2>

    <p className="down_styling para_styling font-bold">
      A trusted partner in the UAE market.
    </p>
    <br />
    <p className="down_styling para_styling">
      We work with residential and commercial real estate across the UAE and understand the real expectations of tenants and investors.
    </p>
    <br />

    <div className="space-y-4">
      {["Individual Approach", "Income Maximization", "Full Transparency"].map(
        (item) => (
          <div key={item} className="flex items-center gap-3">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Icons.IoIosArrowForward size={16} className="text-white" />
            </div>
            <span className="font-semibold text-primary text-xl">
              {t(item)}
            </span>
          </div>
        )
      )}
    </div>

     <EnquireNowReactModal
  title={t("CONTACT US")}
  origin={t("Click | Contact Us Button | Property Management Page")}
  showSuccessToast={true}
  showErrorToast={true}
  closeOnSuccess={true}
  trigger={(open) => (
    <button
      type="button"
      onClick={open}
      className="mt-10 w-fit bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 border-radius shadow-lg hover:shadow-xl cursor-pointer transition"
    >
      {t("Contact Us")}
    </button>
  )}
/>

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
      Get a Free Income Assessment
    </button> */}
  </div>

</div>

      </div>
    </section>
  );
};

export default PropertyManagementWhyUs;
