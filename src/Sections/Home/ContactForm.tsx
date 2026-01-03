import { useTranslation } from "react-i18next";
import { DataSocialMedia } from "../../assets/Data/Home";
import { Form } from "../../Components/Home";

const ContactForm = () => {
  const { t } = useTranslation();

 const formatUAEPhone = (number: string | null | undefined): string => {
  if (!number) return "";

  // Remove spaces, dashes, brackets, etc.
  let cleaned: string = number.replace(/[^0-9+]/g, "");

  // Ensure it starts with +971
  if (!cleaned.startsWith("+971")) {
    cleaned = "+971" + cleaned.replace(/^0/, "");
  }

  // Get the part after +971
  const rest = cleaned.replace("+971", "");

  // Mobile: +971 58 888 8461  (9 digits after 971)
  if (rest.length === 9) {
    const p1 = rest.slice(0, 2); // 58
    const p2 = rest.slice(2, 5); // 888
    const p3 = rest.slice(5);    // 8461
    return `+971 ${p1} ${p2} ${p3}`;
  }

  // Landline: +971 4 577 6496 (8 digits after 971)
  if (rest.length === 8) {
    const p1 = rest.slice(0, 1); // 4
    const p2 = rest.slice(1, 4); // 577
    const p3 = rest.slice(4);    // 6496
    return `+971 ${p1} ${p2} ${p3}`;
  }

  // Fallback (unknown pattern)
  return cleaned;
};




  const onClick = (title: string, number?: string) => {
    if (title === "WhatsApp") {
      const msg = encodeURIComponent(
        "Hello, I’m interested in your Real Estate Expertise. How can Shiro Estate assist me with my Next Purchase?"
      );
      window.open(`https://wa.me/${number}?text=${msg}`, "_blank");
    } else if (title === "Phone" || title === "secondary Phone") {
      window.open(`tel:${number}`);
    } else if (title === "Email") {
      window.open(`mailto:${number}`);
    } else if (title === "Location") {
      window.open("https://maps.app.goo.gl/uEsbMoYojDkhCpVw7");
    }
  };

  const renderSocialMedia = DataSocialMedia().map((item) => (
    <button
      key={item.id}
      type="button"
      onClick={() => onClick(item?.title, item.desc)}
      className="w-fit flex items-center gap-4 text-left group"
    >
      {/* Icon circle */}
      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
        <div className="text-[#9f8151] text-xl [&>*]:text-[#9f8151]  [&>*]:stroke-[#9f8151]">
          {item.icons}
        </div>
      </div>

      {/* Text block */}
      <div className="flex flex-col">
       <span className="font-semibold text-primary text-[16px]">
  {item.title}
</span>

        <span className="text-sm sm:text-base md:text-lg font-medium group-hover:text-[#9f8151] text-[#0b4a35] transition-colors duration-200 down_styling">
  {(() => {
    const rawTitle = item.title || "";
    const title = rawTitle.toLowerCase().trim();

    const isPhone =
      title === "phone" ||
      title === "secondary phone" ||
      title === "primary phone" ||
      title.includes("phone") ||
      title.includes("call");

    const isWhatsapp =
      title === "whatsapp" ||
      title.includes("whatsapp");

    return isPhone || isWhatsapp
      ? formatUAEPhone(String(item.desc || ""))
      : item.desc;
  })()}
</span>

      </div>
    </button>
  ));

  return (
    <section
      className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white !pb-5"
      id="ListYourProperty"
    >
      <div className="custom_container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* LEFT SIDE – Heading + contact details (Provident-style) */}
          <div className="space-y-8">
            <div className="space-y-4 contact_us_wrapper">
               <h1 className="hidden md:block w-full lg:w-[100%] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[64px] font-bold text-white drop-shadow-lg tracking-wide leading-tight content_general">
           {t("Speak with our Real Estate specialists today")}
          </h1>
          <p className="down_styling para_styling">
                {t(
                  "Get in touch for tailored guidance from our expert team. We're committed to assisting you through each phase of your journey."
                )}
</p>
              {/* <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {t(
                  "Get in touch for tailored guidance from our expert team. We're committed to assisting you through each phase of your journey."
                )}
              </p> */}
            </div>

            <div className="space-y-5 sm:space-y-6">
              {renderSocialMedia}
            </div>
          </div>

          {/* RIGHT SIDE – Form card */}
          <div className="bg-white change_border border border-gray-100 shadow-lg p-6 sm:p-8 lg:p-10">
            <div className="mb-4 sm:mb-6">
               <h1 className="font-semibold text-primary text-2xl">
           {t("GET IN TOUCH")}
          </h1>
              {/* <h3 className="text-xl sm:text-2xl font-bold text-[#094834] mb-2">
                {t("Get In Touch")}
              </h3> */}
                <p className="rounded-lg text-sm transition-all duration-200 mb-1 mt-1 text-[#9f8151] text_stying">
                {t("Fill out the form below and we'll get back to you shortly")}
</p>
              {/* <p className="text-sm sm:text-base text-gray-600">
                {t("Fill out the form below and we'll get back to you shortly")}
              </p> */}
            </div>

            <Form />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
