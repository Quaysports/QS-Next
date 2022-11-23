import React, {useEffect, useState} from "react";
import {signOut, useSession} from "next-auth/react";
import style from './customisation-popup.module.css'
import {User} from "../../server-modules/users/user";

/**
 * Renders a form that allows the user to change the primary colour of the website
 */
export default function CustomisationPopup() {

    const [user,setUser] = useState<User | undefined>(undefined)
    const [primaryColor, setPrimaryColor] = useState("#586221")
    const session = useSession().data

    useEffect(() => {
        !user
            ? setUser(session?.user)
            : setPrimaryColor(user.theme?.['--primary-color'])
    },[session, user])

    async function handleColorChange(key:string, e:React.FocusEvent<HTMLInputElement>) {
        if(!user) return
        const newUserData = {...user, ...{theme:{[key]:e.target.value}}}
        const opts = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(newUserData)}
        await fetch('/api/user/update-user', opts)
        setUser(newUserData)
    }

    async function resetTheme() {
        const data = {...{username: user?.username}, ...{theme: {}}}
        const opts = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)}
        await fetch('/api/user/update-user', opts)
    }

    return (
        <div>
            <p>Re-login required to apply colour changes!</p>
            <div className={style["colours-table"]}>
                <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) =>{
                        setPrimaryColor(e.target.value)
                        document.documentElement.style.setProperty('--primary-color', e.target.value)
                    }}
                    onBlur={(e) => handleColorChange('--primary-color', e)}/>
                <label>Primary Colour</label>
            </div>
            <div className={style.buttons}>
                <button onClick={async () => {
                    await signOut();
                    window.location.reload()
                }}>Re-login</button>
                <button onClick={async () => {
                    await resetTheme()
                    await signOut();
                    window.location.reload()
                }}>Reset Theme</button>
            </div>
        </div>

    )
}