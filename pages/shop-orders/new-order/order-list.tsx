import React, {Fragment} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    selectNewOrderArray,
    selectTotalPrice,
    setChangeOrderArray,
    setOrderInfoReset,
} from "../../../store/shop-orders-slice";
import styles from "../shop-orders.module.css"
import {useRouter} from "next/router";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import {orderObject} from "../../../server-modules/shop/shop-order-tool";
import CurrentOrderList from "./build-order-list";

/**
 * Order List Component
 */
export default function OrderList() {

    const newOrderArray = useSelector(selectNewOrderArray)
    const totalPrice = useSelector(selectTotalPrice)
    const dispatch = useDispatch()
    const router = useRouter()

    function saveOrder() {
        dispatchNotification({
            type: "confirm",
            title: "Save order",
            content: `Create new ${newOrderArray.order[0].SUPPLIER} order?`,
            fn: saveConfirmed
        })
    }

    function saveConfirmed() {
        const date = new Date();

        let newOrder = {
            id: newOrderArray.id ? newOrderArray.id : `${date.getDate().toString()}-${(date.getMonth() + 1).toString()}-${date.getFullYear().toString()}`,
            supplier: newOrderArray.order[0].SUPPLIER,
            date: newOrderArray.date ? newOrderArray.date : date.getTime(),
            complete: false,
            arrived: newOrderArray.arrived,
            price: totalPrice,
            order: newOrderArray.order,
        }

        let options = {
            method: 'POST',
            body: JSON.stringify(newOrder),
            headers: {
                'token': "9b9983e5-30ae-4581-bdc1-3050f8ae91cc",
                'Content-Type': 'application/json'
            }
        }

        fetch("/api/shop-orders/update-order", options)
            .then((res) => {
                res.json()
                    .then((res) => {
                        if (res.acknowledged) {
                            dispatchNotification({type: "alert", title: "Success!", content: "New order created"})
                            dispatch(setOrderInfoReset())
                            router.push("/shop-orders?tab=orders")
                        } else {
                            dispatchNotification({
                                type: "alert",
                                title: "Error!",
                                content: "Order failed, please try again"
                            })
                        }
                    })
            })
    }

    let newProduct: orderObject = {
        SOLDFLAG: 0,
        IDBEP: {BRAND: ""},
        MINSTOCK: 0,
        PURCHASEPRICE: 0,
        STOCKTOTAL: "0",
        SUPPLIER: "",
        _id: "",
        deadStock: false,
        qty: 0,
        tradePack: 0,
        SKU: "",
        TITLE: "",
        newProduct: true,
        bookedIn: "false",
        arrived: 0,
        submitted: false
    }
    let tempArray = [
        <div id={styles["add-new-item-container"]}>
            <div>SKU:<input onChange={(e) => newProduct.SKU = e.target.value}/></div>
            <div>Title:<input onChange={(e) => newProduct.TITLE = e.target.value}/></div>
            <div>
                <button
                    onClick={() => {
                        dispatch(setChangeOrderArray({item: newProduct, type: "new"}));
                        dispatchNotification({type: undefined});
                    }}>Submit
                </button>
                <button id={styles["add-new-item-container-cancel-button"]} onClick={() => {
                    dispatchNotification({type: undefined});
                }}>Cancel
                </button>
            </div>
        </div>
    ]

    return (
        <div className={styles["shop-orders-table-containers"]}>
            <div className={styles["table-title-container"]}>
                <span>Order List</span>
                <span className={styles["primary-buttons"]}>
                            <button onClick={() => saveOrder()}>Save</button>
                        </span>
                <span className={styles["primary-buttons"]}>
                            <button onClick={() => dispatchNotification({
                                type: "popup",
                                title: "New Item",
                                content: tempArray,
                            })}>Add New Item</button>
                        </span>
                <span id={styles["order-total"]}
                >Total Order: £{totalPrice.toFixed(2)}</span>
            </div>
            <div className={`${styles["shop-orders-table"]} ${styles["order-list-grid"]}`}>
                <span/>
                <span className={"center-align"}>Stock</span>
                <span className={"center-align"}>Min</span>
                <span>SKU</span>
                <span>Title</span>
                <span>Order</span>
                <span className={"center-align"}>T/P Size</span>
                <span className={"center-align"}>P/Price</span>
                <span/>
            </div>
            <CurrentOrderList/>
        </div>
    )

}