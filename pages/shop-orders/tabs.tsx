import Link from "next/link";
import {useRouter} from "next/router";

export default function ShopOrdersTabs() {

    const router = useRouter()

    function activeTab(id:string){
        return router.query.tab === id ? "active-tab" : "";
    }

    return (
        <>
            <span className={activeTab("orders")}><Link href="/shop-orders?tab=orders">Orders</Link></span>
            <span className={activeTab("completed-orders")}><Link href="/shop-orders?tab=completed-orders">Completed Orders</Link></span>
            <span className={activeTab("new-order")}><Link href="/shop-orders?tab=new-order">New Order</Link></span>
            <span className={activeTab("dead-stock")}><Link href="/shop-orders?tab=dead-stock">Dead Stock</Link></span>
        </>
    )
}