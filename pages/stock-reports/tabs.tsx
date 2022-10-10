import Link from "next/link";
import {useRouter} from "next/router";



export default function StockReportTabs(){

    const router = useRouter()

    function activeTab(id:string){
        return router.query.tab === id ? "active-tab" : "";
    }

    return(
        <>
            <span className={activeTab("incorrect-stock")}><Link href={"/stock-reports?tab=incorrect-stock"}>Incorrect Stock</Link></span>
            <span className={activeTab("shop")}><Link href={"/stock-reports?tab=shop"}>Shop</Link></span>
        </>
    )
}