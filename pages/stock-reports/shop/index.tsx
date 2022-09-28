import SidebarLayout from "../../../components/layouts/sidebar-layout";
import ColumnLayout from "../../../components/layouts/column-layout";
import ShopStockTakeSidebar from "./shop-stock-take-sidebar";
import ShopStockTakeTable from "./shop-stock-take-table";
import {useSelector} from "react-redux";
import {selectBrandItems} from "../../../store/stock-reports-slice";

export default function ShopStockTake({brands}){
    const brandItems = useSelector(selectBrandItems)

    return(
        <>
            <SidebarLayout scroll={true}><ShopStockTakeSidebar brands={brands}/></SidebarLayout>
            <ColumnLayout scroll={true} maxWidth={"fit-content"}>{
                brandItems.length > 0
                    ? <ShopStockTakeTable/>
                    : null
            }</ColumnLayout>
        </>
    )
}