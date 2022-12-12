import {ShipmentItem} from "../../../server-modules/shipping/shipping";
import styles from "./shipment-card.module.css";



export default function SupplierTable({shipmentItems}:{shipmentItems: ShipmentItem[]}){

    if(!shipmentItems || shipmentItems.length === 0) return null

    const {supplier} = shipmentItems[0]

    const title = `${supplier}`

    let elements = [<TitleRow/>]
    for(const item of shipmentItems){
        elements.push(<ItemRow key={item.sku} item={item}/>)
    }

    return (
        <div className={styles["supplier-wrapper"]}>
            <div className={styles["supplier-title"]}>{title}</div>
            <div className={styles["supplier-table"]}>{elements}</div>
        </div>
    )

}

function TitleRow(){
    return <div className={styles["supplier-row"]}>
        <div>SKU</div>
        <div>Code</div>
        <div>Quantity</div>
        <div>Boxes</div>
        <div>Volume</div>
    </div>
}

function ItemRow({item}: { item: ShipmentItem }) {
    return <div  className={styles["supplier-row"]}>
        <div>{item.sku}</div>
        <div>{item.code}</div>
        <div>{item.qty}</div>
        <div>{item.numOfBoxes}</div>
        <div>{item.m3total.toFixed(2)}</div>
    </div>;
}