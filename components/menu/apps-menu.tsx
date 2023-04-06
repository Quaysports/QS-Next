import Link from "next/link";
import {getSession, signOut} from "next-auth/react";
import {useEffect, useState} from "react";
import {Permissions} from "../../server-modules/users/user";

/**
 * @param {boolean} showAppsMenu - Boolean to toggle menu display
 * @param {appsMenuHandler} appsMenuHandler - Handler to update display boolean
 */
export interface Props {
    showAppsMenu:boolean;
    appsMenuHandler:()=>void
}

/**
 * Apps menu component for Menu bar, contains shortcuts to pages
 */
export default function AppsMenu({showAppsMenu, appsMenuHandler}:Props) {

    const [permissions, setPermissions] = useState<Permissions | null>(null)

    useEffect(()=>{
        if(permissions === null) getSession().then(session=>setPermissions(session?.user.permissions as Permissions))
    })

    async function logoutHandler() {
        await signOut()
        window.location.href = "/"
    }

    if (showAppsMenu) {
        return (
            <div key={24} id="apps-menu" onMouseLeave={appsMenuHandler}>
                <div onClick={appsMenuHandler}><Link href="/dashboard?tab=home">Dashboard</Link></div>
                {permissions?.dev?.auth ? <div onClick={appsMenuHandler}><Link href="/dev">Developer</Link></div> : null}
                {permissions?.shopOrders?.auth ? <div onClick={appsMenuHandler}><Link href="/shop-orders?tab=orders">Shop Orders</Link></div> : null}
                {permissions?.shopTills?.auth ? <div onClick={appsMenuHandler}><Link href="/shop-tills">Shop Tills</Link></div> : null}
                {permissions?.reports?.auth ? <div onClick={appsMenuHandler}><Link href="/reports?tab=incorrect-stock">Reports</Link></div> : null}
                {permissions?.itemDatabase?.auth ? <div onClick={appsMenuHandler}><Link href="/item-database">Item Database</Link></div> : null}
                {permissions?.stockForecast?.auth ? <div onClick={appsMenuHandler}><Link href="/stock-forecast">Stock Forecast</Link></div> : null}
                {permissions?.shipments?.auth ? <div onClick={appsMenuHandler}><Link href="/shipments">Shipments</Link></div> : null}
                {permissions?.marginCalculator?.auth ? <div onClick={appsMenuHandler}><Link href="/margin-calculator">Margin Calculator</Link></div> : null}
                {permissions?.stockTransfer?.auth ? <div onClick={appsMenuHandler}><Link href="/stock-transfer">Stock Transfer</Link></div> : null}
                {permissions?.webpages?.auth ? <div onClick={appsMenuHandler}><Link href="/webpages">Webpages</Link></div> : null}
                {permissions?.webpages?.auth ? <div onClick={appsMenuHandler}><Link href="/giftcard">Giftcards</Link></div> : null}

                <div onClick={async () => logoutHandler()}><a>Logout</a></div>
            </div>
        )
    }

    return null
}