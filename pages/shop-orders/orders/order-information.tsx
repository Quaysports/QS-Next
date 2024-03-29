import * as React from 'react';
import {Fragment} from "react";
import styles from "../shop-orders.module.css"
import {useSelector} from "react-redux";
import {OpenOrdersObject, selectOpenOrders} from "../../../store/shop-orders-slice";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import CSVButton from "../../../components/csv-button";
import {useRouter} from "next/router";
import {toCurrency} from "../../../components/utils/utils";

/**
 * Order Information Component
 */
export default function OrderInformation() {

    const router = useRouter()
    const orders = useSelector(selectOpenOrders)
    const loadedOrder = orders ? orders[Number(router.query.index)] : null

    function deleteOrder(order:OpenOrdersObject) {
        dispatchNotification({
            type: "confirm",
            title: "Warning",
            content: `Are you sure you want to delete ${order.supplier}(${order.id}) order?`,
            fn: () => deleteConfirmed(order)
        })
    }

    function deleteConfirmed(order:OpenOrdersObject) {
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
            },
            body: JSON.stringify({order: order})
        }
        fetch("/api/shop-orders/delete-order", opts)
            .then(res => {
                !res.ok ?
                    dispatchNotification({
                        type: "alert",
                        title: "Failed",
                        content: "Error, please contact IT"
                    })
                    : dispatchNotification({
                        type: "alert",
                        title: "Success",
                        content: `${order.supplier}(${order.id}) has been deleted`
                    });
                router.push({pathname: "/shop-orders", query: {tab: "orders"}})
            })
    }

    if (loadedOrder) {
        let tempArray: JSX.Element[] = []
        let csvObject = []
        if(loadedOrder && loadedOrder.order){
            for(const item of loadedOrder.order) csvObject.push({SKU:item.SKU, Title:item.title, Quantity:item.quantity})
        }
        tempArray.push(
            <div key={1} className={styles["shop-orders-table-containers"]}>
                <div className={styles["shop-order-information"]} key={loadedOrder.date}>
                    <span>ID: {loadedOrder.supplier}({loadedOrder.id})</span>
                    <span>Cost: {loadedOrder.price ? toCurrency(loadedOrder.price) : 0}</span>
                    <span className={styles["primary-buttons"]}>
                    <button onClick={() => deleteOrder(loadedOrder)}>Delete Order</button>
                    <CSVButton objectArray={csvObject} fileName={`${loadedOrder.supplier}-${loadedOrder.id}`}/>
                </span>
                </div>
            </div>
        )
        return <Fragment key={loadedOrder.date}>{tempArray}</Fragment>
    } else {
        return null
    }
}