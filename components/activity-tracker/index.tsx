import {useEffect} from "react";
import {signOut} from 'next-auth/react'
import {useRouter} from "next/router";

export default function ActivityTracker(){

    const router = useRouter()
    let activityTimer:NodeJS.Timeout

    const handler = ()=>{
        if(router.pathname === "/login" || process.env.NODE_ENV === "development") return
        clearTimeout(activityTimer)
        activityTimer = setTimeout(()=>{signOut()},60000)
    }

    useEffect(()=>{
        document.addEventListener('mousemove', handler, false)
        document.addEventListener('mousedown', handler, false)
        document.addEventListener('keydown', handler, false)

        return ()=> {
            document.removeEventListener('mousemove', handler, true)
            document.removeEventListener('mousedown', handler, true)
            document.removeEventListener('keydown', handler, true)
        }

    },[])
    return null
}