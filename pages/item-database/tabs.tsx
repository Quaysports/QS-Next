import Link from "next/link";
import {useRouter} from "next/router";

export default function ItemDatabaseTabs() {

    const router = useRouter()

    function activeTab(id:string){
        return router.query.tab === id ? "active-tab" : "";
    }

    return (
        <>
            <span style={{flex:1}}/>
            <span className={activeTab("item-database")}><Link href="/item-database?tab=item-database">Item Database</Link></span>
            <span className={activeTab("rod-locations")}><Link href="/item-database?tab=rod-locations">Rod Locations</Link></span>
            <span className={activeTab("new-items")}><Link href="/item-database?tab=new-items">New Items</Link></span>
            <span style={{flex:1}}><button style={{float:"right"}}>Update Database</button></span>
        </>
    )
}