import {useSelector} from "react-redux";
import Link from "next/link";
import {useState} from "react";
import {selectMenuOptions} from "../../store/menu-slice";
import AppsMenu from "./apps-menu";
import SettingsMenu from "./settings-menu";

export default function Menu() {

    const menuOptions = useSelector(selectMenuOptions)

    const [showAppsMenu, setShowAppsMenu] = useState<boolean>(false)
    const appsMenuHandler = () => setShowAppsMenu(!showAppsMenu)

    const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false)
    const settingsMenuHandler = () => setShowSettingsMenu(!showSettingsMenu)

    function buildMenu() {
        let tabArray = [];
        for (const key in menuOptions) {
            tabArray.push( <span key={key}><Link href={`/${menuOptions[key]}`}>{key}</Link></span>)
        }
        return <>{tabArray}</>
    }

    return (
        <div className="menu-bar-wrapper">
            <div onClick={appsMenuHandler} id="apps-button" key={"app-span"}>&equiv;</div>
            <div className="menu-bar"> {buildMenu()} </div>
            <div onClick={settingsMenuHandler} id="settings-button" key={"settings-span"}>&#9965;</div>
            {showAppsMenu ? <AppsMenu showAppsMenu={showAppsMenu} appsMenuHandler={appsMenuHandler} /> : null}
            {showSettingsMenu ? <SettingsMenu showSettingsMenu={showSettingsMenu} settingsMenuHandler={settingsMenuHandler}/> : null}
        </div>
    )
}