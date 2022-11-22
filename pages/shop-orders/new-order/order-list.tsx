import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    selectNewOrderArray,
    selectTotalPrice,
    setChangeOrderArray,
    setOrderInfoReset,
} from "../../../store/shop-orders-slice";
import styles from "../shop-orders.module.css"
import {useRouter} from "next/router";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {orderObject} from "../../../server-modules/shop/shop-order-tool";
import CurrentOrderList from "./build-order-list";

/**
 * Order List Component
 */
export default function OrderList() {

    const totalPrice = useSelector(selectTotalPrice)
    const dispatch = useDispatch()

    let newProduct: orderObject = {
        SOLDFLAG: 0,
        IDBEP: {BRAND: ""},
        MINSTOCK: 0,
        PURCHASEPRICE: 0,
        STOCKTOTAL: "0",
        SUPPLIER: "",
        _id: "",
        deadStock: false,
        qty: 1,
        tradePack: 1,
        SKU: "",
        TITLE: "",
        newProduct: true,
        bookedIn: "false",
        arrived: 0,
        submitted: false
    }
    let tempArray = [
        <div key={new Date().toString()} id={styles["add-new-item-container"]}>
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