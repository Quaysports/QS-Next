import Link from "next/link";
import {useEffect, useState} from "react";
import {getSession} from "next-auth/react";

export default function DashboardTabs() {

    const [permissions, setPermissions] = useState(null)

    useEffect(()=>{
        if(permissions === null) getSession().then(session=>setPermissions(session.user.permissions))
    })

    return (
        <>
            <span><Link href="/dashboard?tab=home">Home</Link></span>
            {permissions?.users?.auth ? <span><Link href="/dashboard?tab=user">Users</Link></span> : null}
            {permissions?.orderSearch?.auth ? <span><Link href="/dashboard?tab=order-search">Order Search</Link></span> : null}
            {permissions?.priceUpdates?.auth ? <span><Link href="/dashboard?tab=price-updates">Price Updates</Link></span> : null}
            {permissions?.shop?.auth ? <span><Link href="/dashboard?tab=shop">Shop</Link></span> : null}
            {permissions?.online?.auth ? <span><Link href="/dashboard?tab=online">Online</Link></span> : null}
            {permissions?.rotas?.auth ? <span><Link href="/dashboard?tab=rotas">Rotas</Link></span> : null}
            {permissions?.holidays?.auth ? <span><Link href="/dashboard?tab=holidays">Holidays</Link></span> : null}
        </>
    )
}