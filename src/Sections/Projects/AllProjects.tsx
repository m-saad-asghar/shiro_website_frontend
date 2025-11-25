import { Pagination } from "@/Components";
import { ProjectCard } from "@/Components/Property";
import { LoaderSkeleton } from "@/Components";
import { useMemo, useState, type FC } from "react";

type AllProjectsProps = {
  item: any;
  status: any;
  pagination?: any;
  viewMode?: "grid" | "list";
  page?: number;
  setPage?: (page: number) => void;
};

const AllProjects: FC<AllProjectsProps> = ({
  item,
  status,
  pagination,
  viewMode = "grid",
  page = 1,
  setPage,
}) => {
  // for pagination - use local state if setPage not provided
  const [localPage, setLocalPage] = useState<number>(1);
  const currentPage = setPage ? page : localPage;
  const handlePageChange = (page: number) => {
    if (setPage) {
      setPage(page);
    } else {
      setLocalPage(page);
    }
  };

  // Debug: Log the data structure

  const renderCardProperties = item?.properties?.map((item: any) => {
    // Debug: Log each property item
    return <ProjectCard item={item} key={item.id} viewMode={viewMode} />;
  });

  const renderSkeltonCard = useMemo(() => {
    const skeletonCount = viewMode === "grid" ? 4 : 6;
    const className =
      viewMode === "grid"
        ? "h-[320px] w-full md:h-[450px]"
        : "h-[140px] w-full";
    return <LoaderSkeleton count={skeletonCount} className={className} />;
  }, [viewMode]);

  return (
    <div className="w-full">
      <div
        className={`w-full h-full ${
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 gap-[32px]"
            : "space-y-4"
        }`}
      >
        {status === "pending" || status === "error"
          ? renderSkeltonCard
          : renderCardProperties}
        <div className={viewMode === "grid" ? "md:col-span-2" : ""}>
          {pagination && (
            <Pagination
              className="w-full py-[20px]"
              lastPages={pagination?.last_page}
              page={currentPage}
              setPage={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
