
import CustomisationPopup from "./customisation-popup";

export default function SettingsMenu({showSettingsMenu, settingsMenuHandler}) {
    if (showSettingsMenu) {
        return (
            <div key={25} id="settings-menu">
                <div onClick={()=>{
                    const event = new CustomEvent('notification', { detail: {type:"popup", title:"Customisation Popup", content:<CustomisationPopup/>} });
                    window.dispatchEvent(event)
                    settingsMenuHandler()
                }}>Customisation</div>
            </div>
        )
    }
}