import React, { useMemo, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import toast from "react-hot-toast";

type FormValues = {
  name: string;
  phone: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;
type FormTouched = Record<keyof FormValues, boolean>;

const initialValues: FormValues = {
  name: "",
  phone: "",
};

const CallBackForm: React.FC = () => {
  const [values, setValues] = useState<FormValues>(initialValues);

  // ✅ FIXED: must be inside component + start false
  const [loading, setLoading] = useState<boolean>(false);

  const [touched, setTouched] = useState<FormTouched>({
    name: false,
    phone: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const containerClass = "w-full space-y-6";

  const validate = (vals: FormValues): FormErrors => {
    const e: FormErrors = {};

    if (!vals.name.trim()) e.name = "Full name is required";

    if (!vals.phone.trim()) {
      e.phone = "Phone number is required";
    } else if (!isPossiblePhoneNumber("+" + vals.phone)) {
      e.phone = "Enter a valid phone number";
    }

    return e;
  };

  const errorStyle = useMemo(() => ({ fontSize: 12, color: "red" }), []);

  const inputBaseClass =
    "w-full change_border border border-gray-200 px-4 py-4 outline-none focus:border-[#094834] focus:ring-2 focus:ring-[#094834]/20 transition";

  const labelClass = "text-sm text-[#0b3c2b]";

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const key = name as keyof FormValues;

    setValues((prev) => {
      const next = { ...prev, [key]: value } as FormValues;
      if (touched[key]) setErrors(validate(next));
      return next;
    });
  };

  const onBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const key = e.target.name as keyof FormValues;
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validate(values));
  };

  const sendToCrm = async (values: typeof initialValues) => {
  try {
    const target_page = window.location.href;

     const crmPayload = {
  fields: {
    TITLE: "Website Lead",

    NAME: values.name,

    EMAIL: [
      {
        VALUE: "",
        VALUE_TYPE: "WORK",
      },
    ],

    PHONE: [
      {
        VALUE: values.phone,
        VALUE_TYPE: "WORK",
      },
    ],

    COMMENTS: "",

    UF_CRM_1768051861: "",
    UF_CRM_1768053169: target_page,
    UF_CRM_1768053313: "Lead From Call Back Form",
  },
};

    // const crmPayload = {
    //   fields: {
    //     TITLE: "Lead From Website Callback Form",
    //     UF_CRM_1760777561731: target_page,
    //     NAME: values.name,
    //     PHONE_TEXT: values.phone,
    //     PHONE: [
    //       {
    //         VALUE: values.phone,
    //         VALUE_TYPE: "WORK",
    //       },
    //     ],
    //     EMAIL: [
    //       {
    //         VALUE: "",
    //         VALUE_TYPE: "WORK",
    //       },
    //     ],
    //     SOURCE_DESCRIPTION: "",
    //     SOURCE_ID: "WEB",
    //     ASSIGNED_BY_ID: 25,
    //     UF_CRM_1754652292782: target_page,
    //     UF_CRM_1761206533: "",
    //   },
    //   params: {
    //     REGISTER_SONET_EVENT: "Y",
    //   },
    // };
    const CRM_URL = import.meta.env.VITE_CRM_URL;

    await fetch(CRM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(crmPayload),
    });
  } catch (e) {
  }
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextTouched: FormTouched = {
      name: true,
      phone: true,
    };
    setTouched(nextTouched);

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      ...values,
      target_page: window.location.href,
    };

    setLoading(true);

    try {
      const BASE_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${BASE_URL}/form_submission_get_a_call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data?.status === 1) {
         sendToCrm(values);
        toast.success(
          "Your Details have been Submitted Successfully. Our Team will Contact you Shortly."
        );
        setValues(initialValues);
        setErrors({});
        setTouched({
          name: false,
          phone: false,
        });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={containerClass}>
      <form className={containerClass} onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="space-y-2 mb-[15px]">
          <label className={labelClass} htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter Full Name"
            value={values.name}
            onChange={onChange}
            onBlur={onBlur}
            className={inputBaseClass}
          />
          {touched.name && errors.name ? (
            <div style={errorStyle}>{errors.name}</div>
          ) : null}
        </div>

        {/* Phone */}
        <div className="space-y-2 mb-[15px]">
          <label className={labelClass} htmlFor="phone">
            Phone Number
          </label>

          <div className={inputBaseClass}>
            <PhoneInput
              country={"ae"}
              placeholder="+971 xxxxx xxxx"
              disableCountryCode={false}
              countryCodeEditable={false}
              enableSearch={true}
              searchPlaceholder="Search Country"
              value={values.phone}
              onChange={(val: string) => {
                setValues((prev) => {
                  const next = { ...prev, phone: val };

                  if (touched.phone) {
                    setErrors((prevErrors) => {
                      const nextErrors = { ...prevErrors };

                      if (!val?.trim())
                        nextErrors.phone = "Phone number is required";
                      else if (!isPossiblePhoneNumber("+" + val))
                        nextErrors.phone = "Enter a valid phone number";
                      else delete nextErrors.phone;

                      return nextErrors;
                    });
                  }

                  return next;
                });
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, phone: true }));

                setErrors((prevErrors) => {
                  const nextErrors = { ...prevErrors };

                  if (!values.phone?.trim())
                    nextErrors.phone = "Phone number is required";
                  else if (!isPossiblePhoneNumber("+" + values.phone))
                    nextErrors.phone = "Enter a valid phone number";
                  else delete nextErrors.phone;

                  return nextErrors;
                });
              }}
              inputProps={{
                name: "phone",
                id: "phone",
                required: true,
              }}
              containerStyle={{ width: "100%" }}
              inputStyle={{
                width: "100%",
                border: "none",
                outline: "none",
                boxShadow: "none",
                paddingTop: 0,
                fontSize: 16,
                paddingBottom: 0,
                height: "100%",
                background: "transparent",
                paddingLeft: "58px",
              }}
              buttonStyle={{
                border: "none",
                background: "transparent",
                borderRight: "1px solid #e5e7eb",
                paddingRight: "12px",
                marginRight: "12px",
              }}
              dropdownStyle={{
                borderRadius: 10,
              }}
              specialLabel=""
            />
          </div>

          {touched.phone && errors.phone ? (
            <div style={errorStyle}>{errors.phone}</div>
          ) : null}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="search_btn_styling change_border rounded-[4px] font-NeueHaasGrotesk !text-[16px] md:text-[14px] capitalize flex-center cursor-pointer search_btn_styling h-12 md:h-10 px-6 bg-primary hover:bg-[#9f8151] text-white font-semibold change_border transition-all duration-[.4s] flex items-center justify-center gap-2 flex-center w-full min-h-[50px] min-w-[200px] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default CallBackForm;