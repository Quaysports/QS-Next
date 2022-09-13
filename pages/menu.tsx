import {useSelector} from "react-redux";
import Link from "next/link";
import {useState} from "react";
import {selectMenuOptions} from "../store/menu-slice";
import {signOut} from "next-auth/react";

export default function Menu() {

    const menuOptions = useSelector(selectMenuOptions)

    const [showAppsMenu, setShowAppsMenu] = useState<boolean>(false)

    function appsMenuHandler() {
        setShowAppsMenu(!showAppsMenu)
    }

    async function logoutHandler() {
        await signOut()
        window.location.href = "/"
    }

    function appsMenu(){
        if(showAppsMenu) {
            return (
                <div key={24} id="apps-menu">
                    <span key={0}>Apps Menu<button onClick={appsMenuHandler}>X</button></span>
                    <div onClick={appsMenuHandler}><Link href="/dashboard">Dashboard</Link></div>
                    <div onClick={appsMenuHandler}><Link href="/shop-orders">Shop Orders</Link></div>
                    <div onClick={appsMenuHandler}><Link href="/incorrect-stock-report">Incorrect Stock</Link></div>
                    <div onClick={appsMenuHandler}><Link href="/item-database">Item Database</Link></div>
                    <div onClick={appsMenuHandler}><Link href="/stock-forecast">Stock Forecast</Link></div>
                    <div onClick={appsMenuHandler}><Link href="/shipments">Shipments</Link></div>
                    <div onClick={appsMenuHandler}><Link href="/margin-calculator">Margin Calculator</Link></div>
                    <div onClick={appsMenuHandler}><Link href="/stock-transfer">Stock Transfer</Link></div>
                    <div onClick={appsMenuHandler}><Link href="/stock-take-list">Stock Take List</Link></div>
                    <div onClick={appsMenuHandler}><Link href="/webpages">Webpages</Link></div>
                    <div onClick={async ()=> logoutHandler()}><a>Logout</a></div>
                </div>
            )
        }
    }

    function buildMenu(){
        let tempArray = [<span onClick={appsMenuHandler} id="apps-button" key={"app-span"}>Apps</span>];
        for(const key in menuOptions){
            tempArray.push(
                <span key={key}><Link href={`/${menuOptions[key]}`}>{key}</Link></span>
            )
        }
        return <>{tempArray}</>
    }

    return (
        <div>
            <div className="menu-bar">
                {buildMenu()}
            </div>
                {appsMenu()}
        </div>
    )
}