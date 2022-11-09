import SideBar from "../sidebar/sidebar";
import StockList from "./stock-list";
import OrderList from "./order-list";
import ColumnLayout from "../../../components/layouts/column-layout";

/**
 * New Order Tab
 */
export default function NewOrder() {

    return (
        <>
            <SideBar/>
            <ColumnLayout scroll={true} background={false}><OrderList/><StockList/></ColumnLayout>
        </>
    );
}