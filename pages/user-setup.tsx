import {useEffect} from "react";
import {getSession} from "next-auth/react";
import {useDispatch, useSelector} from "react-redux";
import {selectUser, setUserData} from "../store/session-slice";

export default function UserSetup() {

    const dispatch = useDispatch()
    const user = useSelector(selectUser)

    useEffect(() => {
        if (user.username !== "") return
        getSession().then(session =>{ if(session) dispatch(setUserData(session.user))})
    })

    useEffect(()=>{
        if(!user?.theme) return
        for (const [key, value] of Object.entries(user.theme)) {
            document.documentElement.style.setProperty(key, value)
        }
    },[user])

    return null
}