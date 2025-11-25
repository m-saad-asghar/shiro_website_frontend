import type { inputArraySubscribeType } from "@/Types";
import { useTranslation } from "react-i18next";

const InputArraySubscribe = () => {
  const { t } = useTranslation();

  const inputArraySubscribe: inputArraySubscribeType[] = [
    {
      id: 1,
      name: "name",
      placeholder: t("Your Name"),
      control: "input",
      type: "text",
      required: true,
      inptClass:
        "w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300",
    },
    {
      id: 2,
      name: "email",
      placeholder: t("Your Email Address"),
      control: "input",
      type: "email",
      required: true,
      inptClass:
        "w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300",
    },
    {
      id: 3,
      name: "agreeToTerms",
      control: "checkbox",
      required: true,
      label: (
        <>
          {t("By clicking Subscribe, you agree to our")}{" "}
          <a
            href="/terms-conditions"
            className="text-primary hover:text-primary/80 font-medium transition-colors underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Terms & Conditions")}
          </a>{" "}
          {t("and")}{" "}
          <a
            href="/privacy-policy"
            className="text-primary hover:text-primary/80 font-medium transition-colors underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Privacy Policy")}
          </a>
          .
        </>
      ),
    },
  ];
  return inputArraySubscribe;
};

export default InputArraySubscribe;
