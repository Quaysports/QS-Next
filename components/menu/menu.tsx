import {ReactNode, useState} from "react";
import AppsMenu from "./apps-menu";
import SettingsMenu from "./settings-menu";
import MenuLayout from "../layouts/menu-layout";

/**
 * @param {ReactNode} children - Child JSX elements, should be a JSX array of spans
 */
interface Props {
    children:ReactNode
}

/**
 * Menubar component, pass in array of spans to render as tabs
 */
export default function Menu({children}:Props) {

    const [showAppsMenu, setShowAppsMenu] = useState<boolean>(false)
    const appsMenuHandler = () => setShowAppsMenu(!showAppsMenu)

    const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false)
    const settingsMenuHandler = () => setShowSettingsMenu(!showSettingsMenu)

    return (
        <MenuLayout>
            <div onClick={appsMenuHandler} id="apps-button" key={"app-span"}>&equiv;</div>
            <div className="menu-bar"> {children} </div>
            <div onClick={settingsMenuHandler} id="settings-button" key={"settings-span"}>&#9965;</div>
            {showAppsMenu ? <AppsMenu showAppsMenu={showAppsMenu} appsMenuHandler={appsMenuHandler} /> : null}
            {showSettingsMenu ? <SettingsMenu showSettingsMenu={showSettingsMenu} settingsMenuHandler={settingsMenuHandler}/> : null}
        </MenuLayout>
    )
}