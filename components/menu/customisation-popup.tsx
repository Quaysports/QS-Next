import {useEffect, useState} from "react";
import {getSession, signOut} from "next-auth/react";
import style from './customisation-popup.module.css'


/**
 * It renders a form that allows the user to change the primary colour of the website
 * @returns A React component
 */
export default function CustomisationPopup() {

    const [user,setUser] = useState(null)
    const [primaryColor, setPrimaryColor] = useState("#586221")

    useEffect(() => {
        if(user === null) getSession().then(session=>setUser(session.user))
        if (user?.theme?.['--primary-color']) setPrimaryColor(user.theme['--primary-color'])
    })

    /**
     * It updates the user's theme colors.
     * @param key - the key of the color you want to change
     * @param e - the event object
     */
    async function handleColorChange(key, e) {
        const data = {...{username: user.username}, ...{theme: {[key]: e.target.value}}}
        const opts = {method: "POST", body: JSON.stringify(data)}
        await fetch('/api/user/update-user', opts)
    }

    /**
     * It sends a request to the server to update the user's theme to an empty object
     */
    async function resetTheme() {
        const data = {...{username: user.username}, ...{theme: {}}}
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