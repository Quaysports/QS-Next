import SideBar from "../sidebar/sidebar";
import ColumnLayout from "../../../components/layouts/column-layout";
import ShowOrder from "./show-order";
import CompletedOrdersList from "./completed-orders-list";
import {useRouter} from "next/router";

/**
 * Completed Orders Tab
 */

export default function CompletedOrders() {
    const router = useRouter()

    return (
        <>
            <SideBar/>
            <ColumnLayout scroll={true} background={false}>
                {router.query.index ?
                    <>
                    <CompletedOrdersList/>
                    <ShowOrder/>
                    </>
                    : null}
            </ColumnLayout>
        </>
    );
}