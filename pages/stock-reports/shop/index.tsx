import SidebarLayout from "../../../components/layouts/sidebar-layout";
import ColumnLayout from "../../../components/layouts/column-layout";
import ShopStockTakeSidebar from "./ShopStockTakeSidebar";

export default function ShopStockTake({brands}){

    return(
        <>
            <SidebarLayout><ShopStockTakeSidebar brands={brands}/></SidebarLayout>
            <ColumnLayout scroll={true} maxWidth={"fit-content"}>List</ColumnLayout>
        </>
    )
}