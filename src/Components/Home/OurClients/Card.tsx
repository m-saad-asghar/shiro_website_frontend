import Images from "@/Constants/Images";
import ImagesUrl from "@/helpers/ImagesURL";
import type { FC } from "react";

type CardProps = {
  item: any;
};

const Card: FC<CardProps> = ({ item }) => {
  return (
    <div
      className="w-full h-full p-[30px] rounded-[8px] shadow-xl border border-secandry-400"
      key={item.id}
    >
      <div className="flex items-center gap-[16px]">
        <div className="w-[70px] h-[70px]">
          {item?.image == null ? (
            <img
              src={Images.imgOurClient1}
              className="w-full h-full"
              alt="Client avatar"
            />
          ) : (
            <img
              src={ImagesUrl(item?.image)}
              className="w-full h-full"
              alt={item?.name || "Client avatar"}
            />
          )}
        </div>
        <div>
          <h5 className="text-[16px] font-[600] text-primary">{item.name}</h5>
          <p className="text-[12px] font-[400] text-dark">{item?.date}</p>
        </div>
      </div>
      <div className="mt-[22px] flex flex-col gap-[16px]">
        <h5 className="text-[18px] font-[600] text-primary">{item.title}</h5>
        <p className="text-[16px] font-[400] text-dark">{item.description}</p>
      </div>
    </div>
  );
};

export default Card;
