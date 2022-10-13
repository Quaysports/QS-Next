import {useRouter} from "next/router";
import {setOrderInfoReset} from "../../store/shop-orders-slice";
import {useDispatch} from "react-redux";

/**
 * Shop Orders Tabs
 */
export default function ShopOrdersTabs() {

    const router = useRouter()
    const dispatch = useDispatch()

    function activeTab(id:string){
        return router.query.tab === id ? "active-tab" : "";
    }

    function tabHandler(route:string){
        dispatch(setOrderInfoReset());
        router.push(route)
    }

    return (
        <>
            <span className={activeTab("orders")} onClick={() => tabHandler("/shop-orders?tab=orders")}>Orders</span>
            <span className={activeTab("completed-orders")} onClick={() => tabHandler("/shop-orders?tab=completed-orders")}>Completed Orders</span>
            <span className={activeTab("new-order")} onClick={() => tabHandler("/shop-orders?tab=new-order")}>New Order</span>
            <span className={activeTab("dead-stock")} onClick={() => tabHandler("/shop-orders?tab=dead-stock")}>Dead Stock</span>
        </>
    )
}