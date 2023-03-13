import {Shipment, ShipmentItem} from "../../../server-modules/shipping/shipping";
import styles from "./shipment-card.module.css";
import SupplierTable from "./supplier-table";
import {useRouter} from "next/router";
import {useRef, useState, useEffect} from "react";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import TransferPopup from "./transfer-popup";
import {useDispatch} from "react-redux";
import {deleteShipment} from "../../../store/shipments-slice";

export interface SupplierItems {
    [key: string]: ShipmentItem[]
}

export default function ShipmentCard({shipment}: { shipment: Shipment }) {

    const router = useRouter()
    const dispatch = useDispatch()
    const ref = useRef<HTMLDivElement>(null)
    const [borderToggled, setBorderToggled] = useState(false)

    useEffect(() => {
        if (ref.current) {
            borderToggled
                ? ref.current.classList.add(styles["card-drop-highlight"])
                : ref.current.classList.remove(styles["card-drop-highlight"])
        }
    }, [borderToggled])

    if (!shipment) return null

    const {intId, due, tag, m3total, data} = shipment

    const title = `${(new Date(due)).toLocaleDateString('en-GB')} - ${tag} - ${m3total.toFixed(2)}m3`

    let supplierItems: SupplierItems = {}
    for (const item of data) {
        if (!supplierItems[item.supplier]) supplierItems[item.supplier] = []
        supplierItems[item.supplier].push(item)
    }

    let elements = []
    for (const supplier in supplierItems) {
        elements.push(<SupplierTable key={supplier} shipment={shipment} shipmentItems={supplierItems[supplier]}/>)
    }

    const stamped = (type:string, id:string) => {
        console.log(type, id)
        console.log(shipment)
        return <div className={type === 'shipment' ? styles[`${type}-${id}`] : styles[type]}>{id}!</div>
    }

    function createStamps(shipment:Shipment){
        const statusStamp = []
        if (shipment.booked) statusStamp.push(stamped('shipment','Booked'))
        if (shipment.confirmed) statusStamp.push(stamped('shipment','Confirmed'))
        if (shipment.atSea) statusStamp.push(stamped('shipment','At-Sea'))
        if (shipment.delivery) statusStamp.push(stamped('shipment','Delivery-Arranged'))
        if (shipment.overdue) statusStamp.push(stamped('shipment','Overdue'))
        if (shipment.ready) statusStamp.push(stamped('shipment','Ready'))
        if (shipment.delivered) statusStamp.push(stamped('shipment','Delivered'))
        console.log(statusStamp)
        const stamps = []
        stamps.push(statusStamp.pop())
        if(shipment.shippingCompany) stamps.push(stamped('shippingCompany',shipment.shippingCompany))
        return stamps
    }

    return (
        <div className={styles.card}
             ref={ref}
             onDragOver={(e) => {
                 e.preventDefault()
                 setBorderToggled(true)
             }}
             onDragLeave={() => setBorderToggled(false)}
             onDrop={(e) => {
                 setBorderToggled(false)
                 const {fromShipment, item} = JSON.parse(e.dataTransfer.getData('text/plain'))
                 dispatchNotification(
                     {
                         type: "popup",
                         title: "Quantity to Transfer",
                         content: <TransferPopup item={item} fromShipment={fromShipment} toShipment={shipment}/>
                     })
             }}>
            <div className={styles["stamp-container"]}>
                {createStamps(shipment)}
            </div>
            <div className={styles.title}
                 onClick={() => {
                     router.push({pathname: router.pathname, query: {id: shipment.id}})
                 }}>
                <button onClick={(e) => {
                    e.stopPropagation()
                    dispatchNotification({
                        type: "confirm",
                        title: "Delete Shipment",
                        content: `Are you sure you want to delete ${title}?`,
                        fn: () => dispatch(deleteShipment(shipment))
                    })
                }}>Delete
                </button>
                <div>{title}</div>
                <div>ID: {intId}</div>
            </div>
            <div className={styles.content}>{elements}</div>
        </div>
    )
}