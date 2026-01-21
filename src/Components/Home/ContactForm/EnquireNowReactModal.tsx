import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactModal from "react-modal";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  isPossiblePhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import toast from "react-hot-toast";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  language: string;
  message: string;
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

type PhoneMeta = {
  iso2: string;
  dialCode: string;
  countryName: string;
};

type EnquireNowReactModalProps = {
  title?: string;
  origin?: string;

  // ✅ NEW (optional)
  display_name?: string;
  project_name?: string;

  trigger: (open: () => void) => React.ReactNode;
  maxWidthPx?: number;

  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  closeOnSuccess?: boolean;

  onSuccess?: (ctx: { values: FormValues; close: () => void }) => void | Promise<void>;
  onError?: (ctx: { error: unknown; values: FormValues }) => void;
};

const EnquireNowReactModal: React.FC<EnquireNowReactModalProps> = ({
  title = "Enquire Now",
  origin = "Lead From Contact Us Form",

  // ✅ NEW (default to "")
  display_name = "",
  project_name = "",

  trigger,
  maxWidthPx = 750,

  showSuccessToast = true,
  showErrorToast = true,
  successMessage = "Your Details have been Submitted Successfully. Our Team will Contact you Shortly.",
  errorMessage = "Something went wrong. Please try again.",
  closeOnSuccess = true,

  onSuccess,
  onError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const root = document.getElementById("root");
    if (root) ReactModal.setAppElement(root);
  }, []);

  const [values, setValues] = useState<FormValues>(initialValues);
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState<FormTouched>({
    name: false,
    email: false,
    phone: false,
    language: false,
    message: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // ✅ NEW: phone meta like reference code (NO UI/CSS change)
  const [phoneMeta, setPhoneMeta] = useState<PhoneMeta>({
    iso2: "",
    dialCode: "",
    countryName: "",
  });

  // ✅ robust UTM + click id collection (same as reference)
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

  // ✅ normalize phone (same as reference)
  const normalizePhoneNumber = (phone: string) => {
    if (!phone) return phone;
    const cleaned = phone.replace(/^(\d{1,4})0/, "$1");
    return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  };

  // ✅ E.164 (same as reference)
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

  const validate = (vals: FormValues): FormErrors => {
    const e: FormErrors = {};

    if (!vals.name.trim()) e.name = "Full name is required";

    if (!vals.email.trim()) e.email = "Email is required";
    else {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email.trim());
      if (!emailOk) e.email = "Enter a valid email";
    }

    if (!vals.phone.trim()) e.phone = "Phone number is required";
    else if (!isPossiblePhoneNumber("+" + vals.phone))
      e.phone = "Enter a valid phone number";

    if (!vals.language.trim()) e.language = "Preferred language is required";

    return e;
  };

  const errorStyle = useMemo(() => ({ fontSize: 12, color: "red" }), []);

  const inputBaseClass =
    "mobile_form_text w-full change_border border border-gray-200 px-4 py-4 outline-none focus:border-[#094834] focus:ring-2 focus:ring-[#094834]/20 transition rounded-lg";

  const labelClass = "text-sm font-medium text-gray-700";

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const key = e.target.name as keyof FormValues;
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validate(values));
  };

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

    // ✅ meta/tracking (same as reference Form.tsx)
    const tracking = getTrackingParams();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const platform = navigator.platform || "";
    const client_language = navigator.language || "";

    const phone_e164 = toE164(values.phone, phoneMeta.iso2);
    const phone_country_iso2 = phoneMeta.iso2 || "";
    const phone_dial_code = phoneMeta.dialCode || "";
    const phone_country_name = phoneMeta.countryName || "";

    const title_to_api = "Website Lead";

    const payload = {
      ...values,

      // ✅ new optional props (send if given else "")
      display_name: display_name || "",
      project_name: project_name || "",

      // ✅ phone normalization + extras
      phone: normalizePhoneNumber(values.phone),
      phone_e164,
      phone_country_iso2,
      phone_dial_code,
      phone_country_name,

      // ✅ client meta
      timezone,
      platform,
      client_language,

      // ✅ tracking
      ...tracking,

      // ✅ urls + labels
      landing_page_url: window.location.href,
      project_details_url: window.location.href,
      target_page: window.location.href,
      origin,
      title_to_api,
    };

    setLoading(true);

    try {
      const BASE_URL = import.meta.env.VITE_API_URL as string;
      if (!BASE_URL) throw new Error("VITE_API_URL missing in env");

      // ✅ ONLY backend call (Zapier removed from frontend)
      const res = await fetch(`${BASE_URL}/form_submission`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.status === 1) {
        if (showSuccessToast) toast.success(successMessage);
        if (onSuccess) await onSuccess({ values, close });

        setValues(initialValues);
        setErrors({});
        setTouched({
          name: false,
          email: false,
          phone: false,
          language: false,
          message: false,
        });

        // ✅ reset phone meta (no UI change)
        setPhoneMeta({ iso2: "", dialCode: "", countryName: "" });

        if (closeOnSuccess) close();
      } else {
        if (showErrorToast) toast.error(errorMessage);
        onError?.({ error: data, values });
      }
    } catch (err) {
      if (showErrorToast) toast.error(errorMessage);
      onError?.({ error: err, values });
    } finally {
      setLoading(false);
    }
  };

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
    <>
      {trigger(open)}

      <ReactModal
        isOpen={isOpen}
        onRequestClose={close}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        preventScroll={true}
        ariaHideApp={true}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          },
          content: {
            position: "relative",
            inset: "auto",
            width: "100%",
            maxWidth: `${maxWidthPx}px`,
            border: "none",
            borderRadius: "10px",
            padding: "0",
            // overflow: "hidden",
            maxHeight: "90vh",
            transform: "scale(0.9)",
            transformOrigin: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 2px 10px rgba(0,0,0,0.12)",
          },
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <h3 className="text-lg font-semibold text-[#094834]">{title}</h3>
          <button
            type="button"
            onClick={close}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6 bg-white">
          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
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
                {touched.name && errors.name ? <div style={errorStyle}>{errors.name}</div> : null}
              </div>

              <div className="space-y-2">
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
                  className={inputBaseClass}
                />
                {touched.email && errors.email ? <div style={errorStyle}>{errors.email}</div> : null}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
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

                            if (!val?.trim()) nextErrors.phone = "Phone number is required";
                            else if (!isPossiblePhoneNumber("+" + val))
                              nextErrors.phone = "Enter a valid phone number";
                            else delete nextErrors.phone;

                            return nextErrors;
                          });
                        }

                        return next;
                      });

                      // ✅ capture phone meta (no UI/CSS change)
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

                        if (!values.phone?.trim()) nextErrors.phone = "Phone number is required";
                        else if (!isPossiblePhoneNumber("+" + values.phone))
                          nextErrors.phone = "Enter a valid phone number";
                        else delete nextErrors.phone;

                        return nextErrors;
                      });
                    }}
                    inputProps={{ name: "phone", id: "phone", required: true }}
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
                    dropdownStyle={{ borderRadius: 10 }}
                    specialLabel=""
                  />
                </div>
                {touched.phone && errors.phone ? <div style={errorStyle}>{errors.phone}</div> : null}
              </div>

              <div className="space-y-2" ref={langRef}>
                <label className={labelClass} htmlFor="language">
                  Preferred Language
                </label>
                <input type="hidden" id="language" name="language" value={values.language} />

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
                  <span className={`${values.language ? "text-[#5E5C59]" : "text-gray-400"}`}>
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
            </div>

            <div className="space-y-2">
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
                className={`${inputBaseClass} min-h-[70px] resize-y`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[50px] rounded-lg bg-[#094834] hover:bg-[#9f8151] text-white font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </ReactModal>
    </>
  );
};

export default EnquireNowReactModal;
