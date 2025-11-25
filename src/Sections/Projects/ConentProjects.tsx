import ImagesUrl from "@/helpers/ImagesURL";
import type { FC } from "react";
type ConentProjectsProps = {
  item: any;
};
const ConentProjects: FC<ConentProjectsProps> = ({ item }) => {
  return (
    <div className="container py-[16px]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.4fr] gap-[20px] md:gap-[33px] lg:gap-[50px]">
        <div className="w-full flex-col gap-[10px] md:gap-[15px]">
          <p className="text-[20px] md:text-[24px] font-[600] text-primary">
            {item?.name} Properties
          </p>
          <p className="text-[16px] font-[400] text-primary">
            {item?.description_top}
          </p>
        </div>
        <div className="w-full flex-center">
          <img src={ImagesUrl(item?.logo)} />
        </div>
      </div>
    </div>
  );
};

export default ConentProjects;
