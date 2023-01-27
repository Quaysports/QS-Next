import * as React from 'react'
import {Fragment, useEffect, useState} from "react";
import styles from "../shop-orders.module.css"
import {useDispatch, useSelector} from "react-redux";
import {
    OpenOrdersObject,
    selectOpenOrders,
    setArrivedHandler,
    setBookedInState,
} from "../../../store/shop-orders-slice";
import {useRouter} from "next/router";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";

/**
 * Display On Order Component
 */
export default function DisplayOnOrder() {

    const router = useRouter()
    const orders = useSelector(selectOpenOrders)
    const loadedOrder = orders? orders[Number(router.query.index)] : null
    const dispatch = useDispatch()
    const [saveOrder, setSaveOrder] = useState<boolean>(false)
    console.log(orders)

    function arrivedHandler(quantity:string, index:number) {
        dispatch(setArrivedHandler({order: router.query.index as string, index: index, value: Number(quantity)}))
    }

    function editOrder(order:OpenOrdersObject) {
        if(order.order.length > 0) {
            router.push({pathname:"/shop-orders", query:{tab:"new-order", editOrder:router.query.index, brand: "All Items"}})
        }
    }

    function bookedInHandler(order:OpenOrdersObject, index:number) {
        if (order.order[index].arrived! <= 0) {
            dispatchNotification({
                type: "alert",
                title: "None Arrived",
                content: "Please increase the amount that has arrived"
            })
            return
        }
        if ((order.order[index].quantity - order.order[index].arrived!) < 0) {
            dispatchNotification({
                type: "alert",
                title: "Too Many Arrived",
                content: "More have arrived than were ordered, please increase the order amount or check the amount that have arrived"
            })
            return
        }

        if ((order.order[index].quantity - order.order[index].arrived!) === 0) {
            setSaveOrder(true)
            dispatch(setBookedInState({bookedIn: "false", index: index, orderId:Number(router.query.index)}))
            return
        }

        if ((order.order[index].quantity - order.order[index].arrived!) > 0) {
            dispatchNotification({
                type: "confirm",
                title: "Partial Order Arrived",
                content: "Did only part of the order arrive?",
                fn: () => partialBookIn()
            })

            function partialBookIn() {
                setSaveOrder(true)
                dispatch(setBookedInState({bookedIn: "partial", index: index, orderId: Number(router.query.index)}))
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
                        <input value={loadedOrder!.order[i].arrived}
                               onChange={(e) => {
                                   arrivedHandler(e.target.value, i)
                               }}/>
                        <span className={"center-align"}>{loadedOrder!.order[i].quantity ??= 0}</span>
                        <span className={"center-align"}>{loadedOrder!.order[i].tradePack ??= 0}</span>
                        <span>{loadedOrder!.order[i].SKU} </span>
                        <span>{loadedOrder!.order[i].title} </span>

                    </div>)
            } else {
                tempArray.push(
                    <div key={loadedOrder!.order[i].SKU}
                         className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["open-orders-grid"]}`}
                         style={backgroundColorCheck(loadedOrder!.order[i].bookedIn)}>
                        <button onClick={() => bookedInHandler(loadedOrder!, i)}>⇅</button>
                        <input value={loadedOrder!.order[i].arrived}
                               onChange={(e) => {
                                   arrivedHandler(e.target.value, i)
                               }}/>
                        <span className={"center-align"}>{loadedOrder!.order[i].quantity ??= 0}</span>
                        <span className={"center-align"}>{loadedOrder!.order[i].tradePack ??= 0}</span>
                        <span>{loadedOrder!.order[i].SKU} </span>
                        <span>{loadedOrder!.order[i].title} </span>

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
                    <span className={"center-align"}>Arrived</span>
                    <span className={"center-align"}>Ordered</span>
                    <span className={"center-align"}>T/P Size</span>
                    <span>SKU</span>
                    <span>Title</span>
                </div>
                {onOrderTableCells()}
            </div>
        )
    } else {
        return <></>
    }
}