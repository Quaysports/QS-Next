import Link from "next/link";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {selectUser} from "../../store/session-slice";
/**
 * Dashboard tabs component. Used for populating Menu bar tabs.
 */
export default function DashboardTabs() {

    const router = useRouter()
    const user = useSelector(selectUser)

    const activeTab = (id:string) => router.query?.tab === id ? "active-tab" : "";

    return (
        <>
            <span className={activeTab("home")} data-testid={"home-tab"}><Link href="/dashboard?tab=home">Home</Link></span>
            {user.permissions?.users?.auth ? <span className={activeTab("user")} data-testid={"user-tab"}><Link href="/dashboard?tab=user">Users</Link></span> : null}
            {user.permissions?.rotas?.auth ? <span className={activeTab("rotas")}><Link href="/dashboard?tab=rotas&location=online">Rotas</Link></span> : null}
            {user.permissions?.holidays?.auth ? <span className={activeTab("holidays")}><Link href="/dashboard?tab=holidays&type=holiday">Holidays</Link></span> : null}
        </>
    )
}

/* ToDo tabs:
            {permissions?.orderSearch?.auth ? <span className={activeTab("order-search")} data-testid={"orders-search-tab"}><Link href="/dashboard?tab=order-search">Order Search</Link></span> : null}
            {permissions?.priceUpdates?.auth ? <span className={activeTab("price-updates")}><Link href="/dashboard?tab=price-updates">Price Updates</Link></span> : null}
            {permissions?.shop?.auth ? <span className={activeTab("shop")}><Link href="/dashboard?tab=shop">Shop</Link></span> : null}
            {permissions?.online?.auth ? <span className={activeTab("online")}><Link href="/dashboard?tab=online">Online</Link></span> : null}
            {permissions?.rotas?.auth ? <span className={activeTab("rotas")}><Link href="/dashboard?tab=rotas">Rotas</Link></span> : null}
 */