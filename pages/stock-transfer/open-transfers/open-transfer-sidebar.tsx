import SidebarLayout from "../../../components/layouts/sidebar-layout";
import SidebarButton from "../../../components/layouts/sidebar-button";
import {useDispatch, useSelector} from "react-redux";
import {
    selectOpenTransfer,
    deleteTransfer,
    setOpenTransfer,
    addNewItem,
    LowStockItem,
    completeTransfer, CompletedTransferType
} from "../../../store/stock-transfer-slice";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import LowStockPopup from "./low-stock-popup";
import {dispatchToast} from "../../../components/toast/dispatch-toast";
import DatabaseSearchBar, {DatabaseSearchItem} from "../../../components/database-search-bar/database-search";
import {TransferObject} from "../../../server-modules/stock-transfer/stock-transfer";
import WarehouseListPopup from "./warehouse-list-popup";

export default function OpenTransferSidebar() {

    const dispatch = useDispatch()
    const openTransfer = useSelector(selectOpenTransfer)

    function getLowStockHandler() {
        if (openTransfer.items.length > 0) {
            dispatchNotification({
                type: 'confirm',
                title: 'Warning',
                content: "Creating a new transfer will permanently delete the current uncompleted transfer. Continue?",
                fn: () => newTransfer()
            })
        } else {
            newTransfer()
        }
    }

    async function newTransfer() {
        const res = await fetch('/api/stock-transfer/get-low-stock')
        if (res.status === 400) {
            let message = await res.json()
            dispatchToast({content: message.message})
        }
        if (res.status === 200) {
            const items = await res.json()
            if(items.items.length === 0) dispatchNotification({type:'alert', content:"No low stock items"})
            if(items.items.length > 0)dispatchNotification({type: 'popup', title: "Stock Check", content: <LowStockPopup items={items.items}/>})
        }
    }

    function addSkuHandler() {
        dispatchNotification({
            type: 'popup',
            title: 'Add SKU to transfer',
            content: <div><DatabaseSearchBar searchOptions={{isComposite:false, isListingVariation:false}} handler={(x) => fetchNewItem(openTransfer.items, x)}/></div>
        })
    }

    async function fetchNewItem(transfer: LowStockItem[], item: DatabaseSearchItem) {
        let match = false
        for (const lowStockItem of transfer) {
            if (lowStockItem.SKU === item.SKU) match = true
        }
        if (match) {
            dispatchToast({content: 'SKU already exists in stock transfer'})
        } else {
            const opts = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item.SKU)
            }
            const res = await fetch("/api/stock-transfer/get-new-item", opts)
            dispatchNotification()
            if (res.status === 400) dispatchNotification({
                type: 'alert',
                title: "Error",
                content: 'No item found, try again or contact IT'
            })
            if (res.status === 200) {
                dispatch(addNewItem(await res.json()))
                dispatchToast({content: 'Item added'})
            }
        }
    }

    function deleteTransferHandler() {
        dispatch(deleteTransfer())
        dispatch(setOpenTransfer({complete: false, completedDate: "", createdDate: "", items: [], transferID: "", transferRef: ""}))
    }

    function print(transfer:TransferObject){
        window.localStorage.setItem("transfer-list", JSON.stringify(transfer.items))
        window.open("/print?app=stock-transfer", "_blank", "width=515,height=580")
    }

    async function completeTransferHandler(openTransfer:TransferObject){
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(openTransfer)
        }
        dispatchNotification({type:'loading', content:'Completing transfer, please wait'})
        const res = await fetch('/api/stock-transfer/complete-transfer', opts)
        dispatchNotification()
        if(res.status === 200) {
            dispatchToast({content: 'Transfer complete'})
            const data = await res.json() as CompletedTransferType
            dispatch(completeTransfer(data))
        }
        if(res.status === 400){
            dispatchNotification({type: 'alert', content: 'Something went wrong, contact the IT guys'})
        }
    }

    async function warehouseList(){
        dispatchNotification({type:'popup', title:'Warehouse Stock', content: <WarehouseListPopup/>})
    }

    if (!openTransfer) return null
    return (
        <SidebarLayout>
            <SidebarButton onClick={() => getLowStockHandler()}>
                Get Low Stock
            </SidebarButton>
            {openTransfer.items.length > 0 ? <>
                    <SidebarButton onClick={() => completeTransferHandler(openTransfer)}>
                        Complete Transfer
                    </SidebarButton>
                    <br/>
                    <SidebarButton onClick={() => addSkuHandler()}>
                        Add SKU
                    </SidebarButton>
                    <SidebarButton onClick={() => warehouseList()}>
                        Warehouse List
                    </SidebarButton>
                    <SidebarButton onClick={() => {print(openTransfer)}}>
                        Print Transfer
                    </SidebarButton>
                    <br/>
                    <SidebarButton
                        onClick={() => dispatchNotification({
                            type: 'confirm',
                            title: "Delete Transfer",
                            content: "Are you sure you want to delete this transfer?",
                            fn: () => deleteTransferHandler()
                        })}>
                        Delete Transfer
                    </SidebarButton>
                </>
                : null
            }
        </SidebarLayout>
    )
}