import {useEffect, useState} from "react";
import {getSession} from "next-auth/react";
import {user} from "../server-modules/users/user";

export default function UserSetup() {

    const [user, setUser] = useState<user>(null)

    useEffect(() => {
        if (user === null) {
            getSession().then(session =>{ if(session) setUser(session.user)})
        } else {
            if(!user.theme) return
            for (const [key, value] of Object.entries(user.theme)) {
                document.documentElement.style.setProperty(key, value)
            }
        }
    })

    return null
}