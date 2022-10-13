import SideBar from "../sidebar/sidebar";
import ColumnLayout from "../../../components/layouts/column-layout";
import DeadStockList from "./dead-stock-list";
import {useRouter} from "next/router";

/**
 * Dead Stock Tab
 */
export default function DeadStock() {
    const router = useRouter()
    return (
        <>
            <SideBar/>
            {!router.query.index ? null :
                <ColumnLayout background={false}>
                    <DeadStockList/>
                </ColumnLayout>}
        </>
    );
}