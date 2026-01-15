import React, { useEffect, useMemo, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import toast from "react-hot-toast";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  language: string;
  message: string; // optional
};

type FormErrors = Partial<Record<keyof FormValues, string>>;
type FormTouched = Record<keyof FormValues, boolean>;

const initialValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  language: "",
  message: "",
};

const Form: React.FC = () => {
  const [values, setValues] = useState<FormValues>(initialValues);

  // ✅ FIXED: must be inside component + start false
  const [loading, setLoading] = useState<boolean>(false);

  const [touched, setTouched] = useState<FormTouched>({
    name: false,
    email: false,
    phone: false,
    language: false,
    message: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const containerClass = "w-full space-y-6";

  const validate = (vals: FormValues): FormErrors => {
    const e: FormErrors = {};

    if (!vals.name.trim()) e.name = "Full name is required";

    if (!vals.email.trim()) {
      e.email = "Email is required";
    } else {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email.trim());
      if (!emailOk) e.email = "Enter a valid email";
    }

    if (!vals.phone.trim()) {
      e.phone = "Phone number is required";
    } else if (!isPossiblePhoneNumber("+" + vals.phone)) {
      e.phone = "Enter a valid phone number";
    }

    if (!vals.language.trim()) e.language = "Preferred language is required";

    return e;
  };

  const errorStyle = useMemo(() => ({ fontSize: 12, color: "red" }), []);

  const inputBaseClass =
    "mobile_form_text w-full change_border border border-gray-200 px-4 py-4 outline-none focus:border-[#094834] focus:ring-2 focus:ring-[#094834]/20 transition";

  const labelClass = "";

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

 const sendToZapier = async (values: FormValues) => {
  const ZAPIER_URL = import.meta.env.VITE_ZAPIER_HOOK as string;

  console.log("ZAPIER_URL USED:", ZAPIER_URL); // 🔴 IMPORTANT DEBUG

  if (!ZAPIER_URL) {
    throw new Error("Zapier URL missing in env");
  }

  const target_page = window.location.href;

  const params = new URLSearchParams();
  params.append("TITLE", "Website Lead");
  params.append("NAME", values.name);
  params.append("EMAIL", values.email);
  params.append("PHONE", values.phone);
  params.append("COMMENTS", values.message || "");
  params.append("LANGUAGE", values.language);
  params.append("TARGET_PAGE", target_page);
  params.append("origin", "Lead From Contact Us Form");

  const res = await fetch(ZAPIER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Zapier failed: ${res.status} ${text}`);
  }
};


//   const sendToCrm = async (values: typeof initialValues) => {
//     try {
//       const target_page = window.location.href;

//         const crmPayload = {
//   fields: {
//     TITLE: "Website Lead",
//     NAME: values.name,
//     EMAIL: values.email,
//     PHONE: values.phone,
//     COMMENTS: values.message,
//     LANGUAGE: values.language,
//     TARGET_PAGE: target_page,
//     origin: "Lead From Contact Us Form",
//   },
// };

// //       const crmPayload = {
// //   fields: {
// //     TITLE: "Website Lead",

// //     NAME: values.name,

// //     EMAIL: [
// //       {
// //         VALUE: values.email,
// //         VALUE_TYPE: "WORK",
// //       },
// //     ],

// //     PHONE: [
// //       {
// //         VALUE: values.phone,
// //         VALUE_TYPE: "WORK",
// //       },
// //     ],

// //     COMMENTS: values.message,

// //     UF_CRM_1768051861: values.language,
// //     UF_CRM_1768053169: target_page,
// //     UF_CRM_1768053313: "Lead From Contact Us Form",
// //   },
// // };


//       const VITE_ZAPIER_HOOK = import.meta.env.VITE_ZAPIER_HOOK;

//       await fetch(VITE_ZAPIER_HOOK, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(crmPayload),
//       });
//     } catch (e) {}
//   };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextTouched: FormTouched = {
      name: true,
      email: true,
      phone: true,
      language: true,
      message: true,
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

      const res = await fetch(`${BASE_URL}/form_submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data?.status === 1) {
        await sendToZapier(values);
        // sendToCrm(values);
        toast.success(
          "Your Details have been Submitted Successfully. Our Team will Contact you Shortly."
        );
        setValues(initialValues);
        setErrors({});
        setTouched({
          name: false,
          email: false,
          phone: false,
          language: false,
          message: false,
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

  // ✅ FIX: custom language dropdown for mobile (native select popover bug)
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!langRef.current) return;
      if (!langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, []);

  return (
    <div className={containerClass}>
      <form className={`${containerClass} mobile-form`} onSubmit={handleSubmit}>
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
            className={`${inputBaseClass} mobile_form_text`}
          />
          {touched.name && errors.name ? (
            <div style={errorStyle}>{errors.name}</div>
          ) : null}
        </div>

        {/* Email */}
        <div className="space-y-2 mb-[15px]">
          <label className={labelClass} htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter Email Address"
            value={values.email}
            onChange={onChange}
            onBlur={onBlur}
            className={`${inputBaseClass} mobile_form_text`}
          />
          {touched.email && errors.email ? (
            <div style={errorStyle}>{errors.email}</div>
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
              inputClass="mobile_form_text"
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

        {/* Preferred Language (✅ custom dropdown, fixes mobile popover issue) */}
        <div className="space-y-2 mb-[15px]" ref={langRef}>
          <label className={labelClass} htmlFor="language">
            Preferred Language
          </label>

          {/* keeps same form field name */}
          <input
            type="hidden"
            id="language"
            name="language"
            value={values.language}
            className="mobile_form_text"
          />

          <button
            type="button"
            onClick={() => setLangOpen((p) => !p)}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, language: true }));
              setErrors(validate(values));
            }}
            className={`${inputBaseClass} flex items-center justify-between bg-white`}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
          >
            <span
              className={`${values.language ? "text-[#5E5C59]" : "text-gray-400"}`}
            >
              {values.language ? values.language : "Select Preferred Language"}
            </span>
            <span className="text-gray-500">▾</span>
          </button>

          {langOpen && (
            <div className="relative">
              <div
                className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] overflow-hidden"
                role="listbox"
              >
                {["English", "Arabic"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition flex items-center justify-between"
                    onClick={() => {
                      setValues((prev) => ({ ...prev, language: opt }));
                      setTouched((prev) => ({ ...prev, language: true }));
                      setErrors((prevErrors) => {
                        const nextErrors = { ...prevErrors };
                        delete nextErrors.language;
                        return nextErrors;
                      });
                      setLangOpen(false);
                    }}
                  >
                    <span>{opt}</span>
                    {values.language === opt ? (
                      <span className="text-[#094834] font-semibold">✓</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          )}

          {touched.language && errors.language ? (
            <div style={errorStyle}>{errors.language}</div>
          ) : null}
        </div>

        {/* Message */}
        <div className="space-y-2 mb-[15px]">
          <label className={labelClass} htmlFor="message">
            Message
          </label>
         <textarea
  id="message"
  name="message"
  placeholder="Tell Us About your Requirements and We'll Get Back to you Shortly..."
  value={values.message}
  onChange={onChange}
  onBlur={onBlur}
  className={`${inputBaseClass} min-h-[160px] resize-y mobile-message-textarea`}
/>
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

export default Form;
