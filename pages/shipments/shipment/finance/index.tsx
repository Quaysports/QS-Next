import styles from "../../shipment.module.css";
import {useDispatch, useSelector} from "react-redux";
import {
    selectActiveShipmentIndex,
    selectShipment,
    setActiveShipmentIndex, updateShipment
} from "../../../../store/shipments-slice";
import {useEffect, useState} from "react";
import RegexInput from "../../../../components/regex-input";
import {Shipment, ShipmentItem} from "../../../../server-modules/shipping/shipping";

export default function Finance() {
    const shipment = useSelector(selectShipment)

    if (!shipment) return null

    let elements = [<TitleRow key={"title"}/>]
    for (let i in shipment.data) {
        elements.push(<ItemRow key={i} shipmentItem={shipment.data[i]} index={i}/>)
    }

    return <div className={styles["shipment-sub-table"]}>{elements}</div>
}

function TitleRow() {
    return <div className={`${styles["finance-item-row"]} ${styles["title-row"]}`}>
        <div>Duty %</div>
        <div>Duty Value</div>
        <div>FOB Per Item $</div>
        <div>Total $</div>
        <div>FOB Per Item £</div>
        <div>Total £</div>
        <div>% Of Orders</div>
        <div>Per Item Landed</div>
    </div>
}

function ItemRow({shipmentItem, index}: { shipmentItem: ShipmentItem, index: string }) {

    const [item, setItem] = useState<ShipmentItem>(shipmentItem)
    const dispatch = useDispatch()
    const activeIndex = useSelector(selectActiveShipmentIndex)
    const shipment = useSelector(selectShipment)

    useEffect(() => {setItem(shipmentItem)}, [shipmentItem])


    function update<T>(obj: T, key: keyof T, value: T[keyof T]) {
        let update = structuredClone(obj)
        update[key] = value
        return update
    }

    function updateShipmentSlice(shipment:Shipment, newItem:ShipmentItem){
        const newShipment = structuredClone(shipment)
        newShipment.data[Number(index)] = newItem
        dispatch(updateShipment(newShipment))
    }

    if (!item || !shipment) return null

    return <div className={`${styles["finance-item-row"]} ${index === activeIndex ? styles["highlighted"] : ""}`}
                onClick={() => dispatch(setActiveShipmentIndex(index))}>
        <div><RegexInput type={"decimal"} value={item.dutyPer} handler={(value) => {
            updateShipmentSlice(shipment, update<ShipmentItem>(item, "dutyPer", Number(value)))
        }} errorMessage={"Numbers only"}/></div>
        <div>${item.dutyValue.toFixed(2)}</div>
        <div><RegexInput type={"decimal"} value={item.fobDollar} handler={(value) => {
            updateShipmentSlice(shipment, update<ShipmentItem>(item, "fobDollar", Number(value)))
        }} errorMessage={"Numbers only"}/></div>
        <div>${item.dollarTotal.toFixed(2)}</div>
        <div>£{item.fobPound?.toFixed(2)}</div>
        <div>£{item.poundTotal?.toFixed(2)}</div>
        <div>{item.perOfOrder?.toFixed(2)}%</div>
        <div>£{item.totalPerItem?.toFixed(2)}</div>
    </div>
}