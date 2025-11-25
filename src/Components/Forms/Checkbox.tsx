import { Field } from "formik";
import type { FC, ReactNode } from "react";
import Icons from "@/Constants/Icons";

type CheckboxProps = {
  input: {
    id: number;
    name: string;
    label?: string | ReactNode;
    required?: boolean;
    className?: string;
  };
};

const Checkbox: FC<CheckboxProps> = ({ input }) => {
  return (
    <div className="flex items-start gap-3">
      <Field name={input.name}>
        {({ field }: any) => (
          <div className="flex items-start gap-3 w-full group">
            <div className="flex items-center h-6 mt-0.5">
              <div className="relative">
                <input
                  type="checkbox"
                  id={input.name}
                  {...field}
                  checked={field.value}
                  className="sr-only peer"
                />
                <label
                  htmlFor={input.name}
                  className="relative flex items-center justify-center w-6 h-6 rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all duration-300 ease-in-out
                  peer-checked:border-primary peer-checked:bg-primary
                  peer-focus:ring-2 peer-focus:ring-primary/20 peer-focus:ring-offset-2
                  hover:border-primary/60 hover:shadow-md
                  group-hover:border-primary/60"
                >
                  <Icons.IoCheckmark
                    className={`w-4 h-4 text-white transition-all duration-300 ease-in-out ${
                      field.value
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-50"
                    }`}
                  />
                </label>
                {/* Decorative corner accent - luxury touch */}
                <div
                  className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-secandry transition-all duration-300 ${
                    field.value ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                />
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor={input.name}
                className="text-sm text-gray-700 leading-relaxed cursor-pointer select-none transition-colors duration-300 group-hover:text-gray-900"
              >
                {input.label}
              </label>
            </div>
          </div>
        )}
      </Field>
    </div>
  );
};

export default Checkbox;
