import { useTranslation } from "react-i18next";
import InputArraySubscribe from "@/assets/Data/Home/inputsArraySubscribe";
import FormikContainer from "@/Components/Forms/FormikContainer";
import UseQueryPost from "@/hooks/useQueryPost";
import { SubscribeServices } from "@/Services/Contact&Subscribe";
import type { FormikValues } from "formik";
import Icons from "@/Constants/Icons";
import subscribeValidationSchema from "@/Utils/Validations/subscribeValidation";

const initialValues = {
  name: "",
  email: "",
  agreeToTerms: false,
};

const StayInTheLoop = () => {
  const { t } = useTranslation();
  const inputArraySubscribe = InputArraySubscribe();

  const { mutateAsync } = UseQueryPost(
    ["subscribe"],
    SubscribeServices.subscribe,
    undefined,
    undefined,
    { success: t("Sent successfully") }
  );

  const onSubmit = (
    values: FormikValues,
    onSubmitProps: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    }
  ) => {
    // Remove agreeToTerms from the data sent to the API (frontend validation only)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { agreeToTerms, ...dataToSend } = values;

    mutateAsync(dataToSend)
      .then(() => {
        onSubmitProps.setSubmitting(false);
        onSubmitProps.resetForm();
      })
      .catch(() => {
        onSubmitProps.setSubmitting(false);
      });
  };

  return (
    <section className="py-12 md:py-10 lg:py-12 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold rounded-full px-6 py-3 mb-6">
              <Icons.MdOutlineEmail size={16} />
              <span>{t("Newsletter")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {t("Stay in the loop")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t(
                "Get to know about the latest real estate insights, market trends, and exclusive property opportunities delivered directly to your inbox."
              )}
            </p>
          </div>

          {/* Subscribe Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icons.IoIosInformationCircleOutline
                    size={24}
                    className="text-primary"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t("Subscribe to Our Newsletter")}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t("Never miss out on the latest updates")}
                  </p>
                </div>
              </div>

              <FormikContainer
                conClassName="space-y-4"
                onSubmit={onSubmit}
                initialValues={initialValues}
                arrayOnInputs={inputArraySubscribe}
                schema={subscribeValidationSchema}
                btnClass="w-full h-12 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                btnText={t("Subscribe Now")}
              />
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 lg:mt-16">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <Icons.IoTimeOutline size={28} className="text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t("Weekly Updates")}
              </h4>
              <p className="text-gray-600 text-sm">
                {t("Get the latest market insights every week")}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <Icons.IoStar size={28} className="text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t("Exclusive Offers")}
              </h4>
              <p className="text-gray-600 text-sm">
                {t("Access to premium properties and deals")}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <Icons.IoIosInformationCircleOutline
                  size={28}
                  className="text-primary"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t("Market Analysis")}
              </h4>
              <p className="text-gray-600 text-sm">
                {t("Expert insights and market trends")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StayInTheLoop;
