import Btn from "@/Components/Btn";
import Icons from "@/Constants/Icons";
import ImagesUrl from "@/helpers/ImagesURL";
import { useNavigate } from "react-router-dom";
import type { FC } from "react";

type CardProps = {
  item: any;
};
const Card: FC<CardProps> = ({ item }) => {
  const navigate = useNavigate();

  const onClick = (name: string, number: string) => {
    if (name == "whatsapp") {
      window.open(`https://wa.me/${number}`);
    } else {
      window.open(`tel:${number}`);
    }
  };

  const handleCardClick = () => {
    navigate(`/agent/${item.id}`);
  };
  const renderSoucel = item?.contact_inf.map((item: any) => (
    <Btn
      key={item?.id}
      text={item?.type}
      type="secandry"
      onclick={() => onClick(item?.type, item?.value)}
      isIcons={item?.type == "phone" ? <Icons.LuPhone /> : <Icons.FaWhatsapp />}
      conClass="px-[0px]"
    />
  ));
  return (
    <div
      className="w-full h-full rounded-[8px] border border-secandry bg-light shadow-xl cursor-pointer hover:shadow-2xl transition-shadow duration-300"
      key={item.id}
      onClick={handleCardClick}
    >
      <div className="w-full h-[250px] flex items-center justify-center">
        <img
          src={ImagesUrl(item?.image)}
          className="w-full h-full rounded-[8px]"
        />
      </div>
      <div className="flex-col gap-[8px] p-[20px]">
        <p className="text-[14px] font-[600] text-primary capitalize">
          {item?.name}
        </p>
        {/* <p className="text-[12px] font-[300] text-dark capitalize">consultant - secondary sales</p> */}
        <p className="text-[12px] font-[300] text-dark capitalize">
          <span className="font-[600]">address :</span> {item?.address}
        </p>
        <div className="grid grid-cols-3 gap-[5px] pt-[15px]">
          <Btn
            text="email"
            type="secandry"
            isIcons=<Icons.MdOutlineEmail />
            onclick={() => {
              window.open(`mailto:${item?.email}`);
            }}
          />
          {renderSoucel}
        </div>
      </div>
    </div>
  );
};

export default Card;
