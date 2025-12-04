import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import Icons from "@/Constants/Icons";
import { ErrorMessage, Field, type FieldProps } from "formik";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

type PhoneNumberProps = {
  input: any;
};

const PhoneNumber: FC<PhoneNumberProps> = ({ input }) => {
  const { t, i18n } = useTranslation();

  const essentialCountries = [
    "AE",
    "SA",
    "KW",
    "QA",
    "BH",
    "OM",
    "EG",
    "JO",
    "LB",
    "US",
    "GB",
    "CA",
    "AU",
    "DE",
    "FR",
    "IT",
    "ES",
    "IN",
    "PK",
    "BD",
    "PH",
    "TH",
    "MY",
    "SG",
    "JP",
    "KR",
    "CN",
  ];

  const onlyCountries = essentialCountries.map((c) => c.toLowerCase());

  return (
    <div className="w-full h-fit">
      {input?.label && (
        <label className="font-bold text-primary text-[14px]">
          {t(input?.label)}
        </label>
      )}

      <div
        className={`flex items-center gap-x-[10px] relative mt-1 ${input.className}`}
      >
        {input.icon}

        <Field name={input.name}>
          {({ form }: FieldProps) => {
            const prefix = form.values["prefix"] || "";
            const national = form.values[input.name] || "";
            // const fullValue = `${prefix}${national}`;
            const fullValue = `${prefix}${national}`;

            return (
              <PhoneInput
  country={"ae"}
  // onlyCountries={onlyCountries}
  enableSearch
  searchPlaceholder="Search Country..."
  disableSearchIcon
  dropdownStyle={{ maxHeight: "300px", overflowY: "auto" }}
  placeholder="50 123 4567"
  value={fullValue}
  inputStyle={{ minHeight: 56, fontSize: 16 }}
  countryCodeEditable={false}   // 🔥 <— ADD THIS LINE
  // main wrapper
  containerClass={`w-full flex-1 ${
    i18n.language === "ar"
      ? "direction-rtl phone-number"
      : "direction-ltr"
  }`}
  // input field (force Tailwind over library defaults)
  inputClass="!w-full !h-11 !border !border-gray-300 change_border !pl-12 !pr-3 !bg-white text-[#5E5C59] placeholder-gray-500 text-base"
  // country button next to input
  buttonClass="!border !border-gray-300 !rounded-l-md !bg-white"
  // dropdown list
  dropdownClass="!bg-white !border !border-gray-200 !shadow-lg !text-sm !z-50"
  onChange={(value, data: any) => {
    const dialCode = data?.dialCode || "";
    let nationalNumber = value || "";

    if (dialCode && nationalNumber.startsWith(dialCode)) {
      nationalNumber = nationalNumber.slice(dialCode.length);
    }

    form.setFieldValue("prefix", dialCode);
    form.setFieldValue(input.name, nationalNumber);
  }}
  inputProps={{
    name: input.name,
    required: input.required,
  }}
/>

            );
          }}
        </Field>

        <ErrorMessage name={input.name} />
      </div>
    </div>
  );
};

export default PhoneNumber;
