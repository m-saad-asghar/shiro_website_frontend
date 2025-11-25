import { useMemo } from "react";
import Images from "../../../Constants/Images";
import type { dataPartnersType } from "../../../Types";

const DataPartners = () => {
    const data:dataPartnersType[] =useMemo(()=>[
                {
                    id : 1 ,
                    img : Images.imgPartners1,
                },
                {
                    id : 2 ,
                    img : Images.imgPartners2,
                },
                {
                    id : 3 ,
                    img : Images.imgPartners3,
                },
                {
                    id : 4 ,
                    img : Images.imgPartners4,
                },
                {
                    id : 5 ,
                    img : Images.imgPartners5,
                },
                {
                    id : 6 ,
                    img : Images.imgPartners6,
                },
                {
                    id : 7 ,
                    img : Images.imgPartners7,
                },
                {
                    id : 8 ,
                    img : Images.imgPartners8,
                },
                {
                    id : 9 ,
                    img : Images.imgPartners9,
                },
                {
                    id : 10 ,
                    img : Images.imgPartners10,
                },
    ],[])
    return data
}

export default DataPartners;
