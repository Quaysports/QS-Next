
import CustomisationPopup from "./customisation-popup";
import {dispatchNotification} from "../notification/dispatch-notification";

/**
 * @param {boolean} showSettingsMenu - Boolean toggle to show settings menu.
 * @param {settingsMenuHandler} settingsMenuHandler - Handler to toggle boolean to display menu.
 */
interface Props {
    showSettingsMenu:boolean;
    settingsMenuHandler: ()=>void
}

/**
 * Settings Menu component for Menu bar.
 */
export default function SettingsMenu({showSettingsMenu, settingsMenuHandler}:Props) {
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