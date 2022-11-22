import {useEffect} from "react";
import {getSession} from "next-auth/react";
import {useDispatch, useSelector} from "react-redux";
import {selectUser, setUserData} from "../store/session-slice";

export default function UserSetup() {

    const dispatch = useDispatch()
    const user = useSelector(selectUser)

    useEffect(() => {
        if (user.username !== "") return
        getSession().then(session => {
            if (!session) return
            let opts = {method: "POST", body: user.username}
            fetch("/api/user/get-user-details", opts)
                .then(result => result.json()
                    .then(json => dispatch(setUserData(json)))
                )
        })
    },[])

    useEffect(() => {
        if (!user?.theme) return
        for (const [key, value] of Object.entries(user.theme)) {
            document.documentElement.style.setProperty(key, value)
        }
    }, [user])

    return null
}