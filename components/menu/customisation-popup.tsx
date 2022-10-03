import React, {useEffect, useState} from "react";
import {getSession, signOut} from "next-auth/react";
import style from './customisation-popup.module.css'
import {User} from "../../server-modules/users/user";


/**
 * Renders a form that allows the user to change the primary colour of the website
 */
export default function CustomisationPopup() {

    const [user,setUser] = useState<User | undefined>(undefined)
    const [primaryColor, setPrimaryColor] = useState("#586221")

    useEffect(() => {
        if(user === null) getSession().then(session=>setUser(session?.user))
        if (user?.theme?.['--primary-color']) setPrimaryColor(user.theme['--primary-color'])
    })

    async function handleColorChange(key:string, e:React.FocusEvent<HTMLInputElement>) {
        const data = {...{username: user?.username}, ...{theme: {[key]: e.target.value}}}
        const opts = {method: "POST", body: JSON.stringify(data)}
        await fetch('/api/user/update-user', opts)
    }

    async function resetTheme() {
        const data = {...{username: user?.username}, ...{theme: {}}}
        const opts = {method: "POST", body: JSON.stringify(data)}
        await fetch('/api/user/update-user', opts)
    }

    return (
        <div>
            <p>Re-login required to apply colour changes!</p>
            <div className={style["colours-table"]}>
                <input
                    key={primaryColor}
                    type="color"
                    defaultValue={primaryColor}
                    onChange={(e)=>document.documentElement.style.setProperty('--primary-color', e.target.value)}
                    onBlur={(e) => handleColorChange('--primary-color', e)}/>
                <label>Primary Colour</label>
            </div>
            <div className={style.buttons}>
                <button onClick={async () => {
                    await signOut();
                    window.location.reload()
                }}>Re-login
                </button>
                <button onClick={async () => {
                    await resetTheme()
                    await signOut();
                    window.location.reload()
                }}>Reset Theme
                </button>
            </div>
        </div>

    )
}