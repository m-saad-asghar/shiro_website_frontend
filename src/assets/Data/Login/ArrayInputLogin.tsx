import Icons from "@/Constants/Icons";
import type { inputArraySubscribeType } from "@/Types";

const ArrayInputLogin: inputArraySubscribeType[] = [
  {
    id: 1,
    name: "email",
    placeholder: "Email Address",
    control: "input",
    type: "email",
    inptClass:
      "px-[8px] outline-none rounded-[4px] w-full h-[40px]  border-[2px] border-primary rounded-[4px] relative",
    isIcons: <Icons.MdOutlineEmail size={20} color="#094834" />,
  },
  {
    id: 2,
    name: "password",
    placeholder: "password",
    control: "input",
    type: "password",
    inptClass:
      "px-[8px] outline-none rounded-[4px]  w-full h-[40px]  border-[2px] border-primary rounded-[4px] relative",
    isIcons: <Icons.FaEyeSlash size={20} color="#094834" />,
  },
];
export default ArrayInputLogin;
