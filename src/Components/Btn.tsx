import { type FC, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
// import { twMerge } from "tailwind-merge";

type BtnPropos = {
  text: any;
  type: "primary" | "outLine" | "secandry";
  conClass?: string;
  isIcons?: ReactNode;
  onclick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
};
const Btn: FC<BtnPropos> = ({
  text,
  isIcons,
  type,
  conClass,
  onclick,
  disabled,
  ariaLabel,
}) => {
  return (
    <button
      className={twMerge(
        `search_btn_styling h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold change_border transition-all duration-[.4s] flex items-center justify-center gap-2 ${
          type == "primary"
            ? "bg-primary hover:bg-[#9f8151] rounded-[4px]"
            : type == "secandry"
            ? "bg-secandry hover:bg-[#9f8151] rounded-[4px]"
            : type == "outLine"
            ? "bg-transparent border border-light rounded-[8px] hover:bg-[#9f8151]"
            : ""
        } text-light w-full px-[16px] font-NeueHaasGrotesk !text-[16px] md:text-[14px] font-[400] capitalize flex-center gap-[6px] h-[38px] md:h-[46px] cursor-pointer transition-all duration-[.4s]`,
        conClass
      )}
      onClick={onclick}
      disabled={disabled}
      aria-label={ariaLabel || text}
    >
      {isIcons}
      {text}
    </button>
  );
};

export default Btn;
