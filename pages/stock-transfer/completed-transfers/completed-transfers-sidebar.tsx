import {useSelector} from "react-redux";
import SidebarLayout from "../../../components/layouts/sidebar-layout";
import SidebarButton from "../../../components/layouts/sidebar-button";
import {selectAllCompletedTransfers} from "../../../store/stock-transfer-slice";
import {useRouter} from "next/router";

export default function CompletedTransfersSidebar() {

    const completedTransfers = useSelector(selectAllCompletedTransfers)
    const router = useRouter()

    function showTransferHandler(index: number) {
        router.push({pathname: router.pathname, query: {...router.query, index: index}})
    }

    if (!completedTransfers) return null

    return (
        <SidebarLayout>
            {completedTransfers.map((transfer, index) => {
                console.log(transfer.complete)
                return <SidebarButton
                    key={index}
                    onClick={() => showTransferHandler(index)}>
                    {transfer.transferRef}<br/>{new Date(parseInt(transfer.completedDate)).toLocaleString('en-GB').split(",")[0]}
                </SidebarButton>
            })}
        </SidebarLayout>
    )
}