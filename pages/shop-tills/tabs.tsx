import Link from "next/link";
import {useSelector} from "react-redux";
import {selectUser} from "../../store/session-slice";
import {useRouter} from "next/router";
import {dispatchNotification} from "../../components/notification/dispatch-notification";
import ShopPriceCalculator from "./price-calculator-popup";

/**
 * Menu tabs for Shop Tills page
 */
export default function ShopTabs(){

    const user = useSelector(selectUser)
    const router = useRouter()

    function activeTab(id:string){
        return router.query.tab === id ? "active-tab" : "";
    }

    return(
        <>
            <span onClick={()=>dispatchNotification(
                {
                    type:"popup",
                    title:"Shop Price Calculator",
                    content:<ShopPriceCalculator/>
                }
            )}>Price Calculator</span>
            <span className={activeTab("pick-list")}><Link href={"/shop-tills?tab=pick-list"}>Pick List</Link></span>
            {user.permissions.shopTillsQuickLinks?.auth ?
                <span className={activeTab("quick-links")}><Link href={"/shop-tills?tab=quick-links"}>Quick Link Setup</Link></span> : null
            }
        </>
    )
}