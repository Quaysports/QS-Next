import Link from "next/link";

/**
 * Menu tabs for Shop Tills page
 */
export default function ShopTabs(){
    return(
        <>
            <span><Link href={"/shop-tills?tab=pick-list"}>Pick List</Link></span>
            <span><Link href={"/shop-tills?tab=quick-links"}>Quick Link Setup</Link></span>
        </>
    )
}