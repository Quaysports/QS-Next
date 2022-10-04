import * as React from 'react'
import {Fragment, useEffect, useState} from "react";
import styles from "../shop-orders.module.css"
import {useDispatch, useSelector} from "react-redux";
import {
    OpenOrdersObject,
    selectLoadedOrder,
    setArrivedHandler,
    setBookedInState,
    setEditOrder,
} from "../../../store/shop-orders-slice";
import {Router, useRouter} from "next/router";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";

/**
 * Display On Order Component
 */
export default function DisplayOnOrder() {

    const loadedOrder = useSelector(selectLoadedOrder)
    const dispatch = useDispatch()
    const router = useRouter()
    const [saveOrder, setSaveOrder] = useState<boolean>(false)

    function arrivedHandler(quantity:string, item:OpenOrdersObject, index:number) {
        dispatch(setArrivedHandler({index: index, value: Number(quantity)}))
    }

    function editOrder(order:OpenOrdersObject) {
        if(order.order.length > 0) {
            dispatch(setEditOrder(order))
            router.push("/shop-orders?tab=new-order")
        }
    }

    function bookedInHandler(order:OpenOrdersObject, index:number) {
        if (order.order[index].arrived! <= 0) {
            dispatchNotification({type: "alert", title:"None Arrived", content:"Please increase the amount that has arrived"})
            return
        }
        if ((order.order[index].qty - order.order[index].arrived!) < 0) {
            dispatchNotification({type: "alert", title:"Too Many Arrived", content:"More have arrived than were ordered, please increase the order amount or check the amount that have arrived"})
            return
        }

        if ((order.order[index].qty - order.order[index].arrived!) === 0) {
            setSaveOrder(true)
            dispatch(setBookedInState({bookedIn: "false", index: index}))
            return
        }

        if ((order.order[index].qty - order.order[index].arrived!) > 0) {
            let conf = window.confirm("Did only part of the order arrive?")
            if (conf) {
                setSaveOrder(true)
                dispatch(setBookedInState({bookedIn: "partial", index: index}))
            }
        }
    }

    useEffect(() => {
        if(saveOrder) {
            const opts = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
                },
                body: JSON.stringify(loadedOrder)
            }
            fetch("/api/shop-orders/update-order", opts).then()
            setSaveOrder(false)
        }
    }, [loadedOrder])

    function backgroundColorCheck(bookedIn: string | undefined) {
        if (bookedIn === "partial") {
            return {backgroundColor: "orange"}
        } else {
            return {backgroundColor: ""}
        }
    }

    function onOrderTableCells() {
        let tempArray = []
        let newProductArray = [<div key={"new-title"}><span/><span/><span/><span>New Products</span><span/><span/>
        </div>]
        for (let i = 0; i < loadedOrder!.order.length; i++) {
            if (loadedOrder!.order[i].newProduct) {
                newProductArray.push(
                    <div key={loadedOrder!.order[i].SKU}
                         className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["open-orders-grid"]}`}
                         style={backgroundColorCheck(loadedOrder!.order[i].bookedIn)}>
                        <button onClick={() => bookedInHandler(loadedOrder!, i)}>⇅</button>
                        <span className={styles["center-align"]}>{loadedOrder!.order[i].qty ??= 0}</span>
                        <span className={styles["center-align"]}>{loadedOrder!.order[i].tradePack ??= 0}</span>
                        <span>{loadedOrder!.order[i].SKU} </span>
                        <span>{loadedOrder!.order[i].TITLE} </span>
                        <input value={loadedOrder!.order[i].arrived}
                               onChange={(e) => {
                                   arrivedHandler(e.target.value, loadedOrder!, i)
                               }}/>
                    </div>)
            } else {
                tempArray.push(
                    <div key={loadedOrder!.order[i].SKU}
                         className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["open-orders-grid"]}`}
                         style={backgroundColorCheck(loadedOrder!.order[i].bookedIn)}>
                        <button onClick={() => bookedInHandler(loadedOrder!, i)}>⇅</button>
                        <span className={styles["center-align"]}>{loadedOrder!.order[i].qty ??= 0}</span>
                        <span className={styles["center-align"]}>{loadedOrder!.order[i].tradePack ??= 0}</span>
                        <span>{loadedOrder!.order[i].SKU} </span>
                        <span>{loadedOrder!.order[i].TITLE} </span>
                        <input value={loadedOrder!.order[i].arrived}
                               onChange={(e) => {
                                   arrivedHandler(e.target.value, loadedOrder!, i)
                               }}/>
                    </div>
                )
            }
        }

        if (newProductArray.length === 1) newProductArray.splice(0, 1)
        return <Fragment key={1}>{tempArray}{newProductArray}</Fragment>
    }

    if (loadedOrder) {
        return (
            <div className={styles["shop-orders-table-containers"]}>
                <div className={styles["table-title-container"]}>
                    <span>On Order</span>
                    <span className={styles["primary-buttons"]}><button onClick={() => editOrder(loadedOrder)}>Edit Order</button></span>
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
    } else {
        return <></>
    }
}

