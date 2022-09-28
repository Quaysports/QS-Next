import Link from "next/link";

export default function StockReportTabs(){
    return(
        <>
            <span><Link href={"/stock-reports?tab=incorrect-stock"}>Incorrect Stock</Link></span>
            <span><Link href={"/stock-reports?tab=shop"}>Shop</Link></span>
        </>
    )
}