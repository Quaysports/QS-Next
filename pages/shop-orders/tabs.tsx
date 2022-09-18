import Link from "next/link";

export default function ShopOrdersTabs() {
    return (
        <>
            <span><Link href="/shop-orders?tab=orders">Orders</Link></span>
            <span><Link href="/shop-orders?tab=completed-orders">Completed Orders</Link></span>
            <span><Link href="/shop-orders?tab=new-order">New Order</Link></span>
            <span><Link href="/shop-orders?tab=dead-stock">Dead Stock</Link></span>
        </>
    )
}