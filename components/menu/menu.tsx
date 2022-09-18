import {useState} from "react";
import AppsMenu from "./apps-menu";
import SettingsMenu from "./settings-menu";

export default function Menu({tabs = null}) {

    const [showAppsMenu, setShowAppsMenu] = useState<boolean>(false)
    const appsMenuHandler = () => setShowAppsMenu(!showAppsMenu)

    const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false)
    const settingsMenuHandler = () => setShowSettingsMenu(!showSettingsMenu)

    return (
        <div className="menu-bar-wrapper">
            <div onClick={appsMenuHandler} id="apps-button" key={"app-span"}>&equiv;</div>
            <div className="menu-bar"> {tabs} </div>
            <div onClick={settingsMenuHandler} id="settings-button" key={"settings-span"}>&#9965;</div>
            {showAppsMenu ? <AppsMenu showAppsMenu={showAppsMenu} appsMenuHandler={appsMenuHandler} /> : null}
            {showSettingsMenu ? <SettingsMenu showSettingsMenu={showSettingsMenu} settingsMenuHandler={settingsMenuHandler}/> : null}
        </div>
    )
}