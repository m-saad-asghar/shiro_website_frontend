import Images from "@/Constants/Images";
import type { DataOurTeamType } from "@/Types";
import { useMemo } from "react";

const DataOurTeam = () => {
    const data:DataOurTeamType[] =useMemo(()=>[
                {
                    id :1 ,
                    img :Images.imgOurTeam1,
                    name :"yujin Hong",
                    languages : "englesh , korean",
                    email : "email",
                    call : "call",
                    whatsApp : "whatsApp"
                },
                {
                    id :2 ,
                    img :Images.imgOurTeam1,
                    name :"yujin Hong",
                    languages : "englesh , korean",
                    email : "email",
                    call : "call",
                    whatsApp : "whatsApp"
                },
                {
                    id :3 ,
                    img :Images.imgOurTeam1,
                    name :"yujin Hong",
                    languages : "englesh , korean",
                    email : "email",
                    call : "call",
                    whatsApp : "whatsApp"
                },
    ],[])
    return data
}

export default DataOurTeam;
