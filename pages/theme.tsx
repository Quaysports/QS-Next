import {useEffect} from "react";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";

interface sessionObject extends Session{
    user: {
        name?: string;
        theme?:{[key:string]:string}
    }
}

export default function Theme(){
    const { data: session , status } = useSession()
    useEffect(()=>{
        if(status === "authenticated") {
            const sessionData = session as sessionObject
            if(!sessionData.user.theme) return
            for(const [key, value] of Object.entries(sessionData.user.theme)){
                document.documentElement.style.setProperty(key, value)
            }
        }
    },[status])

    return null
}