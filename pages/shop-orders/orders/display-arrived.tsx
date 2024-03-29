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
                <div key={i} className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["open-orders-grid"]}`} style={loadedOrder!.arrived[i].submitted ? {backgroundColor:"var(--traffic-light-green)", color:'black'} : {backgroundColor:"var(--primary-table-cell-background)"}} >
                    {!loadedOrder!.arrived[i].submitted ? <button data-testid={"arrived-button"} onClick={() => removeFromBookedInHandler(loadedOrder!, i, loadedOrder!.arrived[i].SKU)}>⇅</button>: <span/>}
                    <span className={"center-align"}>{loadedOrder!.arrived[i].arrived} </span>
                    <span className={"center-align"}>{loadedOrder!.arrived[i].quantity ? loadedOrder!.arrived[i].quantity : 0} </span>
                    <span className={"center-align"}>{loadedOrder!.arrived[i].stock.tradePack}</span>
                    <span>{loadedOrder!.arrived[i].SKU} </span>
                    <span>{loadedOrder!.arrived[i].title} </span>
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
                    <span className={"center-align"}>Arrived</span>
                    <span className={"center-align"}>Ordered</span>
                    <span className={"center-align"}>T/P Size</span>
                    <span>SKU</span>
                    <span>Title</span>

                </div>
                {arrivedTableCells()}
            </div>
                )

    } else {
        return <></>
    }
}