import { useState, type FC } from "react";
import { Calendar } from "@/Components/ui/calendar";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
// import { FormikObjectType, StatusType } from '@/Types/type';
// import { ErrorMessage, Field, FieldProps, FormikErrors, FormikValues, useFormikContext } from 'formik';
import isValidDate from "@/helpers/isValidDate";
import {
  Field,
  type FieldProps,
  type FormikErrors,
  type FormikValues,
} from "formik";
import { useTranslation } from "react-i18next";
// import TextError from '../TextError';
// import { useTranslation } from 'react-i18next';
type DateInputs = {
  input: any;
  status?: any;
  errors?: FormikErrors<FormikValues>;
};
const DateInputs: FC<DateInputs> = ({ input }) => {
    const { t } = useTranslation()
  
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date("2025-06-01"));
  const [month, setMonth] = useState<Date | undefined>(date);
  // const { t } = useTranslation()
  return (
    <Field>
      {({ form }: FieldProps) => (
        <div className={`flex flex-col  ${input.conclassName}`}>
          <Label htmlFor={input.name} className={input.labelClassName}>
            {t(input.label)}
          </Label>
          <div className="relative flex gap-2  focus:shadow-none focus-visible:shadow-none focus:outline-none">
            <Input
              id="date"
              value={form.values[input.name]}
              placeholder={t(input.placeholder)}
              className={`${input.inptClass} pl-[22px] focus:shadow-none focus-visible:shadow-none focus:outline`}
              onChange={(e) => {
                const date = new Date(e.target.value);
                form.setFieldValue(input.name, e.target.value);
                if (isValidDate(date)) {
                  setDate(date);
                  setMonth(date);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setOpen(true);
                }
              }}
            />
            {/* <ErrorMessage name={input.name} component={TextError} /> */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="ghost"
                  className="absolute top-1/2 rtl:left-2 ltr:right-2 size-6 -translate-y-1/2"
                >
                  <CalendarIcon className="size-3.5" />
                  <span className="sr-only">Select date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0 bg-light"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  month={month}
                  onMonthChange={setMonth}
                  onSelect={(date) => {
                    if (date) {
                      setDate(date);
                      form.setFieldValue(
                        input.name,
                        format(date, "yyyy-MM-dd")
                      );
                    }
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </Field>
  );
};

export default DateInputs;
