import { Card } from "@/Components/MeetOurTeam";
import { useMemo, type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoaderPage } from "@/Components";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image?: string;
  image_url?: string;
  team_type?: string;
  [key: string]: unknown;
}

interface PaginationInfo {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

type AllOurTeamProps = {
  item?:
    | TeamMember[] // Old structure: direct array
    | {
        // New structure: object with team_by_type
        team_by_type?: {
          management?: TeamMember[];
          brokers?: TeamMember[];
        };
      };
  pagination?: PaginationInfo;
  currentPage?: number;
  onPageChange?: (page: number) => void;
};

const AllOurTeam: FC<AllOurTeamProps> = ({
  item,
  pagination,
  currentPage = 1,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"management" | "brokers">(
    "management"
  );

  // Extract management and brokers from team_by_type
  // Support both new API structure and old structure
  const managementTeam = useMemo(() => {
    // New API structure: item.team_by_type.management
    if (item && !Array.isArray(item) && item.team_by_type?.management) {
      return item.team_by_type.management;
    }
    // Old structure: item as array, filter by team_type
    if (Array.isArray(item)) {
      return item.filter((member) => member.team_type === "management");
    }
    return [];
  }, [item]);

  const brokersTeam = useMemo(() => {
    // New API structure: item.team_by_type.brokers
    if (item && !Array.isArray(item) && item.team_by_type?.brokers) {
      return item.team_by_type.brokers;
    }
    // Old structure: item as array, filter by team_type
    if (Array.isArray(item)) {
      return item.filter((member) => member.team_type === "brokers");
    }
    return [];
  }, [item]);

  const renderManagementCards = useMemo(() => {
    return managementTeam?.map((member: TeamMember) => (
      <Card item={member} key={member.id} />
    ));
  }, [managementTeam]);

  const renderBrokersCards = useMemo(() => {
    return brokersTeam?.map((member: TeamMember) => (
      <Card item={member} key={member.id} />
    ));
  }, [brokersTeam]);

  // Show loading or no data message
  if (!item) {
    return (
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <LoaderPage message={t("Loading team members...")} size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (managementTeam.length === 0 && brokersTeam.length === 0) {
    return (
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-600 text-lg">
              {t("No team members found")}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              API Response: Check console for details
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pt-12 md:pb-2 md:pt-16 lg:pt-20 lg:pb-2">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-[#d3c294]/20 border border-[#d3c294]/30 rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-[#094834] rounded-full"></div>
              <span className="text-[#094834] font-medium text-sm">
                {t("Our Team")}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#094834] mb-6 leading-tight">
              {t("Meet Our Expert Team")}
            </h2>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {t(
                "Each team member brings a unique skill set to Shiro Dubai. We use those skills to provide you with the best possible Estate Agent service."
              )}
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab("management")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "management"
                  ? "bg-[#094834] text-white shadow-lg"
                  : "bg-white text-[#094834] border-2 border-[#094834] hover:bg-[#094834]/10"
              }`}
            >
              {t("Management")}{" "}
              {managementTeam.length > 0 && `(${managementTeam.length})`}
            </button>
            <button
              onClick={() => setActiveTab("brokers")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "brokers"
                  ? "bg-[#094834] text-white shadow-lg"
                  : "bg-white text-[#094834] border-2 border-[#094834] hover:bg-[#094834]/10"
              }`}
            >
              {t("Brokers")}{" "}
              {brokersTeam.length > 0 && `(${brokersTeam.length})`}
            </button>
          </div>

          {/* Team Grid */}
          {activeTab === "management" && managementTeam.length > 0 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                {renderManagementCards}
              </div>
            </div>
          )}

          {activeTab === "brokers" && brokersTeam.length > 0 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                {renderBrokersCards}
              </div>
            </div>
          )}

          {activeTab === "management" && managementTeam.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {t("No management team members found")}
              </p>
            </div>
          )}

          {activeTab === "brokers" && brokersTeam.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">{t("No brokers found")}</p>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination && pagination.last_page > 1 && onPageChange && (
            <div className="mt-12 flex flex-col items-center gap-6">
              {/* Pagination Info */}
              <div className="text-sm text-gray-600">
                {t("Showing")} {pagination.from} - {pagination.to} {t("of")}{" "}
                {pagination.total} {t("members")}
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                {/* First Page Button */}
                <button
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-[#094834] border-2 border-[#094834] hover:bg-[#094834] hover:text-white"
                  }`}
                >
                  {t("First")}
                </button>

                {/* Previous Button */}
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={!pagination.prev_page_url}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    !pagination.prev_page_url
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-[#094834] border-2 border-[#094834] hover:bg-[#094834] hover:text-white"
                  }`}
                >
                  {t("Previous")}
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show 5 pages around current page
                      return (
                        Math.abs(page - currentPage) <= 2 ||
                        page === 1 ||
                        page === pagination.last_page
                      );
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center gap-2">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => onPageChange(page)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                            currentPage === page
                              ? "bg-[#094834] text-white shadow-lg"
                              : "bg-white text-[#094834] border-2 border-[#094834] hover:bg-[#094834]/10"
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={!pagination.next_page_url}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    !pagination.next_page_url
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-[#094834] border-2 border-[#094834] hover:bg-[#094834] hover:text-white"
                  }`}
                >
                  {t("Next")}
                </button>

                {/* Last Page Button */}
                <button
                  onClick={() => onPageChange(pagination.last_page)}
                  disabled={currentPage === pagination.last_page}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === pagination.last_page
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-[#094834] border-2 border-[#094834] hover:bg-[#094834] hover:text-white"
                  }`}
                >
                  {t("Last")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllOurTeam;
