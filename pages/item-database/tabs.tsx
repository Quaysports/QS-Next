import Link from "next/link";
import {useRouter} from "next/router";
import {dispatchNotification} from "../../components/notification/dispatch-notification";

export default function ItemDatabaseTabs() {

    const router = useRouter()

    function activeTab(id:string){
        return router.query.tab === id ? "active-tab" : "";
    }

    function updateAllHandler(){
        dispatchNotification({type:"loading",title:"Updating Database",content:"This could take a minute..."})
        fetch('api/items/update-all')
            .then(() => dispatchNotification())
    }

    return (
        <>
            <span style={{flex:1}}/>
            <span className={activeTab("item-database")}><Link href="/item-database?tab=item-database">Item Database</Link></span>
            <span className={activeTab("new-items")}><Link href="/item-database?tab=new-items">New Items</Link></span>
            <span style={{flex:1}}><button style={{float:"right"}} onClick={() => updateAllHandler()}>Update Database</button></span>
        </>
    )
}