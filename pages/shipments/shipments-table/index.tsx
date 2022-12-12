import {useSelector} from "react-redux";
import {selectShipments} from "../../../store/shipments-slice";
import ShipmentCard from "./shipments-card";
import styles from "./shipment-card.module.css";

export default function ShipmentsTable(){
    const shipments = useSelector(selectShipments)

    let elements = []
    for(const shipment of shipments){
        elements.push(<ShipmentCard key={shipment.id} shipment={shipment}/>)
    }

    return <div className={styles.table}>{elements}</div>
}