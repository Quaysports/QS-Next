import * as React from 'react'
import SubmitToLinnworksButtons from "./submit-to-linnworks-buttons";
import styles from "../shop-orders.module.css";
import {selectLoadedOrder, setLoadedOrder} from "../../../store/shop-orders-slice";
import {useDispatch, useSelector} from "react-redux";

interface DisplayArrivedProps{
    supplierFilter: () => void
}
export default function DisplayArrived(props: DisplayArrivedProps) {

    const dispatch = useDispatch()
    const loadedOrder = useSelector(selectLoadedOrder)

    async function removeFromBookedInHandler(order, index, SKU) {
        const i = order.order.indexOf((object:{SKU:string}) => object.SKU === SKU)
        if (i > -1){
            order.order[i].qty = (order.order[i].qty + order.arrived[index].arrived)
            order.order[i].arrived = 0
            order.arrived.splice(index, 1)
        } else {
            order.arrived[index].arrived = 0
            order.order.push(order.arrived[index])
            order.arrived.splice(index, 1)
        }
        dispatch(setLoadedOrder(order))
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
            },
            body: JSON.stringify({order:order})
        }
        await fetch("/api/shop-orders/order-update", opts)
    }

    function arrivedTableCells() {
        let tempArray = []
        for (let i = 0; i < loadedOrder.arrived.length; i++) {
            tempArray.push(
                <div key={i} className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["open-orders-grid"]}`} >
                    <button onClick={() => removeFromBookedInHandler(loadedOrder, i, loadedOrder.arrived[i].SKU)}>⇅</button>
                    <span className={styles["center-align"]}>{loadedOrder.arrived[i].qty ? loadedOrder.arrived[i].qty : 0} </span>
                    <span className={styles["center-align"]}>{loadedOrder.arrived[i].tradePack ??= 0}</span>
                    <span>{loadedOrder.arrived[i].SKU} </span>
                    <span>{loadedOrder.arrived[i].TITLE} </span>
                    <span>{loadedOrder.arrived[i].arrived} </span>
                </div>
            )
        }
        return <>{tempArray}</>
    }
    if (loadedOrder) {
        return(
            <div className={styles["shop-orders-table-containers"]}>
                <div className={styles["table-title-container"]}>
                    <span>Arrived</span>
                    <SubmitToLinnworksButtons supplierFilter={props.supplierFilter}
                    />
                </div>
                <div className={`${styles["shop-orders-table"]} ${styles["open-orders-grid"]}`}>
                    <span/>
                    <span className={styles["center-align"]}>Ordered</span>
                    <span className={styles["center-align"]}>T/P Size</span>
                    <span>SKU</span>
                    <span>Title</span>
                    <span className={styles["center-align"]}>Arrived</span>
                </div>
                {arrivedTableCells()}
            </div>
                )

    } else {
        return <></>
    }
}