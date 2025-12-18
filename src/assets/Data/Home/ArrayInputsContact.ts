import { useTranslation } from "react-i18next";

const ArrayInputsContact = () => {
  const { t } = useTranslation();

  return [
    {
      id: 1,
      name: "name",
      label: t("Full Name"),
      placeholder: t("Enter Your Full Name..."),
      control: "input",
      type: "text",
      required: true,
      inptClass:
        "w-full h-14 px-4 border border-gray-300 change_border focus:border-[#094834] focus:ring-2  focus:ring-[#094834]/20 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500",
      labelClass: "text-sm font-semibold text-[#094834] mb-2 block",
    },
    {
      id: 2,
      name: "email",
      label: t("Email Address"),
      placeholder: t("Enter Your Email Address..."),
      control: "input",
      type: "email",
      required: true,
      inptClass:
        "w-full h-14 px-4 border border-gray-300 change_border focus:border-[#094834] focus:ring-2  focus:ring-[#094834]/20 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500",
      labelClass: "text-sm font-semibold text-[#094834] mb-2 block",
    },
    {
      id: 3,
      name: "phone",
      label: t("Phone Number"),
      placeholder: t("Enter your phone number"),
      control: "phoneNumber",
      type: "",
      required: true,
      inptClass:
        "w-full h-14 px-4 border border-gray-300 change_border focus:border-[#094834] focus:ring-2  focus:ring-[#094834]/20 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500",
      labelClass: "text-sm font-semibold text-[#094834] mb-2 block",
    },
    {
      id: 4,
      name: "language",
      label: t("Preferred Language"),
      placeholder: t("Select your preferred language"),
      control: "select",
      type: "",
      required: true,
      inptClass:
        "w-full h-14 px-4 border border-gray-300 rounded-xl focus:border-[#094834] focus:ring-2 focus:ring-[#094834]/20 transition-all duration-200 bg-white text-gray-900",
      labelClass: "text-sm font-semibold text-[#094834] mb-2 block",
      arrayOfOptions: [
        {
          id: 1,
          name: t("English"),
          value: "en",
        },
        {
          id: 2,
          name: t("Arabic"),
          value: "ar",
        },
      ],
    },
    {
      id: 5,
      as: "textarea",
      control: "input",
      name: "message",
      label: t("Message"),
      placeholder: t(
        "Tell Us About your Requirements and We'll Get Back to you Shortly..."
      ),
      required: true,
      inptClass:
        "w-full h-32 px-4 py-4 input_styling border border-gray-300 change_border focus:border-[#094834] focus:ring-2 focus:ring-[#094834]/20 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 resize-none",
      labelClass: "text-sm font-semibold text-[#094834] mb-2 block input_styling",
    },
  ];
};

export default ArrayInputsContact;
