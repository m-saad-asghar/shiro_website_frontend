// import { useTranslation } from "react-i18next"
// import "./Select.css"
import { memo, type FC } from "react";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
// import { TextError } from "../../"
type SelectProps = {
  input: any;
};
const Select: FC<SelectProps> = ({ input }) => {
  const { t } = useTranslation();
  const renderOptions = input?.arrayOfOptions?.map((option: any) => (
    <option value={option.value} key={option.id}>
      {t(option.name)}
    </option>
  ));
  return (
    <div className="w-full h-fit">
      {input?.label && (
        <label className="text-[12px] text-dark capitalize font-NeueHaasGrotesk font-[600] ">
          {t(input?.label)}
        </label>
      )}
      <Field
        as="select"
        name={input?.name}
        required={input.required}
        className="w-full h-[48px] border border-gray outline-none px-[12px] text-[15px] cursor-pointer"
      >
        <option disabled value="" hidden>
          {t("Select")}
        </option>
        {renderOptions}
      </Field>
      {/* <ErrorMessage name={name} component={TextError} /> */}
    </div>
  );
};

export default memo(Select);
