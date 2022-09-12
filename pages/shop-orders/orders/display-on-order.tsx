import * as React from 'react'
import {OpenOrdersObject} from "./index";
import {Fragment} from "react";
import styles from "../shop-orders.module.css"
import {useSelector} from "react-redux";
import {selectLoadedOrder} from "../../../store/shop-orders-slice";

interface DisplayOnOrderProps {
    orderID: string;
    openOrders: Map<string, OpenOrdersObject[]>
    openOrdersHandler: (x: Map<string, object>) => void
    editOrder: (x: OpenOrdersObject) => void
    loadedOrder: OpenOrdersObject
}

export default function DisplayOnOrder(props: DisplayOnOrderProps) {

    const loadedOrder = useSelector(selectLoadedOrder)

    function arrivedHandler(quantity, item) {
        item.arrived = parseInt(quantity);
    }

    function bookedInHandler(order, index) {
        if (order.order[index].arrived <= 0) {
            window.confirm("Please increase the amount that has arrived")
            return
        }
        if ((order.order[index].qty - order.order[index].arrived) < 0) {
            window.confirm("More have arrived than were ordered, please increase the order amount or check the amount that have arrived")
            return
        }

        if ((order.order[index].qty - order.order[index].arrived) === 0) {
            order.order[index].bookedIn = "false"
            order.arrived.push(order.order[index])
            order.order.splice(index, 1)
            props.openOrdersHandler(props.openOrders)
            return
        }

        if ((order.order[index].qty - order.order[index].arrived) > 0) {
            let conf = window.confirm("Did only part of the order arrive?")
            if (conf === true) {
                order.order[index].bookedIn = "partial"
                order.order[index].qty = (order.order[index].qty - order.order[index].arrived)
                order.arrived.push({...order.order[index]})
                order.arrived[(order.arrived.length - 1)].qty = order.order[index].arrived
                order.order[index].arrived = 0
                props.openOrdersHandler(props.openOrders)
            }
        }
    }

    function backgroundColorCheck(bookedIn: string) {
        if (bookedIn === "partial") {
            return {backgroundColor: "orange"}
        } else {
            return {backgroundColor: ""}
        }
    }

    function onOrderTableCells() {
        let tempArray = []
        let newProductArray = [<div key={"new-title"}><span/><span/><span/><span>New Products</span><span/><span/></div>]
        for (let i = 0; i < loadedOrder.order.length; i++) {
            if(loadedOrder.order[i].newProduct){
                newProductArray.push(
                    <div key={openOrder[0].order[i].SKU}
                         className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["open-orders-grid"]}`}
                         style={backgroundColorCheck(loadedOrder.order[i].bookedIn)}>
                    <button onClick={() => bookedInHandler(loadedOrder, i)}>⇅</button>
                    <span className={styles["center-align"]}>{loadedOrder.order[i].qty ??= 0}</span>
                    <span className={styles["center-align"]}>{loadedOrder.order[i].tradePack ??= 0}</span>
                    <span>{loadedOrder.order[i].SKU} </span>
                    <span>{loadedOrder.order[i].TITLE} </span>
                    <input defaultValue={0}
                           value={loadedOrder.order[i].arrived}
                           onChange={(e) => {
                               arrivedHandler(e.target.value, loadedOrder.order[i])
                           }}/>
                </div>)
            } else {
                tempArray.push(
                    <div key={loadedOrder.order[i].SKU}
                         className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["open-orders-grid"]}`}
                         style={backgroundColorCheck(loadedOrder.order[i].bookedIn)}>
                        <button onClick={() => bookedInHandler(loadedOrder, i)}>⇅</button>
                        <span className={styles["center-align"]}>{loadedOrder.order[i].qty ??= 0}</span>
                        <span className={styles["center-align"]}>{loadedOrder.order[i].tradePack ??= 0}</span>
                        <span>{loadedOrder.order[i].SKU} </span>
                        <span>{loadedOrder.order[i].TITLE} </span>
                        <input defaultValue={0}
                               value={loadedOrder.order[i].arrived}
                               onChange={(e) => {
                                   arrivedHandler(e.target.value, loadedOrder.order[i])
                               }}/>
                    </div>
                )
            }
        }
        if(newProductArray.length === 1) newProductArray.splice(0,1)
        return <Fragment key={1}>{tempArray}{newProductArray}</Fragment>
    }

    if (props.orderID) {
        return (
            <div className={styles["shop-orders-table-containers"]}>
                <div className={styles["table-title-container"]}>
                    <span>On Order</span>
                    <span className={styles["primary-buttons"]}><button onClick={() => props.editOrder(props.loadedOrder)}>Edit Order</button></span>
                </div>
                <div className={`${styles["shop-orders-table"]} ${styles["open-orders-grid"]}`}>
                    <span/>
                    <span className={styles["center-align"]}>Ordered</span>
                    <span className={styles["center-align"]}>T/P Size</span>
                    <span>SKU</span>
                    <span>Title</span>
                    <span className={styles["center-align"]}>Arrived</span>
                </div>
                {onOrderTableCells()}
            </div>
        )
    } else
    {
        return <></>
    }
}

