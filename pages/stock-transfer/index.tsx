import {appWrapper} from "../../store/store";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import Menu from "../../components/menu/menu";
import {useRouter} from "next/router";
import OpenTransfers from "./open-transfers/open-transfers";
import CompletedTransfers from "./completed-transfers/completed-transfers";
import StockTransferTabs from "./tabs";
import {setCompletedTransfers, setOpenTransfer, setWarehouseList} from "../../store/stock-transfer-slice";
import {
    checkOpenTransfers,
    getCompleteTransfers,
    getWarehouseStock,
} from "../../server-modules/stock-transfer/stock-transfer";
import CompletedTransfersSidebar from "./completed-transfers/completed-transfers-sidebar";
import OpenTransferSidebar from "./open-transfers/open-transfer-sidebar";

export default function StockTransferLandingPage() {
    const router = useRouter()

    return (
        <SidebarOneColumn>
            <Menu><StockTransferTabs/></Menu>
            {router.query.tab === undefined || router.query.tab === "open-transfers" ?
                <>
                    <OpenTransferSidebar/>
                    <OpenTransfers/>
                </> : null
            }
            {router.query.tab === "completed-transfers" ?
                <>
                    <CompletedTransfersSidebar/>
                    <>{router.query.index ? <CompletedTransfers/> : null}</>
                </> : null
            }
        </SidebarOneColumn>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async (context) => {

    if (context.query.tab === undefined || context.query.tab === "open-transfers") {
        const transfer = await checkOpenTransfers()
        if (transfer[0]) {
            const warehouseList = await getWarehouseStock(transfer[0])
            console.log(warehouseList)
            store.dispatch(setWarehouseList(warehouseList))
            store.dispatch(setOpenTransfer(transfer[0]))
        }
    }

    if (context.query.tab === 'completed-transfers') {
        const transfers = await getCompleteTransfers()
        let sortedTransfers = transfers.sort((a,b) => a.completedDate > b.completedDate ? -1 : 1)
        store.dispatch(setCompletedTransfers(sortedTransfers))
    }

    return {
        props: {}
    }
})