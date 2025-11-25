import Images from "@/Constants/Images";

const Card = () => {
  return (
    <div className="w-full h-full  bg-transparent">
      <div className="w-full h-[160px] ">
        <img
          src={Images.imgOurChannel}
          className="w-full h-full"
          alt="Our Channel image"
        />
      </div>
      <div className="py-[24px] flex-col gap-[8px]">
        <p className="text-[18px] font-[600] text-primary">
          precision inspection
        </p>
        <p className="text-[16px] font-[400] text-dark leading-[160%]">
          Ensuring perfection with the best property inspection and snagging
          services
        </p>
      </div>
    </div>
  );
};

export default Card;
