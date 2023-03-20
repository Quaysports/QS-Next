import Link from "next/link";
import {useRouter} from "next/router";

export default function StockTransferTabs() {

    const router = useRouter()
    function activeTab(id:string){
        return router.query.tab === id ? "active-tab" : "";
    }

    return (
        <>
            <span className={activeTab("item-database")}><Link
                href="/stock-transfer?tab=open-transfers">Open Transfer</Link></span>
            <span className={activeTab("rod-locations")}><Link
                href="/stock-transfer?tab=completed-transfers">Completed Transfers</Link></span>
        </>
    )
}