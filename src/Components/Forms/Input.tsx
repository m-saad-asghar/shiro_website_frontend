import { Field } from "formik";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

type InputProps = {
  input: any;
};
const Input: FC<InputProps> = ({ input }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-fit">
      {input?.label && (
        <label className="font-bold text-primary text-[14px]">
          {t(input?.label)}
        </label>
      )}
      <div className={input.inptClass}>
        <Field
          as={input?.as}
          name={input.name}
          type={input.type}
          required={input.required}
          placeholder={t(input.placeholder)}
          className="flex-1 h-full text-[#5E5C59] placeholder-gray-400 input_text focus:outline-none bg-transparent w-[100%] input_styling"
        />
        {input?.isIcons && (
          <div className=" absolute top-[22%] rtl:left-[14px] ltr:right-[14px] w-[20px] h-[20px]">
            {input?.isIcons}
          </div>
        )}
        {/* <ErrorMessage name={inputObject.name} className="text-red-800" component={TextError} /> */}
      </div>
    </div>
  );
};

export default Input;
