import {useRouter} from "next/router";
import {selectEditOrder, setOrderInfoReset} from "../../store/shop-orders-slice";
import {useDispatch, useSelector} from "react-redux";
import {dispatchNotification} from "../../server-modules/dispatch-notification";

/**
 * Shop Orders Tabs
 */
export default function ShopOrdersTabs() {

    const router = useRouter()
    const editOrder = useSelector(selectEditOrder)
    const dispatch = useDispatch()

    function activeTab(id:string){
        return router.query.tab === id ? "active-tab" : "";
    }

    function checkHandler(route:string){
        dispatch(setOrderInfoReset());
        router.push(route)
    }

    async function newOrderCheck(route:string){
        if(editOrder){
            dispatchNotification({
                type:"confirm",
                title:"Order not saved",
                content:"This order has not been saved are you sure you want to navigate away from this page? The order changes will be lost",
                fn: ()=>checkHandler(route)
            })
        } else {
            await router.push(route)
        }
    }

    return (
        <>
            <span className={activeTab("orders")} onClick={() => newOrderCheck("/shop-orders?tab=orders")}>Orders</span>
            <span className={activeTab("completed-orders")} onClick={() => newOrderCheck("/shop-orders?tab=completed-orders")}>Completed Orders</span>
            <span className={activeTab("new-order")} onClick={() => newOrderCheck("/shop-orders?tab=new-order")}>New Order</span>
            <span className={activeTab("dead-stock")} onClick={() => newOrderCheck("/shop-orders?tab=dead-stock")}>Dead Stock</span>
        </>
    )
}