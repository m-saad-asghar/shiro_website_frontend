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
        <label className="text-[12px] text-dark capitalize font-NeueHaasGrotesk font-[600]">
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
          className="w-full h-full outline-none px-[16px] text-[15px] text-dark"
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
