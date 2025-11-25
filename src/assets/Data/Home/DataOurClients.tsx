import Images from '@/Constants/Images';
import type { DataOurClientsType } from '@/Types';
import  { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const DataOurClients = () => {
        const { t } = useTranslation();
    
    const data:DataOurClientsType[]=useMemo(()=>[
                {
            id :1 ,
            icons :Images.imgOurClient1,
            name : t("M. Zakariya"),
            time :t("11 months ago"),
            title: t("Found the Perfect Investment Property"),
            desc : t("Even though I’m an experienced investor, trying to invest in Dubai property for the first time was overwhelming. I was lost in a sea of options and didn’t know where to start. Shiro Real Estate came to the rescue.")
        },
        {
            id :2 ,
            icons :Images.imgOurClient1,
            name : t("M. Zakariya"),
            time :t("11 months ago"),
            title: t("Found the Perfect Investment Property"),
            desc : t("Even though I’m an experienced investor, trying to invest in Dubai property for the first time was overwhelming. I was lost in a sea of options and didn’t know where to start. Shiro Real Estate came to the rescue.")
        },
        {
            id :3 ,
            icons :Images.imgOurClient1,
            name : t("M. Zakariya"),
            time :t("11 months ago"),
            title: t("Found the Perfect Investment Property"),
            desc : t("Even though I’m an experienced investor, trying to invest in Dubai property for the first time was overwhelming. I was lost in a sea of options and didn’t know where to start. Shiro Real Estate came to the rescue.")
        },
    ],[t])
    return data

}

export default DataOurClients;
