import {appWrapper} from "../../store/store";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import SideBar from "./sidebar";
import Menu from "../../components/menu/menu";
import {useRouter} from "next/router";
import OpenTransfers from "./open-transfers/open-transfers";
import CompletedTransfers from "./completed-transfers/completed-transfers";
import StockTransferTabs from "./tabs";
import {setOpenTransfer} from "../../store/stock-transfer-slice";
import {checkOpenTransfers} from "../../server-modules/stock-transfer/stock-transfer";

export default function stockTransferLandingPage() {
    const router = useRouter()

    return (
        <SidebarOneColumn>
            <Menu><StockTransferTabs/></Menu>
            <SideBar/>
            {router.query.tab === undefined || router.query.tab === "open-transfers" ?
                <OpenTransfers/> : null
            }
            {router.query.tab === "completed-transfers" ?
                <CompletedTransfers/> : null
            }
        </SidebarOneColumn>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async (context) => {

    if(context.query.tab === undefined || context.query.tab === "open-transfers"){
        const transfer = await checkOpenTransfers()
        if(transfer[0]) {
            store.dispatch(setOpenTransfer(transfer[0]))
        }
    }
    return {
        props: {}
    }
})