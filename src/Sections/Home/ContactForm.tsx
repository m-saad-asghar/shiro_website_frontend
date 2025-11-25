import { useTranslation } from "react-i18next";
import { DataSocialMedia } from "../../assets/Data/Home";
import { Form } from "../../Components/Home";

const ContactForm = () => {
  const { t } = useTranslation();

  const onClick = (title: string, number?: string) => {
    if (title === "WhatsApp") {
      window.open(`https://wa.me/${number}`);
    } else if (title === "Phone" || title === "secondary Phone") {
      window.open(`tel:${number}`);
    } else if (title === "Email") {
      window.open(`mailto:${number}`);
    } else if (title === "Location") {
      // Open Shiro official map
      window.open("https://maps.app.goo.gl/uEsbMoYojDkhCpVw7");
    }
  };

  const renderSocialMedia = DataSocialMedia().map((item) => (
    <div
      className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-[#094834]/30"
      key={item.id}
      onClick={() => onClick(item?.title, item.desc)}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg bg-[#094834] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
          <div className="text-white text-lg [&>*]:text-white [&>*]:fill-white [&>*]:stroke-white">
            {item.icons}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#094834] mb-1 capitalize">
            {item.title}
          </h3>
          <p className="text-gray-600 font-medium group-hover:text-[#9f8151] transition-colors duration-300">
            {item.desc}
          </p>
        </div>

        <div className="text-[#094834] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  ));

  return (
    <section
      className="w-full py-12 md:py-10 lg:py-12 bg-gradient-to-br from-gray-50 to-white"
      id="ListYourProperty"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
              <span className="text-[#094834] font-medium text-sm">
                {t("Get In Touch")}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#094834] mb-6 leading-tight">
              {t("Speak with our Real Estate specialists today")}
            </h2>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {t(
                "Get in touch for tailored guidance from our expert team. We're committed to assisting you through each phase of your journey."
              )}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16 items-stretch">
            {/* Left Side - Contact Information */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex flex-col">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#094834] mb-2">
                  {t("Contact Information")}
                </h3>
                <p className="text-gray-600">
                  {t("Reach out to us through any of the following channels")}
                </p>
              </div>

              <div className="space-y-4 flex-grow flex flex-col justify-center">
                {renderSocialMedia}
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 md:p-10 flex flex-col">
              {/* Form header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#094834] mb-2">
                  {t("Get In Touch")}
                </h3>
                <p className="text-gray-600">
                  {t(
                    "Fill out the form below and we'll get back to you shortly"
                  )}
                </p>
              </div>

              {/* Form Component */}
              <div>
                <Form />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
