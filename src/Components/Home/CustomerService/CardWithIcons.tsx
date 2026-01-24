import type { FC, ReactNode } from "react";
import { useState } from "react";
import Icons from "../../../Constants/Icons";
import type { ContactDataService } from "../../../Types";

type CardProps = {
  item: ContactDataService;
};

const CardWithIcons: FC<CardProps> = ({ item }) => {
  const [isFlipped] = useState(true);

  const handleClick = () => {
    if (item?.onClick) item.onClick();
  };

  const renderIconImage = (img: unknown, alt: string): ReactNode => {
    if (!img) return null;

    // If img is a URL/string -> use <img />
    if (typeof img === "string") {
      return (
        <img
          src={img}
          className="w-full h-full opacity-80 object-contain"
          alt={alt}
        />
      );
    }

    // Otherwise it's probably a ReactNode (svg/icon/component)
    return <>{img as ReactNode}</>;
  };

  return (
    <>
      {/* ================= MOBILE & TABLET ================= */}
      <div
        className="lg:hidden w-full h-[280px] perspective-1000 cursor-pointer"
        onClick={handleClick}
      >
        <div className="relative w-full h-full p-[24px] border border-primary/20 change_border shadow-xl flex items-center justify-center backdrop-blur-md">
          <div className="h-full flex flex-col justify-center items-center text-center">
            {/* ICON/IMAGE */}
            <div className="w-[48px] h-[48px] mb-4 flex items-center justify-center">
              {renderIconImage(item.img, item.title || "Service icon")}
            </div>

            <h3 className="text-[16px] font-semibold mb-3 !text-[#9f8151]">
              {item.title}
            </h3>

            <p className="down_styling para_styling">{item.desc}</p>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP (FLIP CARD) ================= */}
      <div
        className="hidden lg:block w-full h-[280px] perspective-1000 cursor-pointer"
        onClick={handleClick}
      >
        <div
          className="relative w-full h-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ---------- FRONT ---------- */}
          <div
            className="absolute inset-0 w-full h-full p-[24px] border border-white/20 change_border shadow-xl flex items-center justify-center backdrop-blur-md"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-[#9f8151] text-6xl transition-all duration-300">
              {item.img}
            </div>
          </div>

          {/* ---------- BACK ---------- */}
          <div
            className="absolute inset-0 w-full h-full p-[32px] border border-primary/20 change_border"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="h-full flex flex-col">
              {/* ICON/IMAGE */}
              <div className="w-[58px] h-[58px] mb-4 flex items-center justify-center">
                {renderIconImage(item.img, item.title || "Service icon")}
              </div>

              {/* TITLE + ARROW */}
              <div className="flex items-center mt-8">
                <h3 className="text-[16px] font-semibold mb-3 !text-[#9f8151]">
                  {item.title}
                </h3>
                <div className="ml-2 !text-[#9f8151]">
                  <Icons.RxArrowTopRight />
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="!text-[14px] leading-relaxed !text-[#0b4a35] down_styling">
                {item.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardWithIcons;