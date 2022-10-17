import * as React from 'react'
import SubmitToLinnworksButtons from "./submit-to-linnworks-buttons";
import styles from "../shop-orders.module.css";
import {
    OpenOrdersObject,
    selectOpenOrders,
    setRemoveFromBookedInState
} from "../../../store/shop-orders-slice";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";

/**
 * Display Arrived Component
 */
export default function DisplayArrived() {

    const router = useRouter()
    const dispatch = useDispatch()
    const orders = useSelector(selectOpenOrders)
    const loadedOrder = orders ? orders[Number(router.query.index)] : null

    async function removeFromBookedInHandler(order:OpenOrdersObject, index:number, SKU:string) {
        dispatch(setRemoveFromBookedInState({index:index, SKU:SKU, order: router.query.index as string}))
    }

    function arrivedTableCells() {
        let tempArray = []
        for (let i = 0; i < loadedOrder!.arrived.length; i++) {
            tempArray.push(
                <div key={i} className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["open-orders-grid"]}`} style={loadedOrder!.arrived[i].submitted ? {backgroundColor:"var(--traffic-light-green)"} : {backgroundColor:"var(--primary-table-cell-background)"}} >
                    {!loadedOrder!.arrived[i].submitted ? <button onClick={() => removeFromBookedInHandler(loadedOrder!, i, loadedOrder!.arrived[i].SKU)}>⇅</button>: <span/>}
                    <span className={styles["center-align"]}>{loadedOrder!.arrived[i].qty ? loadedOrder!.arrived[i].qty : 0} </span>
                    <span className={styles["center-align"]}>{loadedOrder!.arrived[i].tradePack ??= 0}</span>
                    <span>{loadedOrder!.arrived[i].SKU} </span>
                    <span>{loadedOrder!.arrived[i].TITLE} </span>
                    <span>{loadedOrder!.arrived[i].arrived} </span>
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
                    <SubmitToLinnworksButtons/>
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