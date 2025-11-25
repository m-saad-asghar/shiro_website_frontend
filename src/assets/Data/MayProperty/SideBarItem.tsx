import Icons from '@/Constants/Icons';
import type { SideBarItemType } from '@/Types';
import Cookies from 'js-cookie';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SideBarItem = () => {
        const { t } = useTranslation();
      const navigate = useNavigate();
    const data:SideBarItemType[] = useMemo(()=>[
        {
            id : 1 ,
            title :t("back to website"),
            icons :<Icons.FaArrowUpRightFromSquare />,
            link : () => navigate("/")
        },
        {
            id :2 ,
            title : t("log out"),
            icons : <Icons.FaArrowRightToBracket />,
            link : ()=>{Cookies.remove("token") ;navigate("/")}
        }
    ],[t])
    return data
}

export default SideBarItem;
