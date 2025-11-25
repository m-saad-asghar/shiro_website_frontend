import Icons from "@/Constants/Icons";
import type { inputArraySubscribeType } from "@/Types";

const ArrayInputSignUp: inputArraySubscribeType[] = [
  {
    id: 1,
    name: "name",
    placeholder: "name",
    control: "input",
    type: "text",
    inptClass:
      "px-[8px] outline-none rounded-[4px] w-full h-[40px]  border-[2px] border-primary rounded-[4px] relative",
    isIcons: <Icons.IoPersonCircleSharp size={20} color="#094834" />,
  },
  {
    id: 2,
    name: "email",
    placeholder: "email",
    control: "input",
    type: "email",
    inptClass:
      "px-[8px] outline-none rounded-[4px]  w-full h-[40px]  border-[2px] border-primary rounded-[4px] relative",
    isIcons: <Icons.MdOutlineEmail size={20} color="#094834" />,
  },
  {
    id: 3,
    name: "password",
    placeholder: "password",
    control: "input",
    type: "password",
    inptClass:
      "px-[8px] outline-none rounded-[4px]  w-full h-[40px]  border-[2px] border-primary rounded-[4px] relative",
    isIcons: <Icons.FaEyeSlash size={20} color="#094834" />,
  },
  {
    id: 4,
    name: "password_confirmation",
    placeholder: "password confirmation",
    control: "input",
    type: "password",
    inptClass:
      "px-[8px] outline-none rounded-[4px]  w-full h-[40px]  border-[2px] border-primary rounded-[4px] relative",
    isIcons: <Icons.FaEyeSlash size={20} color="#094834" />,
  },
  {
    id: 5,
    name: "birthday",
    placeholder: "birthday",
    control: "date",
    type: "text",
    inptClass:
      "px-[8px] outline-none rounded-[4px]  w-full h-[40px]  border-[2px] border-primary rounded-[4px] relative ",
    isIcons: <Icons.FaEyeSlash size={20} color="#094834" />,
  },
  {
    id: 6,
    name: "phone",
    placeholder: "phone",
    control: "input",
    type: "phone",
    inptClass:
      "px-[8px] outline-none rounded-[4px]  w-full h-[40px]  border-[2px] border-primary rounded-[4px] relative",
    isIcons: <Icons.LuPhone size={20} color="#094834" />,
  },
];
export default ArrayInputSignUp;
