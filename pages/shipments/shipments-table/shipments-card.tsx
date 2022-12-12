import {Shipment, ShipmentItem} from "../../../server-modules/shipping/shipping";
import styles from "./shipment-card.module.css";
import SupplierTable from "./supplier-table";

export interface SupplierItems {
    [key:string]:ShipmentItem[]
}

export default function ShipmentCard({shipment}:{shipment: Shipment}) {

    if(!shipment) return null

    const {intId, due, tag, m3total, data} = shipment

    const title = `${(new Date(due)).toLocaleDateString('en-GB')} - ${tag} - ${m3total.toFixed(2)}m3`

    let supplierItems:SupplierItems = {}
    for(const item of data){
        if(!supplierItems[item.supplier]) supplierItems[item.supplier] = []
        supplierItems[item.supplier].push(item)
    }

    let elements = []
    for(const supplier in supplierItems){
        elements.push(<SupplierTable key={supplier} shipmentItems={supplierItems[supplier]}/>)
    }

    return (
        <div className={styles.card}>
            <div className={styles.title}>
                <button>Delete</button>
                <div>{title}</div>
                <div>ID: {intId}</div>
            </div>
            <div className={styles.content}>{elements}</div>
        </div>
    )
}