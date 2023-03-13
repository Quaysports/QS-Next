import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import ImportItemPopup from "./import-item-popup";
import AddItemPopup from "./add-item-popup";
import {useSelector} from "react-redux";
import {selectShipment} from "../../../store/shipments-slice";
import {emailExport, shippingExport} from "../../../server-modules/shipping/export.js";
import {dispatchToast} from "../../../components/toast/dispatch-toast";

export default function ShipmentMenu(){

    const shipment = useSelector(selectShipment)
    if(!shipment) return null

    return <>
        <span onClick={()=>dispatchNotification({
                type:"popup",
                title:"Add Item",
                content:<AddItemPopup/>
            })
        }>Add Item</span>
        <span onClick={()=>dispatchNotification({
            type:"popup",
            title:"Import Item",
            content:<ImportItemPopup/>})
        }>Import Item</span>
        <div>|</div>
        <span onClick={()=>{
            emailExport(shipment).then(()=>dispatchToast({content:"Email Table Copied to Clipboard"}))
        }}>Create Email Table</span>
        <span onClick={()=>shippingExport(shipment)}>Export to Excel</span>
    </>
}