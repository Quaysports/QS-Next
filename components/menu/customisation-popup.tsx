import {useEffect, useState} from "react";
import {signOut, useSession} from "next-auth/react";
import style from './customisation-popup.module.css'

export default function CustomisationPopup() {
    const {data: session, status} = useSession()
    const [primaryColor, setPrimaryColor] = useState("#586221")
    const [sessionData, setSessionData] = useState(null)

    useEffect(() => {
        if (status !== "authenticated") return
        setSessionData(session)
        if (sessionData === null || !sessionData.user.theme) return
        if (sessionData.user.theme['--primary-color']) setPrimaryColor(sessionData.user.theme['--primary-color'])
    })

    async function handleColorChange(key, e) {
        const data = {...{username: sessionData.user.username}, ...{theme: {[key]: e.target.value}}}
        const opts = {method: "POST", body: JSON.stringify(data)}
        await fetch('/api/user/update-user', opts)
    }

    async function resetTheme() {
        const data = {...{username: sessionData.user.username}, ...{theme: {}}}
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