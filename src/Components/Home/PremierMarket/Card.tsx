import type { DataMarketPlaceType } from "@/Types";
import type { FC } from "react";

type CardProps = {
  item: DataMarketPlaceType;
};
const Card: FC<CardProps> = ({ item }) => {
  return (
    <div
      className="w-full h-full border border-blue-100 p-[32px] rounded-[8px] flex-col shadow-xl gap-[24px] bg-secandry-400"
      key={item.id}
    >
      <div>
        <img src={item.icons} alt={item.title || "Premier Market icon"} />
      </div>
      <h3 className="text-[16px] font-[800]  text-primary duration-[.3s] cursor-pointer hover:text-light ">
        {item.title}
      </h3>
      <p className="text-[14px] font-[400] text-dark">{item.desc}</p>
    </div>
  );
};

export default Card;
