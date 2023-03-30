import {Shipment, ShipmentItem} from "../../../server-modules/shipping/shipping";
import styles from "./shipment-card.module.css";


export default function SupplierTable({shipment, shipmentItems}:{shipment:Shipment, shipmentItems: ShipmentItem[]}){

    if(!shipmentItems || shipmentItems.length === 0) return null

    const {supplier} = shipmentItems[0]

    const title = `${supplier}`

    let elements = [<TitleRow key={"title"}/>]
    for(const [k,v] of Object.entries(shipmentItems)){
        elements.push(<ItemRow key={v.sku+"-"+k} shipment={shipment} item={v}/>)
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

function ItemRow({shipment, item}: { shipment:Shipment, item: ShipmentItem}){
    return <div  className={styles["supplier-row"]}
                 draggable={true}
                 onDragStart={(e)=>{
                    e.dataTransfer.setData('text/plain', JSON.stringify({fromShipment:shipment, item:item}))
                 }}>
        <div>{item.sku}</div>
        <div>{item.code}</div>
        <div>{item.qty}</div>
        <div>{item.numOfBoxes}</div>
        <div>{item.m3total.toFixed(2)}</div>
    </div>;
}