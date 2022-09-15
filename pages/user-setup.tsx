import {useEffect} from "react";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useDispatch} from "react-redux";
import {setActiveUser} from "../store/dashboard/user-slice";

interface sessionObject extends Session{
    user: {
        name?: string;
        theme?:{[key:string]:string}
    }
}

export default function UserSetup(){
    const { data: session , status } = useSession()
    const dispatch = useDispatch()
    useEffect(()=>{
        if(status === "authenticated") {
            const sessionData = session as sessionObject
            dispatch(setActiveUser(sessionData.user))
            if(!sessionData.user.theme) return
            for(const [key, value] of Object.entries(sessionData.user.theme)){
                document.documentElement.style.setProperty(key, value)
            }
        }
    },[status])

    return null
}