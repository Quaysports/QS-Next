import {useSelector} from "react-redux";
import Link from "next/link";
import {useEffect, useState} from "react";
import {selectMenuOptions} from "../../store/menu-slice";
import AppsMenu from "./apps-menu";
import SettingsMenu from "./settings-menu";
import Notification from "../notification/notification";

export default function Menu({notificationOpts}) {

    const menuOptions = useSelector(selectMenuOptions)

    const [notificationContent, setNotificationContent] = useState(undefined)

    useEffect(()=>{
        if(notificationContent !== notificationOpts) setNotificationContent(notificationOpts)
    },[notificationOpts])

    function notificationHandler({type, title, content}) {
        setNotificationContent({type:type, title:title, content:content})
    }

    const [showAppsMenu, setShowAppsMenu] = useState<boolean>(false)

    function appsMenuHandler() {
        setShowAppsMenu(!showAppsMenu)
    }

    const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false)

    function settingsMenuHandler() {
        setShowSettingsMenu(!showSettingsMenu)
    }

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
            {showSettingsMenu ? <SettingsMenu showSettingsMenu={showSettingsMenu} settingsMenuHandler={settingsMenuHandler} notificationContent={notificationHandler}/> : null}
            <Notification options={notificationContent} close={()=>setNotificationContent({type:"", title:"", content:""})}/>
        </div>
    )
}