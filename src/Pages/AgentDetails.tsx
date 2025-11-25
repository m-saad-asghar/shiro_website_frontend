import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import useQueryGet from "@/hooks/useQueryGet";
import UseQueryPost from "@/hooks/useQueryPost";
import AgentServices from "@/Services/AgentsServices";
import ContactAgent from "@/Services/ContactAgent";
import ImagesUrl from "@/helpers/ImagesURL";
import TeamSlider from "@/Components/TeamSlider";
import StaticServices from "@/Services/StaticServices";
import Icons from "@/Constants/Icons";
import Images from "@/Constants/Images";

const AgentDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    acceptTerms: false,
  });

  // Hook for sending contact form to agent
  const { mutateAsync, status: submitStatus } = UseQueryPost(
    ["contact-agent"],
    ContactAgent.Agent,
    undefined,
    undefined,
    { success: t("Message sent successfully to the agent") }
  );

  const { data: AllAgents, status } = useQueryGet(
    ["AllAgents"],
    AgentServices.AllAgent
  );

  const { data: ourTeam } = useQueryGet(["ourTeam"], StaticServices.OurTeam);

  // Find the specific agent
  const agent = AllAgents?.agents?.find(
    (agent: { id: number }) => agent.id === parseInt(id || "0")
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.phone || !formData.message) {
      return;
    }

    if (!formData.acceptTerms) {
      return;
    }

    // Check if agent ID exists
    if (!id) {
      return;
    }

    // Send message to agent
    mutateAsync({
      first_name: formData.name,
      phone_two: formData.phone,
      message: formData.message,
      agent_id: Number(id), // Convert to number
    })
      .then(() => {
        // Reset form on success
        setFormData({
          name: "",
          phone: "",
          message: "",
          acceptTerms: false,
        });
      })
      .catch(() => {
        // Error handling is done by the hook
      });
  };

  const handleContactClick = (type: string, value: string) => {
    if (type === "whatsapp") {
      window.open(`https://wa.me/${value}`);
    } else if (type === "phone") {
      window.open(`tel:${value}`);
    } else if (type === "email") {
      window.open(`mailto:${value}`);
    }
  };

  if (status === "pending") {
    return (
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3">
                <div className="w-full h-96 bg-gray-300 rounded-2xl"></div>
              </div>
              <div className="lg:w-2/3 space-y-4">
                <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                <div className="h-12 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error" || !agent) {
    return (
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              {t("Agent Not Found")}
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#9f8151] transition-all duration-[.4s]"
            >
              {t("Go Back")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {agent?.name || "Agent Details"} | Shiro Real Estate Agents Dubai
        </title>
        <meta
          name="description"
          content={`Meet ${
            agent?.name || "our real estate agent"
          }, an experienced property consultant at Shiro Real Estate. Contact for expert guidance on Dubai properties.`}
        />
      </Helmet>
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        {/* Agent Details Section */}
        <section className="team-details-area">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-center gap-8">
              <div className="lg:w-1/3">
                <div className="team-details-thumb">
                  <img
                    src={ImagesUrl(agent?.image)}
                    alt={agent?.name}
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = Images.unknownPerson;
                    }}
                  />
                </div>
              </div>
              <div className="lg:w-2/3">
                <div className="team-details-content">
                  <span className="sub-title">{t("Real Estate Agent")}</span>
                  <h2 className="title">{agent?.name}</h2>

                  <div className="td-contact">
                    <ul className="list-wrap space-y-2">
                      <li>
                        <button
                          onClick={() =>
                            handleContactClick("email", agent?.email)
                          }
                          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                        >
                          <Icons.MdOutlineEmail />
                          {agent?.email}
                        </button>
                      </li>
                      {agent?.contact_inf?.map(
                        (contact: {
                          id: number;
                          type: string;
                          value: string;
                        }) => (
                          <li key={contact.id}>
                            <button
                              onClick={() =>
                                handleContactClick(contact.type, contact.value)
                              }
                              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                            >
                              {contact.type === "phone" ? (
                                <Icons.LuPhone />
                              ) : (
                                <Icons.FaWhatsapp />
                              )}
                              {contact.value}
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="td-social">
                    <ul className="list-wrap">
                      <li>
                        <button className="social-btn">
                          <Icons.FaFacebook />
                        </button>
                      </li>
                      <li>
                        <button className="social-btn">
                          <Icons.FaInstagram />
                        </button>
                      </li>
                      <li>
                        <button className="social-btn">
                          <Icons.FaXTwitter />
                        </button>
                      </li>
                      <li>
                        <button className="social-btn">
                          <Icons.FaLinkedin />
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <p className="text-dark leading-relaxed">
                      {agent?.address && (
                        <>
                          <strong>{t("address")}:</strong> {agent?.address}
                        </>
                      )}
                    </p>
                    <p className="text-dark leading-relaxed">
                      {t(
                        "Our experienced real estate agent is dedicated to helping you find your perfect property in Dubai. With extensive knowledge of the local market and a commitment to exceptional service, we ensure a smooth and successful property transaction."
                      )}
                    </p>
                    <p className="text-dark leading-relaxed">
                      {t(
                        "Whether you're looking to buy, rent, or invest in Dubai's vibrant real estate market, our agent provides personalized guidance and professional expertise to meet your specific needs."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-form-area section-pb-140">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="section-title text-center mb-12">
                <span className="sub-title">{t("Leave a message")}</span>
                <h2 className="title">
                  {t("Contact with")} {agent?.name}
                </h2>
              </div>

              <div className="contact-form-wrap">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-grp">
                      <input
                        type="text"
                        name="name"
                        placeholder={t("Your name")}
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="form-grp">
                      <input
                        type="tel"
                        name="phone"
                        placeholder={t("Phone number")}
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="form-grp">
                    <textarea
                      name="message"
                      placeholder={t("Write message")}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      id="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="checkbox" className="text-sm text-dark">
                      {t("I accept")}{" "}
                      <span className="text-primary underline">
                        {t("Terms & Conditions")}
                      </span>{" "}
                      {t("for processing personal data")}
                    </label>
                  </div>
                  <div className="form-submit">
                    <button
                      type="submit"
                      disabled={
                        submitStatus === "pending" || !formData.acceptTerms
                      }
                      className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitStatus === "pending" ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {t("Sending...")}
                        </>
                      ) : (
                        t("Submit")
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-area section-py-140">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <div className="section-title">
                <span className="sub-title">{t("Leadership")}</span>
                <h2 className="title">
                  {t("Meet with our amazing team members")}
                </h2>
              </div>
            </div>

            <TeamSlider teamMembers={ourTeam?.team || []} />
          </div>
        </section>
      </div>
    </>
  );
};

export default AgentDetails;
