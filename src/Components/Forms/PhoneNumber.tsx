import Icons from "@/Constants/Icons";
// import { InputType } from '@/types/types'
import { ErrorMessage, Field, type FieldProps } from "formik";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput, {
  formatPhoneNumberIntl,
  getCountryCallingCode,
  parsePhoneNumber,
} from "react-phone-number-input";
// import ar from 'react-phone-number-input/locale/ar'

type PhoneNumberProps = {
  input: any;
};

const PhoneNumber: FC<PhoneNumberProps> = ({ input }) => {
  const { t, i18n } = useTranslation();

  // Filter to only show essential countries and set UAE as default
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
  const countries = essentialCountries.filter((country) => country !== "IL");

  const customLabels = countries.reduce((acc: any, country) => {
    const countryName = new Intl.DisplayNames(["en"], { type: "region" }).of(
      country
    );
    const countryCode = getCountryCallingCode(country as any);
    acc[country] = `${countryName} (+${countryCode})`;
    return acc;
  }, {});
  return (
    <div className="w-full h-fit ">
      {input?.label && (
        <label className="text-[12px] text-dark capitalize font-NeueHaasGrotesk font-[600] ">
          {t(input?.label)}
        </label>
      )}
      <div
        className={`flex items-center gap-x-[10px] relative ${input.className}`}
      >
        {input.icon}
        <Field name={input.name}>
          {({ form }: FieldProps) => (
            <PhoneInput
              className={`${
                i18n.language === "ar"
                  ? "direction-rtl phone-number"
                  : "direction-ltr"
              } h-10`}
              defaultCountry="AE"
              countries={countries as any}
              addInternationalOption={false}
              labels={customLabels}
              internationalIcon={() => <Icons.GiWorld />}
              placeholder={"123 45 500"}
              required={input.required}
              international={true}
              countryCallingCodeEditable={false}
              value={
                form.values[input.name]
                  ? formatPhoneNumberIntl(
                      form.values["prefix"] + form.values[input.name]
                    )
                  : ""
              }
              onChange={(value) => {
                if (value) {
                  const phoneNumber = parsePhoneNumber(value);
                  const countryCode = phoneNumber?.countryCallingCode;
                  const nationalNumber = phoneNumber?.nationalNumber;
                  form.setFieldValue(input.name, nationalNumber);
                  form.setFieldValue("prefix", countryCode);
                }
              }}
            />
          )}
        </Field>
        <ErrorMessage name={input.name} />
      </div>
    </div>
  );
};

export default PhoneNumber;
