import Link from "next/link";

export default function ShopTabs(){
    return(
        <>
            <span><Link href={"/shop-tills?tab=quick-links"}>Quick Link Setup</Link></span>
        </>
    )
}