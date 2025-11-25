import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import useQueryGet from "@/hooks/useQueryGet";
import StaticServices from "@/Services/StaticServices";
import ImagesUrl from "@/helpers/ImagesURL";
import TeamSlider from "@/Components/TeamSlider";
import Icons from "@/Constants/Icons";
import Images from "@/Constants/Images";

const TeamMemberDetails = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();

  // Convert slug back to member name (replace hyphens with spaces)
  // Example: "ahmed-ali" -> "Ahmed Ali"
  const getMemberNameFromSlug = (
    slug: string | undefined
  ): string | undefined => {
    if (!slug) return undefined;
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const memberName = getMemberNameFromSlug(slug);

  // Fetch all team members to find the specific one
  const { data: ourTeamData } = useQueryGet(
    ["ourTeam"],
    StaticServices.OurTeam
  );

  // Find the specific team member by name
  const teamMember = useMemo(() => {
    if (!ourTeamData || !memberName) return undefined;

    // Support both new API structure (team_by_type) and old structure (team array)
    const allMembers: any[] = ourTeamData?.team_by_type
      ? [
          ...(ourTeamData.team_by_type.management || []),
          ...(ourTeamData.team_by_type.brokers || []),
        ]
      : ourTeamData?.team || [];

    return allMembers.find((member: any) => {
      const memberNameNormalized = member?.name?.toLowerCase().trim();
      const searchNameNormalized = memberName?.toLowerCase().trim();

      // Exact match
      if (memberNameNormalized === searchNameNormalized) {
        return true;
      }

      // Slug format match
      const memberSlug = memberNameNormalized?.replace(/\s+/g, "-");
      const searchSlug = slug?.toLowerCase();
      if (memberSlug === searchSlug) {
        return true;
      }

      // Partial match (contains)
      if (
        memberNameNormalized?.includes(searchNameNormalized || "") ||
        searchNameNormalized?.includes(memberNameNormalized || "")
      ) {
        return true;
      }

      return false;
    });
  }, [ourTeamData, memberName, slug]);

  const status = teamMember ? "success" : ourTeamData ? "error" : "pending";

  // Fetch all team members for the slider (reuse the same data)
  const ourTeam = ourTeamData;

  if (status === "pending") {
    return (
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-1/3">
                    <div className="w-full aspect-square bg-gray-200 rounded-2xl"></div>
                  </div>
                  <div className="lg:w-2/3 space-y-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (status === "error" || !teamMember) {
    return (
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icons.IoIosInformationCircleOutline className="text-red-500 text-3xl" />
                </div>
                <h1 className="text-3xl font-bold text-[#094834] mb-4">
                  {t("Team Member Not Found")}
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  {t(
                    "The team member you're looking for doesn't exist or has been removed."
                  )}
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#094834] text-white rounded-xl hover:bg-[#9f8151] transition-all duration-[.4s] font-semibold"
              >
                <Icons.FaLongArrowAltLeft className="text-sm" />
                {t("Go Back")}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {teamMember?.name || "Team Member"} | Shiro Real Estate Team Dubai
        </title>
        <meta
          name="description"
          content={
            teamMember?.bio ||
            `Learn about ${teamMember?.name || "our team member"}, ${
              teamMember?.position || "a professional"
            } at Shiro Real Estate specializing in Dubai properties.`
          }
        />
      </Helmet>
      <div className="w-full h-full pt-[120px] md:pt-[140px] lg:pt-[127.2px]">
        {/* Team Member Details Section */}
        <section className="w-full pt-12 md:pt-16 lg:pt-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Image Section */}
                <div className="lg:w-1/3">
                  <div className="relative group">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl">
                      <img
                        src={
                          teamMember?.image_url || ImagesUrl(teamMember?.image)
                        }
                        alt={teamMember?.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = Images.unknownPerson;
                        }}
                      />
                    </div>

                    {/* Social Media Buttons - Only show if has_social_media is true */}
                    {teamMember?.has_social_media && (
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
                        {teamMember?.social_links?.facebook && (
                          <a
                            href={teamMember.social_links.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-[#094834] text-white rounded-full flex items-center justify-center hover:bg-[#9f8151] transition-all duration-[.4s] cursor-pointer"
                          >
                            <Icons.FaFacebook className="text-sm" />
                          </a>
                        )}
                        {teamMember?.social_links?.instagram && (
                          <a
                            href={teamMember.social_links.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-[#094834] text-white rounded-full flex items-center justify-center hover:bg-[#9f8151] transition-all duration-[.4s] cursor-pointer"
                          >
                            <Icons.FaInstagram className="text-sm" />
                          </a>
                        )}
                        {teamMember?.social_links?.linkedin && (
                          <a
                            href={teamMember.social_links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-[#094834] text-white rounded-full flex items-center justify-center hover:bg-[#9f8151] transition-all duration-[.4s] cursor-pointer"
                          >
                            <Icons.FaLinkedin className="text-sm" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-2/3">
                  <div className="space-y-6">
                    {/* Position Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-6 py-3">
                      <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
                      <span className="text-[#094834] font-medium text-sm">
                        {teamMember?.position}
                      </span>
                    </div>

                    {/* Name */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#094834] leading-tight">
                      {teamMember?.name}
                    </h1>

                    {/* Bio */}
                    {teamMember?.bio && (
                      <div className="space-y-4">
                        <p className="text-lg text-gray-700 leading-relaxed">
                          {teamMember.bio}
                        </p>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {teamMember?.experience && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-[#094834] text-white rounded-lg flex items-center justify-center">
                            <Icons.IoSettingsOutline className="text-sm" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {t("Experience")}
                            </p>
                            <p className="font-semibold text-[#094834]">
                              {teamMember.experience}
                            </p>
                          </div>
                        </div>
                      )}
                      {teamMember?.formatted_languages && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-[#094834] text-white rounded-lg flex items-center justify-center">
                            <Icons.IoSettingsOutline className="text-sm" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {t("Languages")}
                            </p>
                            <p className="font-semibold text-[#094834]">
                              {teamMember.formatted_languages}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teamMember?.phone && (
                        <a
                          href={`tel:${teamMember.phone}`}
                          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="w-10 h-10 bg-[#094834] text-white rounded-lg flex items-center justify-center">
                            <Icons.LuPhone className="text-sm" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {t("Phone")}
                            </p>
                            <p className="font-semibold text-[#094834]">
                              {teamMember.phone}
                            </p>
                          </div>
                        </a>
                      )}
                      {teamMember?.whatsapp && (
                        <a
                          href={`https://wa.me/${teamMember.whatsapp.replace(
                            /[^0-9]/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="w-10 h-10 bg-[#094834] text-white rounded-lg flex items-center justify-center">
                            <Icons.FaWhatsapp className="text-sm" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {t("WhatsApp")}
                            </p>
                            <p className="font-semibold text-[#094834]">
                              {teamMember.whatsapp}
                            </p>
                          </div>
                        </a>
                      )}
                    </div>

                    {/* Areas of Expertise */}
                    {teamMember?.areas_of_expertise && (
                      <div className="p-4 bg-[#094834]/5 rounded-xl">
                        <p className="text-sm text-gray-500 mb-2">
                          {t("Areas of Expertise")}
                        </p>
                        <p className="text-[#094834] font-semibold">
                          {teamMember.areas_of_expertise}
                        </p>
                      </div>
                    )}

                    {/* Developers of Expertise */}
                    {teamMember?.developers_of_expertise && (
                      <div className="p-4 bg-[#094834]/5 rounded-xl">
                        <p className="text-sm text-gray-500 mb-2">
                          {t("Developers of Expertise")}
                        </p>
                        <p className="text-[#094834] font-semibold">
                          {teamMember.developers_of_expertise}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-6 py-3 mb-6">
                  <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
                  <span className="text-[#094834] font-medium text-sm">
                    {t("Our Team")}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#094834] mb-6 leading-tight">
                  {t("Meet Our Amazing Team")}
                </h2>

                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  {t(
                    "Discover the talented professionals who make Shiro Real Estate the leading agency in Dubai."
                  )}
                </p>
              </div>

              <TeamSlider
                teamMembers={
                  ourTeam?.team_by_type
                    ? [
                        ...(ourTeam.team_by_type.management || []),
                        ...(ourTeam.team_by_type.brokers || []),
                      ]
                    : ourTeam?.team || []
                }
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TeamMemberDetails;
