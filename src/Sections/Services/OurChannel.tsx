import { Card } from "@/Components/Services/OurChannel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carousel";

const OurChannel = () => {
  return (
    <div className="container h-full flex-col gap-[16px] py-[44px] md:py-[64px] lg:py-[88px]">
      <h2 className="text-[24px] md:text-[32px] lg:text-[40px] text-primary font-[600]">
        Our Channel Partners
      </h2>
      <p className="text-[12px] md:text-[14px] lg:text-[16px] text-dark font-[400] lg:w-[58%] leading-[160%]">
        Find out about our channel partners, each bringing a specialized
        approach supported by their deep understanding of Dubai’s Real Estate
        market. These entities deliver expert solutions in their respective
        fields, ranging from property management to investment consultancy.
        Whether you seek strategic property investment advice or all
        encompassing real estate support, you will find the best services
        tailored to your needs.
      </p>
      <div>
        <Carousel
          className="mt-[26px] w-[90%] md:w-[97%] lg:w-full"
          opts={{
            loop: false,
            align: "start",
          }}
        >
          <CarouselContent>
            <CarouselItem
              className="basis-1/1 md:basis-1/2 lg:basis-1/4 gap-[12px]"
              key={1}
            >
              {" "}
              <Card />
            </CarouselItem>
            <CarouselItem
              className="basis-1/1 md:basis-1/2 lg:basis-1/4 gap-[12px]"
              key={2}
            >
              {" "}
              <Card />
            </CarouselItem>
            <CarouselItem
              className="basis-1/1 md:basis-1/2 lg:basis-1/4 gap-[12px]"
              key={3}
            >
              {" "}
              <Card />
            </CarouselItem>
            <CarouselItem
              className="basis-1/1 md:basis-1/2 lg:basis-1/4 gap-[12px]"
              key={4}
            >
              {" "}
              <Card />
            </CarouselItem>
            <CarouselItem
              className="basis-1/1 md:basis-1/2 lg:basis-1/4 gap-[12px]"
              key={5}
            >
              {" "}
              <Card />
            </CarouselItem>
            <CarouselItem
              className="basis-1/1 md:basis-1/2 lg:basis-1/4 gap-[12px]"
              key={6}
            >
              {" "}
              <Card />
            </CarouselItem>
          </CarouselContent>
          <CarouselNext className=" cursor-pointer text-secandry" />
          <CarouselPrevious className=" cursor-pointer text-secandry" />
        </Carousel>
      </div>
    </div>
  );
};

export default OurChannel;
