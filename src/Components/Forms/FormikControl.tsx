import type { FC } from "react";
import Input from "./Input";
import PhoneNumber from "./PhoneNumber";
import Select from "./Select";
import DateInputs from "./DateInputs";
import Checkbox from "./Checkbox";

type FormikControlProps = {
  input: any;
};

const FormikControl: FC<FormikControlProps> = ({ input }) => {
  switch (input.control) {
    case "input":
      return <Input input={input} />;
    case "phoneNumber":
      return <PhoneNumber input={input} />;
    case "select":
      return <Select input={input} />;
    case "date":
      return <DateInputs input={input} />;
    case "checkbox":
      return <Checkbox input={input} />;
  }
};

export default FormikControl;
