import { Btn } from "@/Components";

const ExploreBox = () => {
    return (
        <div className="container h-full py-[44px] md:py-[64px] lg:py-[88px] "> 
            <div className="w-full rounded-[8px] h-[250px]  relative bg-imgExplore-about">
                <div className="bg-[rgba(0,0,0,.4)] w-full h-full absolute top-0 left-0 rounded-[8px]"></div>
                <div className="w-full h-full absolute top-0 flex-col justify-between px-[25px] md:px-[50px] py-[25px] md:py-[30px]">
                    <h3 className="text-[14px] md:text-[32px] font-[600] text-light">Explore our hot deals!</h3>
                    <p className="text-[12px] md:text-[14px] lg:text-[16px] font-[400] text-light">Connect with our seasoned agents to find out more about our services and exclusive offers.</p>
                <div className="flex-col md:flex-row gap-[15px] md:gap-[30px]">
                    <div className="md:w-[168px]">
                        <Btn text="schedule a meeting" type="secandry" />
                    </div>
                    <div className="md:w-[168px]">
                        <Btn text="schedule a meeting" type="secandry" />
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default ExploreBox;
