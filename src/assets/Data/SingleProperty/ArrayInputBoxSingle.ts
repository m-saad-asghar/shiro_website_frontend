const ArrayInputBoxSingle = [
  {
    id: 1,
    name: "first_name",
    placeholder: "First name",
    control: "input",
    type: "text",
    required: true,
    inptClass: "w-full h-[48px] border border-gray rounded-[2px] mt-[8px] pl-[14px]",
  },
  {
    id: 2,
    name: "second_name",
    placeholder: "Last Name",
    control: "input",
    type: "text",
    required: true,
    inptClass: "w-full h-[48px] border border-gray rounded-[2px] mt-[8px] pl-[14px]",
  },
  {
    id: 3,
    name: "phone_two",
    placeholder: "",
    control: "phoneNumber",
    type: "",
    required: true,
    inptClass: "w-full h-[48px] border border-gray rounded-[2px] mt-[8px]",
  },
  {
    id: 4,
    as: "textarea",
    control: "input",
    name: "message",
    placeholder: "Message",
    required: true,
    inptClass:
      "w-full h-[100px] border border-gray rounded-[2px]  mt-[8px] p-[16px] capitalize text-[14px] outline-none text-dark",
  },
];
export default ArrayInputBoxSingle;
