
import CustomisationPopup from "./customisation-popup";
import {dispatchNotification} from "../../server-modules/dispatch-notification";

interface props {
    showSettingsMenu:boolean;
    settingsMenuHandler: ()=>void
}

export default function SettingsMenu({showSettingsMenu, settingsMenuHandler}:props) {
    if (showSettingsMenu) {
        return (
            <div key={25} id="settings-menu" onMouseLeave={settingsMenuHandler}>
                <div onClick={()=>{
                    dispatchNotification({type:"popup", title:"Customisation Popup", content:<CustomisationPopup/>});
                    settingsMenuHandler()
                }}>Customisation</div>
            </div>
        )
    }

    return null
}