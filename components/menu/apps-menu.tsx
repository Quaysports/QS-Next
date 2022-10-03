import Link from "next/link";
import {getSession, signOut} from "next-auth/react";
import {useEffect, useState} from "react";

export default function AppsMenu({showAppsMenu, appsMenuHandler}) {

    const [permissions, setPermissions] = useState(null)

    useEffect(()=>{
        if(permissions === null) getSession().then(session=>setPermissions(session.user.permissions))
    })

    async function logoutHandler() {
        await signOut()
        window.location.href = "/"
    }

    if (showAppsMenu) {
        return (
            <div key={24} id="apps-menu" onMouseLeave={appsMenuHandler}>
                <div onClick={appsMenuHandler}><Link href="/dashboard?tab=home">Dashboard</Link></div>
                {permissions?.shopOrders?.auth ? <div onClick={appsMenuHandler}><Link href="/shop-orders?tab=orders">Shop Orders</Link></div> : null}
                {permissions?.shopTills?.auth ? <div onClick={appsMenuHandler}><Link href="/shop-tills">Shop Tills</Link></div> : null}
                {permissions?.stockReports?.auth ? <div onClick={appsMenuHandler}><Link href="/stock-reports?tab=incorrect-stock">Stock Reports</Link></div> : null}
                {permissions?.itemDatabase?.auth ? <div onClick={appsMenuHandler}><Link href="/item-database">Item Database</Link></div> : null}
                {permissions?.stockForecast?.auth ? <div onClick={appsMenuHandler}><Link href="/stock-forecast">Stock Forecast</Link></div> : null}
                {permissions?.shipments?.auth ? <div onClick={appsMenuHandler}><Link href="/shipments">Shipments</Link></div> : null}
                {permissions?.marginCalculator?.auth ? <div onClick={appsMenuHandler}><Link href="/margin-calculator">Margin Calculator</Link></div> : null}
                {permissions?.stockTransfer?.auth ? <div onClick={appsMenuHandler}><Link href="/stock-transfer">Stock Transfer</Link></div> : null}
                {permissions?.stockTakeList?.auth ? <div onClick={appsMenuHandler}><Link href="/stock-take-list">Stock Take List</Link></div> : null}
                {permissions?.webpages?.auth ? <div onClick={appsMenuHandler}><Link href="/webpages">Webpages</Link></div> : null}
                <div onClick={async () => logoutHandler()}><a>Logout</a></div>
            </div>
        )
    }
}