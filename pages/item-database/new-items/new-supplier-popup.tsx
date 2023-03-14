import {useState} from "react";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {dispatchToast} from "../../../components/toast/dispatch-toast";
import {addNewSupplierToList} from '../../../store/item-database/new-items-slice'
import {useDispatch} from "react-redux";

export default function NewSupplierPopup() {

    const [supplier, setSupplier] = useState<string>("")
    const dispatch = useDispatch()
    function supplierHandler(value: string) {
        setSupplier(value)
    }

    async function saveHandler(supplier: string) {
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(supplier)
        }
        dispatchNotification({type:'loading'})
        const res = await fetch('/api/linnworks/add-new-supplier', opts)
        const message = await res.json()
        dispatchNotification()
        if (res.status === 300) dispatchNotification({type: 'alert', title: 'Error', content: message})
        if (res.status === 400) dispatchNotification({type: 'alert', title: 'Error', content: message})
        if (res.status === 200) {
            console.log(supplier)
            console.log(message)
            dispatch(addNewSupplierToList(supplier))
            dispatchToast({content: message})
        }
    }
    return (
        <>
            <input value={supplier} onChange={(e) => supplierHandler(e.target.value)}/>
            <button onClick={() => saveHandler(supplier)}>Save</button>
        </>
    )
}