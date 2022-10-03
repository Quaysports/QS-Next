import Link from "next/link";
import {useEffect, useState} from "react";
import {getSession} from "next-auth/react";
import {useRouter} from "next/router";
import {Permissions} from "../../server-modules/users/user";

/**
 * Dashboard tabs component. Used for populating Menu bar tabs.
 */
export default function DashboardTabs() {

    const router = useRouter()

    const [permissions, setPermissions] = useState<Permissions | undefined>(undefined)

    useEffect(()=>{
        if(permissions === null) getSession().then(session=>setPermissions(session?.user.permissions))
    })

    const activeTab = (id:string) => {
        return router.query.tab === id ? "active-tab" : "";
    }

    return (
        <>
            <span className={activeTab("home")}><Link href="/dashboard?tab=home">Home</Link></span>
            {permissions?.users?.auth ? <span className={activeTab("user")}><Link href="/dashboard?tab=user">Users</Link></span> : null}
            {permissions?.orderSearch?.auth ? <span className={activeTab("order-search")}><Link href="/dashboard?tab=order-search">Order Search</Link></span> : null}
            {permissions?.priceUpdates?.auth ? <span className={activeTab("price-updates")}><Link href="/dashboard?tab=price-updates">Price Updates</Link></span> : null}
            {permissions?.shop?.auth ? <span className={activeTab("shop")}><Link href="/dashboard?tab=shop">Shop</Link></span> : null}
            {permissions?.online?.auth ? <span className={activeTab("online")}><Link href="/dashboard?tab=online">Online</Link></span> : null}
            {permissions?.rotas?.auth ? <span className={activeTab("rotas")}><Link href="/dashboard?tab=rotas">Rotas</Link></span> : null}
            {permissions?.holidays?.auth ? <span className={activeTab("holidays")}><Link href="/dashboard?tab=holidays">Holidays</Link></span> : null}
        </>
    )
}