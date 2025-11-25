import type { FC } from "react";

type ContentBottomProps = {
    item :any
}
const ContentBottom:FC<ContentBottomProps> = ({item}) => {
  return (
    <div className="container h-full py-[44px] md:py-[64px] lg:py-[88px] flex-col gap-y-[15px] md:gap-y-[30px]">
      <h3 className="text-[24px] font-[600] text-primary">{item?.name} Properties</h3>
      <p className="text-[16px] font-[400] text-dark">{item?.description_bottom}</p>
    </div>
  );
};

export default ContentBottom;
