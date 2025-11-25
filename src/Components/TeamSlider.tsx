import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ImagesUrl from "@/helpers/ImagesURL";
import Icons from "@/Constants/Icons";
import Images from "@/Constants/Images";

type TeamMember = {
  id: number;
  name: string;
  position: string;
  image: string;
  bio?: string;
};

type TeamSliderProps = {
  teamMembers: TeamMember[];
};

const TeamSlider: React.FC<TeamSliderProps> = ({ teamMembers }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

  // Calculate slides per view based on screen size
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3); // Desktop: 3 members
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2); // Tablet: 2 members
      } else {
        setSlidesPerView(1); // Mobile: 1 member
      }
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const totalSlides = Math.ceil(teamMembers.length / slidesPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const handleCardClick = (memberId: number) => {
    // Find member name to create slug
    const member = teamMembers.find((m: any) => m.id === memberId);
    // Create slug from name only - no ID needed
    const slug =
      member?.name
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "team-member";
    navigate(`/team-member/${slug}`);
  };

  const getVisibleMembers = () => {
    const startIndex = currentSlide * slidesPerView;
    return teamMembers.slice(startIndex, startIndex + slidesPerView);
  };

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icons.IoPerson className="text-gray-400 text-2xl" />
        </div>
        <p className="text-gray-500 text-lg">{t("No team members found")}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {getVisibleMembers().map((member) => (
          <div
            key={member.id}
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            onClick={() => handleCardClick(member.id)}
          >
            {/* Member Image */}
            <div className="relative mb-6">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={ImagesUrl(member.image)}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = Images.unknownPerson;
                  }}
                />
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-[#094834]/0 group-hover:bg-[#094834]/10 transition-all duration-300 rounded-xl"></div>

              {/* View Profile Button */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  className="bg-white text-[#094834] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#9f8151] hover:text-white transition-all duration-[.4s] cursor-pointer"
                  aria-label="View team member profile"
                >
                  {t("View Profile")}
                </button>
              </div>
            </div>

            {/* Member Info */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-[#094834] group-hover:text-[#9f8151] transition-colors duration-200">
                {member.name}
              </h3>
              <p className="text-gray-600 font-medium">{member.position}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {totalSlides > 1 && (
        <div className="flex flex-col items-center space-y-6">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-6">
            <button
              onClick={prevSlide}
              className="group w-12 h-12 bg-white border-2 border-[#094834]/30 text-[#094834] hover:bg-[#9f8151] hover:text-white hover:border-[#9f8151] rounded-full transition-all duration-[.4s] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={totalSlides <= 1}
              aria-label="Previous team member"
            >
              <Icons.IoIosArrowBack className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
              <span className="text-sm font-semibold text-[#094834]">
                {currentSlide + 1}
              </span>
              <span className="text-sm text-gray-500">/</span>
              <span className="text-sm text-gray-500">{totalSlides}</span>
            </div>

            <button
              onClick={nextSlide}
              className="group w-12 h-12 bg-white border-2 border-[#094834]/30 text-[#094834] hover:bg-[#9f8151] hover:text-white hover:border-[#9f8151] rounded-full transition-all duration-[.4s] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={totalSlides <= 1}
              aria-label="Next team member"
            >
              <Icons.IoIosArrowForward className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>

          {/* Dots Indicators */}
          <div className="flex space-x-3">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-[#094834]"
                    : "bg-gray-300 hover:bg-[#9f8151]"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Auto-play indicator */}
      {totalSlides > 1 && (
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
            <p className="text-sm text-[#094834] font-medium">
              {t("Click on any team member to view their details")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSlider;
