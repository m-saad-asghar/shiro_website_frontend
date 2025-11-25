import Images from '@/Constants/Images';
import type { DataMarketPlaceType } from '@/Types';
import  { useMemo } from 'react';
import { useTranslation } from 'react-i18next';


const DataMarketPlace = () => {
    const { t } = useTranslation();
    
    const data:DataMarketPlaceType[] =useMemo(()=>[
                {
            id :1 ,
            icons :Images.imgPremierMarketplace1,
            title : t("Exclusive Access to Prime Properties"),
            desc :t("Gain priority access to exclusive listings and off-plan developments in Dubai’s top markets.")
        },
        {
            id :2 ,
            icons :Images.imgPremierMarketplace2,
            title: t("Proven Track Record of Success"),
            desc : t("Achieve your goals with our trusted expertise, delivering results for investors, buyers, and sellers.")
        },
        {
            id :3,
            icons :Images.imgPremierMarketplace3,
            title: t("Expert Guidance in Dubai’s Market"),
            desc :t("Make informed, profitable decisions with our strategic insights into Dubai's real estate market.")
        }   
    ],[t])
    return data
}

export default DataMarketPlace;
