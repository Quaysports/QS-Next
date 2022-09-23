import * as React from 'react';
import {Fragment} from "react";
import styles from "../shop-orders.module.css"
import {useDispatch, useSelector} from "react-redux";
import {selectLoadedOrder, setLoadedOrder} from "../../../store/shop-orders-slice";
import exportToCSV from "./download-csv";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";

interface OrderInformationProps{
    supplierFilter: () => void;
}
export default function OrderInformation(props: OrderInformationProps) {

    const loadedOrder = useSelector(selectLoadedOrder)
    const dispatch = useDispatch()

    async function deleteOrder(order) {
        dispatchNotification({
            type: "confirm",
            title: "Warning",
            content: `Are you sure you want to delete ${order.supplier}(${order.id}) order?`,
            fn: () => deleteConfirmed(order)
        })
    }

    function deleteConfirmed(order) {
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
                    }); props.supplierFilter()
                dispatch(setLoadedOrder(null))
            })
    }

    if (loadedOrder) {
        let tempArray: JSX.Element[] = []
        tempArray.push(
            <div key={1} className={styles["shop-orders-table-containers"]}>
                <div className={styles["shop-order-information"]} key={loadedOrder.date}>
                    <span>ID: {loadedOrder.supplier}({loadedOrder.id})</span>
                    <span>Cost: £{loadedOrder.price ? loadedOrder.price : 0}</span>
                    <span className={styles["primary-buttons"]}>
                    <button onClick={() => deleteOrder(loadedOrder)}>Delete Order</button>
                    <button onClick={() => exportToCSV(loadedOrder)}>Download CSV</button>
                </span>
                </div>
            </div>
        )
        return <Fragment key={loadedOrder.date}>{tempArray}</Fragment>
    } else {
        return null
    }
}