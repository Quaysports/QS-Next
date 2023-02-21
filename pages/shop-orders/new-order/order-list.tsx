import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    selectTotalPrice,
    setChangeOrderArray
} from "../../../store/shop-orders-slice";
import styles from "../shop-orders.module.css"
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {orderObject} from "../../../server-modules/shop/shop-order-tool";
import CurrentOrderList from "./build-order-list";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

/**
 * Order List Component
 */
export default function OrderList() {

    const totalPrice = useSelector(selectTotalPrice)
    const dispatch = useDispatch()

    function newProductHandler(){
        let newProduct: orderObject = {
            soldFlag: 0,
            brand:"",
            stock: {default: 0, value: 0, warehouse: 0, minimum:0, total:0, tradePack:null},
            prices:{purchase: 0},
            supplier: "",
            _id: "",
            deadStock: false,
            quantity: 1,
            tradePack: 1,
            SKU: "",
            title: "",
            newProduct: true,
            bookedIn: "false",
            arrived: 0,
            submitted: false
        }
        let tempArray = [
            <div key={new Date().toString()} id={styles["add-new-item-container"]}>
                <div>SKU:<input onChange={(e) => newProduct.SKU = e.target.value}/></div>
                <div>Title:<input onChange={(e) => newProduct.title = e.target.value}/></div>
                <div>
                    <button
                        onClick={() => {
                            dispatch(setChangeOrderArray({item: newProduct, type: "new"}));
                            dispatchNotification();
                        }}>Submit
                    </button>
                    <button id={styles["add-new-item-container-cancel-button"]} onClick={() => {
                        dispatchNotification();
                    }}>Cancel
                    </button>
                </div>
            </div>
        ]
        dispatchNotification({
            type: "popup",
            title: "New Item",
            content: tempArray,
        })
    }

    return (
        <div className={styles["shop-orders-table-containers"]}>
            <div className={styles["table-title-container"]}>
                <span>Order List</span>
                <span className={styles["primary-buttons"]}>
                            <button onClick={() => newProductHandler()}>Add New Item</button>
                        </span>
                <span id={styles["order-total"]}
                >Total Order: {toCurrency(totalPrice)}</span>
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