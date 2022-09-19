
import CustomisationPopup from "./customisation-popup";
import {dispatchNotification} from "../notification/notification-wrapper";

export default function SettingsMenu({showSettingsMenu, settingsMenuHandler}) {
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
}