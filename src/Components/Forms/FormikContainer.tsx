import { Form, Formik, type FormikHelpers, type FormikValues } from "formik";
import { useCallback, type FC, type ReactNode } from "react";
import FormikControl from "./FormikControl";
import Btn from "../Btn";
import type { ObjectSchema } from "yup";

type FormikContainerProps = {
  initialValues: FormikValues;
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>
  ) => void;
  arrayOnInputs: any;
  conClassName?: string;
  btnClass: string;
  btnText: string;
  children?: ReactNode;
  schema?: ObjectSchema<any>;
};

const FormikContainer: FC<FormikContainerProps> = ({
  initialValues,
  onSubmit,
  arrayOnInputs,
  conClassName,
  btnText,
  btnClass: _btnClass,
  children,
  schema,
}) => {
  const renderInputs = useCallback(() => {
    return (
      <>
        {arrayOnInputs?.map((input: any) => {
          return <FormikControl input={input} key={input.id} />;
        })}
      </>
    );
  }, []);
  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {(formik) => {
          return (
            <>
              <Form className={conClassName}>{renderInputs()}</Form>
              {children}
              <div className="mt-4" style={{display: "flex", justifyContent: "center"}}>
                <Btn
                  type="primary"
                  text={btnText}
                  conClass="search_btn_styling h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold change_border transition-all duration-[.4s] flex items-center justify-center gap-2 flex-center w-fit min-h-[50px] min-w-[200px]"
                  onclick={formik.submitForm}
                  disabled={formik.isSubmitting || !formik.isValid}
                />
              </div>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default FormikContainer;
