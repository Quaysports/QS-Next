import SideBar from "../sidebar/sidebar";
import ColumnLayout from "../../../components/layouts/column-layout";
import DeadStockList from "./dead-stock-list";

/**
 * Dead Stock Tab
 */
export default function DeadStock() {
    return (
        <>
            <SideBar/>
            <ColumnLayout background={false}>
                <DeadStockList/>
            </ColumnLayout>
        </>
    );
}