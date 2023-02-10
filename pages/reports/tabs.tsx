import Link from "next/link";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {selectUser} from "../../store/session-slice";



export default function StockReportTabs(){

    const router = useRouter()
    const user = useSelector(selectUser)

    function activeTab(id:string){
        return router.query.tab === id ? "active-tab" : "";
    }

    return(
        <>
            {user.permissions.salesReport?.auth
                ? <span className={activeTab("sales")}>
                    <Link href={"/reports?tab=sales"}>Sales</Link>
                  </span>
                : null}
            <span className={activeTab("incorrect-stock")}>
                <Link href={"/reports?tab=incorrect-stock"}>Incorrect Stock</Link>
            </span>
            <span className={activeTab("shop")}>
                <Link href={"/reports?tab=shop"}>Shop</Link>
            </span>
        </>
    )
}