import SidebarLayout from "../../../components/layouts/sidebar-layout";
import SidebarButton from "../../../components/layouts/sidebar-button";
import SidebarSelect from "../../../components/layouts/sidebar-select";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {
    addNewItem,
    copyItem,
    getNewItems,
    resetSlice,
    selectSuppliers
} from "../../../store/item-database/new-items-slice";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import NewSupplierPopup from "./new-supplier-popup";
import NewBrandPopup from "./new-brand-popup";
import {schema} from "../../../types";
import {structuredClone} from "next/dist/compiled/@edge-runtime/primitives/structured-clone";
import ErrorPopup from "./error-popup";
import {dispatchToast} from "../../../components/toast/dispatch-toast";

export default function NewItemsSideBar() {

    const router = useRouter()
    const suppliers = useSelector(selectSuppliers)
    const items = useSelector(getNewItems)
    const dispatch = useDispatch()

    function selectSupplierHandler(value: string) {
        if(router.query.supplier) {
            dispatchNotification({type:'confirm', title:'Supplier Change', content:'Changing supplier will delete all current items, are you sure you want to continue?', fn:() => routingChange(value)})
        } else {
            routingChange(value)
        }
    }

    function routingChange(value:string){
        dispatch(resetSlice())
        router.push({pathname: router.pathname, query: {...router.query, ...{supplier: value}}})
    }

    function createSupplierOptions(suppliers: string[]) {
        const supplierOptions = [<option key={2365} role={'supplier-option'} value={''}></option>]
        suppliers.forEach((supplier) => {
            supplierOptions.push(<option key={supplier} role={'supplier-option'} value={supplier}>{supplier}</option>)
        })
        return supplierOptions
    }

    function copyLastItemHandler() {
        let item = structuredClone(items[items.length - 1])
        dispatch(copyItem(item))
    }

    function addNewItemHandler() {
        dispatch(addNewItem(router.query.supplier as string))
    }

    async function uploadHandler(body: schema.Item[]) {

        dispatchNotification({type:'loading', content:"Uploading Items, please wait..."})
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
        const res = await fetch('/api/linnworks/upload-new-items', opts)
        dispatchNotification()
        if(res.status === 400) dispatchNotification({type:'alert', title:"Upload Error", content: "Please provide an SKU, Title, Barcode, Brand and Purchase Price for all items"})
        if(res.status === 300) dispatchNotification({type:'popup', title:"Upload Error", content: <ErrorPopup errors={await res.json()}/>})
        if(res.status === 200) {
            dispatchToast({content: "New items added successfully"})
            dispatch(resetSlice())
        }
    }

    return (
        <SidebarLayout>
            <SidebarSelect role={'supplier-select'} value={router.query.supplier as string} onChange={(e) => {
                selectSupplierHandler(e.target.value)
            }}>
                {createSupplierOptions(suppliers)}
            </SidebarSelect>
            <SidebarButton onClick={() => dispatchNotification({
                type: 'popup',
                title: 'New Supplier',
                content: <NewSupplierPopup/>
            })}>New Supplier</SidebarButton>
            {router.query.supplier ?
                <>
                    <SidebarButton onClick={() => dispatchNotification({
                        type: 'popup',
                        title: 'New Brand',
                        content: <NewBrandPopup/>
                    })}>New Brand</SidebarButton>
                    <br/>
                    <SidebarButton onClick={() => {
                        addNewItemHandler()
                    }}>
                        Add new item</SidebarButton>
                    <SidebarButton onClick={() => {
                        copyLastItemHandler()
                    }}>
                        Copy last item</SidebarButton>
                    <br/>
                    <SidebarButton onClick={() => uploadHandler(items)}>Add to Linnworks</SidebarButton>
                </> : null}
        </SidebarLayout>
    )
}