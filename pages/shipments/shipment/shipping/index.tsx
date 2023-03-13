import styles from "../../shipment.module.css";
import {useDispatch, useSelector} from "react-redux";
import {
    selectActiveShipmentIndex,
    selectShipment,
    setActiveShipmentIndex,
    updateShipmentData
} from "../../../../store/shipments-slice";
import {useEffect, useState} from "react";
import RegexInput from "../../../../components/regex-input";
import {ShipmentItem} from "../../../../server-modules/shipping/shipping";

export default function Shipping() {
    const shipment = useSelector(selectShipment)

    if (!shipment) return null

    let elements = [<TitleRow key={"title"}/>]
    for (let i in shipment.data) {
        elements.push(<ItemRow key={i} shipmentItem={shipment.data[i]} index={i}/>)
    }

    return <div className={styles["shipment-sub-table"]}>{elements}</div>
}

function TitleRow() {
    return <div className={`${styles["shipping-item-row"]} ${styles["title-row"]}`}>
        <div>Qty Per Box</div>
        <div>No. of Boxes</div>
        <div>Length</div>
        <div>Height</div>
        <div>Width</div>
        <div>Box m³</div>
        <div>Total m³</div>
    </div>
}

function ItemRow({shipmentItem, index}: { shipmentItem: ShipmentItem, index: string }) {

    const [item, setItem] = useState<ShipmentItem>(shipmentItem)
    const dispatch = useDispatch()
    const activeIndex = useSelector(selectActiveShipmentIndex)
    useEffect(() => setItem(shipmentItem), [shipmentItem])

    function update<T>(obj: T, key: keyof T, value: T[keyof T]) {
        let update = structuredClone(obj)
        update[key] = value
        return update
    }

    if (!item) return null

    return <div className={`${styles["shipping-item-row"]} ${index === activeIndex ? styles["highlighted"] : ""}`}
                onClick={() => dispatch(setActiveShipmentIndex(index))}>
        <div><RegexInput type={"number"} value={item.qtyPerBox} handler={(value) => {
            dispatch(
                updateShipmentData(
                    {
                        item: update<ShipmentItem>(item, "qtyPerBox", value),
                        index: Number(index)
                    })
            )
        }} errorMessage={"Numbers only"}/></div>
        <div>{Math.ceil(item.numOfBoxes)}</div>
        <div><RegexInput type={"decimal"} value={item.length} handler={(value) => {
            dispatch(
                updateShipmentData(
                    {
                        item: update<ShipmentItem>(item, "length", value),
                        index: Number(index)
                    })
            )
        }} errorMessage={"Numbers only"}/></div>
        <div><RegexInput type={"decimal"} value={item.height} handler={(value) => {
            dispatch(
                updateShipmentData(
                    {
                        item: update<ShipmentItem>(item, "height", value),
                        index: Number(index)
                    })
            )
        }} errorMessage={"Numbers only"}/></div>
        <div><RegexInput type={"decimal"} value={item.width} handler={(value) => {
            dispatch(
                updateShipmentData(
                    {
                        item: update<ShipmentItem>(item, "width", value),
                        index: Number(index)
                    })
            )
        }} errorMessage={"Numbers only"}/></div>
        <div>{item.m3perBox.toFixed(2)}</div>
        <div>{item.m3total.toFixed(2)}</div>
    </div>
}