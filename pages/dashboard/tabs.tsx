import Link from "next/link";
import {useSelector} from "react-redux";
import {activeUserPermissions} from "../../store/dashboard/user-slice";

export default function DashboardTabs() {
    const permissions = useSelector(activeUserPermissions)

    return (
        <div key={23} id="apps-menu">
            <div><Link href="/dashboard?tab=home">Home</Link></div>
            {permissions?.users?.auth ? <div><Link href="/dashboard?tab=user">Users</Link></div> : null}
            {permissions?.orderSearch?.auth ? <div><Link href="/dashboard?tab=order-search">Order Search</Link></div> : null}
            {permissions?.priceUpdates?.auth ? <div><Link href="/dashboard?tab=price-updates">Price Updates</Link></div> : null}
            {permissions?.shop?.auth ? <div><Link href="/dashboard?tab=shop">Shop</Link></div> : null}
            {permissions?.online?.auth ? <div><Link href="/dashboard?tab=online">Online</Link></div> : null}
            {permissions?.rotas?.auth ? <div><Link href="/dashboard?tab=rotas">Rotas</Link></div> : null}
            {permissions?.holidays?.auth ? <div><Link href="/dashboard?tab=holidays">Holidays</Link></div> : null}
        </div>
    )
}