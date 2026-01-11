import type { FC } from "react";
import Icons from "../../../Constants/Icons";
import type { DataCustomerServicesType } from "../../../Types";
import { useState } from "react";

type CardProps = {
  item: DataCustomerServicesType;
};

const Card: FC<CardProps> = ({ item }) => {
  const [isFlipped, setIsFlipped] = useState(true);

  const handleClick = () => {
    if (item?.onClick) {
      item.onClick();
    }
  };

  return (
    <>
      {/* Mobile & Tablet: Show only back side (always flipped) */}
      <div
        className="lg:hidden w-full h-[280px] perspective-1000 cursor-pointer"
        onClick={handleClick}
      >
        <div className="relative w-full h-full p-[24px] border border-primary/20 change_border shadow-xl flex items-center justify-center backdrop-blur-md">
          <div className="h-full flex flex-col justify-center items-center text-center">
            <div className="w-[48px] h-[48px] mb-4">
              <img
                src={item.img}
                className="w-full h-full opacity-80"
                alt={item.title || "Service icon"}
              />
            </div>
            <div>
              <h3 className="text-[16px] text-primary font-semibold mb-3 !text-[#9f8151] font-[16px]">
              {item.title}
            </h3>
            {/* <div className="transition-all duration-300 ml-[10px] !text-[#9f8151]">
              <Icons.RxArrowTopRight />
            </div> */}
            </div>
            <p className="down_styling para_styling">
              {item.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop: Show flipcard effect on hover */}
      <div
        className="hidden lg:block w-full h-[280px] perspective-1000 cursor-pointer"
        // onMouseEnter={() => setIsFlipped(true)}
        // onMouseLeave={() => setIsFlipped(false)}
        onClick={handleClick}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front Side */}
          <div
            className="absolute inset-0 w-full h-full p-[24px] border border-white/20 change_border shadow-xl flex items-center justify-center backdrop-blur-md"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="w-[80px] h-[80px] transition-all duration-300">
              <img
                src={item.img}
                className="w-full h-full object-contain"
                alt={item.title || "Service icon"}
              />
            </div>
          </div>

          {/* Back Side */}
          <div
            className="absolute inset-0 w-full h-full p-[32px] border border-primary/20 change_border"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="h-full flex flex-col">
              <div className="w-[48px] h-[48px] mb-4">
                <img
                  src={item.img}
                  className="w-full h-full opacity-80"
                  alt={item.title || "Service icon"}
                />
              </div>
              <div className="flex mt-8">
                <h3 className="text-[16px] text-primary font-semibold mb-3 !text-[#9f8151] font-[16px]">
                {item.title}
              </h3>
               <div className="transition-all duration-300 ml-[10px] !text-[#9f8151]">
                <Icons.RxArrowTopRight />
              </div>
              </div>
              <p className="!text-[14px] text-dark leading-relaxed !text-[#0b4a35] down_styling !leading-normal">
                {item.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
