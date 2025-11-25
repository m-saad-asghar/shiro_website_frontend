import Icons from "@/Constants/Icons";
import Btn from "../Btn";

const Card = () => {
  return (
    <div className="w-full h-full bg-light rounded-[8px] border border-secandry-400 shadow-md">
      <div className="w-full h-[272px] relative">
        <img
          src=""
          className="w-full h-full rounded-t-[8px]"
          alt="Project image"
        />
        <div className="px-[16px] py-[10px] bg-red-500 absolute rounded-[8px] top-[8px] left-[8px]">
          <p className="text-[12px] font-[600] text-light capitalize ">
            apartment
          </p>
        </div>
        <div className="px-[16px] py-[10px] bg-secandry rounded-[8px] absolute bottom-[8px] right-[8px]">
          <p className="text-[12px] font-[600] text-light capitalize">2025</p>
        </div>
      </div>

      <div className="p-[20px] flex-col gap-y-[5px]">
        <p className="text-[18px] font-[600] text-primary capitalize">
          Jumeirah Residences Emirates Towers
        </p>
        <p className="text-[14px] font-[300] text-primary capitalize">
          by <span className="font-[600]">meraas</span>
        </p>
        <p className="text-[16px] font-[300] text-primary capitalize">
          Starting Price{" "}
          <span className="font-[600] text-secandry text-[18px]">
            {" "}
            USD 955K
          </span>
        </p>
        <div className="my-[8px] flex items-center gap-[20px]">
          <div className="flex items-center gap-[6px]">
            <Icons.CiLocationOn size={20} color="#A3A3A3" />
            <span className="capitalize text-[14px] text-primary font-[400] ">
              Emirates Towers
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.6666 12.6667V10.6667M14.6666 10.6667V8C14.6666 6.52724 13.4727 5.33333 12 5.33333H7.99998V10.6667M14.6666 10.6667H7.99998M7.99998 10.6667H1.33331M1.33331 10.6667V4M1.33331 10.6667V12.6667M5.99999 7.33333C5.99999 8.06973 5.40303 8.66667 4.66665 8.66667C3.93027 8.66667 3.33332 8.06973 3.33332 7.33333C3.33332 6.59695 3.93027 6 4.66665 6C5.40303 6 5.99999 6.59695 5.99999 7.33333Z"
                stroke="#07234B"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            <span className="capitalize text-[14px] text-primary font-[400]">
              1, 2, 3, 4
            </span>
          </div>
        </div>
        <div>
          <p className="text-[14px] font-[400] text-dark">
            Rising alongside Dubai’s iconic skyline, Jumeirah Residences
            Emirates Towers by Meraas introduces a new benchmark in elevated
            city living. From stylish 1-bedroom apartmen{" "}
            <p className="text-[14px] font-[800] cursor-pointer text-secandry underline">
              more
            </p>
          </p>
        </div>
        <div className="grid grid-cols-3 gap-[12px] pt-[20px]">
          <Btn type="secandry" text="email" isIcons=<Icons.MdOutlineEmail /> />
          <Btn type="secandry" text="call" isIcons=<Icons.LuPhone /> />
          <Btn type="secandry" text="whatsApp" isIcons=<Icons.FaWhatsapp /> />
        </div>
      </div>
    </div>
  );
};

export default Card;
