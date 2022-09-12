import * as React from 'react'
import SubmitToLinnworksButtons from "./submit-to-linnworks-buttons";
import styles from "../shop-orders.module.css";
import {selectLoadedOrder, selectOpenOrders, setOpenOrders} from "../../../store/shop-orders-slice";
import {useDispatch, useSelector} from "react-redux";


export default function DisplayArrived() {

    const dispatch = useDispatch()
    const openOrders = useSelector(selectOpenOrders)
    const loadedOrder = useSelector(selectLoadedOrder)

    function removeFromBookedInHandler(index, SKU) {
        const i = loadedOrder.order.indexOf((object:{SKU:string}) => object.SKU === SKU)
        if (i > -1){
            loadedOrder.order[i].qty = (loadedOrder.order[i].qty +loadedOrder.arrived[index].arrived)
            loadedOrder.order[i].arrived = 0
            loadedOrder.arrived.splice(index, 1)
        } else {
            loadedOrder.arrived[index].arrived = 0
            loadedOrder.order.push(loadedOrder.arrived[index])
            loadedOrder.arrived.splice(index, 1)
        }
        //dispatch(setOpenOrders(props.openOrders))
    }

    function arrivedTableCells() {
        let tempArray = []
        for (let i = 0; i < loadedOrder.arrived.length; i++) {
            tempArray.push(
                <div key={i} className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["open-orders-grid"]}`} >
                    <button onClick={() => removeFromBookedInHandler(i, loadedOrder.arrived[i].SKU)}>⇅</button>
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
                    <SubmitToLinnworksButtons
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