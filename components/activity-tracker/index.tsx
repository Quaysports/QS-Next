import {useEffect} from "react";
import {useRouter} from "next/router";
import {signOut} from "next-auth/react";

export default function ActivityTracker(){

    const router = useRouter()
    let lastActive= Date.now()

    useEffect(()=>{
        if(router.pathname !== "/login" && process.env.NODE_ENV !== "development") {
            const interval = setInterval(() => {
                let now = Date.now()
                if (now > lastActive + 900000) signOut()
            }, 5000)
            return () => {
                clearInterval(interval)
            };
        }
    }, [])

    const handler = ()=>{
        lastActive = Date.now()
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
