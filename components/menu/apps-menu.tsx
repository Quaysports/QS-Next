import Link from "next/link";
import {signOut} from "next-auth/react";

export default function AppsMenu({showAppsMenu, appsMenuHandler}) {

    async function logoutHandler() {
        await signOut()
        window.location.href = "/"
    }

    if (showAppsMenu) {
        return (
            <div key={24} id="apps-menu">
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
                <div onClick={async () => logoutHandler()}><a>Logout</a></div>
            </div>
        )
    }
}