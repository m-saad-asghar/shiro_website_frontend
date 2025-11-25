import type { inputArraySubscribeType } from "@/Types";

const ArrayInputCallUs: inputArraySubscribeType[] = [
  {
    id: 1,
    name: "name",
    placeholder: "Full Name",
    control: "input",
    type: "text",
    required: true,
    inptClass:
      "w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300",
  },
  {
    id: 2,
    name: "phone",
    placeholder: "Phone Number",
    control: "input",
    type: "tel",
    required: true,
    inptClass:
      "w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300",
  },
];
export default ArrayInputCallUs;
