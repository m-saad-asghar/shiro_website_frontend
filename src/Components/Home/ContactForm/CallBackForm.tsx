import React, { useMemo, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  isPossiblePhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
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

type PhoneMeta = {
  iso2: string; // "ae", "us"
  dialCode: string; // "+971"
  countryName: string; // "United Arab Emirates"
};

type CallBackFormProps = {
  display_name?: string;
};

const CallBackForm: React.FC<CallBackFormProps> = ({ display_name = "" }) => {
  const [values, setValues] = useState<FormValues>(initialValues);

  const [loading, setLoading] = useState<boolean>(false);

  const [touched, setTouched] = useState<FormTouched>({
    name: false,
    phone: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // ✅ NEW: keep phone country meta (NO UI/CSS change)
  const [phoneMeta, setPhoneMeta] = useState<PhoneMeta>({
    iso2: "",
    dialCode: "",
    countryName: "",
  });

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

  // ✅ SAME as reference
  const getTrackingParams = () => {
    const sp = new URLSearchParams(window.location.search);
    const keys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "utm_id",
      "gclid",
      "gbraid",
      "wbraid",
      "gad_campaignid",
    ] as const;

    const out: Record<string, string> = {};
    keys.forEach((k) => {
      const v = sp.get(k);
      if (v) out[k] = v;
    });

    return out;
  };

  // ✅ SAME as reference
  const normalizePhoneNumber = (phone: string) => {
    if (!phone) return phone;
    const cleaned = phone.replace(/^(\d{1,4})0/, "$1");
    return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  };

  // ✅ SAME as reference
  const toE164 = (rawPhoneDigits: string, iso2?: string) => {
    if (!rawPhoneDigits) return "";
    const withPlus = rawPhoneDigits.startsWith("+")
      ? rawPhoneDigits
      : `+${rawPhoneDigits}`;

    const parsed = parsePhoneNumberFromString(
      withPlus,
      (iso2 || "").toUpperCase() as any
    );

    if (parsed?.isValid()) return parsed.number;
    return withPlus;
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

    // ✅ tracking/meta exactly like reference form
    const tracking = getTrackingParams();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const platform = navigator.platform || "";
    const client_language = navigator.language || "";

    // ✅ phone meta + e164 like reference
    const phone_e164 = toE164(values.phone, phoneMeta.iso2);
    const phone_country_iso2 = phoneMeta.iso2 || "";
    const phone_dial_code = phoneMeta.dialCode || "";
    const phone_country_name = phoneMeta.countryName || "";

    const payload = {
      ...values,

      // ✅ keep same normalization behavior
      phone: normalizePhoneNumber(values.phone),

      // ✅ include display_name (keep)
      display_name: display_name || "",

      // ✅ include all phone extras (same keys as reference)
      phone_e164,
      phone_country_iso2,
      phone_dial_code,
      phone_country_name,

      // ✅ include meta
      timezone,
      platform,
      client_language,

      // ✅ include tracking
      ...tracking,

      // ✅ include URLs + labels (same keys as reference)
      landing_page_url: window.location.href,
      project_details_url: window.location.href,
      target_page: window.location.href,
      title_to_api: "Website Lead",
      origin: "Lead From Call Back Form",
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
        toast.success(
          "Your Details have been Submitted Successfully. Our Team will Contact you Shortly."
        );
        setValues(initialValues);
        setErrors({});
        setTouched({
          name: false,
          phone: false,
        });

        // ✅ reset phone meta (NO UI change)
        setPhoneMeta({ iso2: "", dialCode: "", countryName: "" });
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
              onChange={(val: string, data: any) => {
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

                // ✅ capture phone meta (NO UI/CSS change)
                setPhoneMeta({
                  iso2: data?.countryCode || "",
                  dialCode: data?.dialCode ? `+${data.dialCode}` : "",
                  countryName: data?.name || "",
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
