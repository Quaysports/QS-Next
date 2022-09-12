import * as React from 'react';
import {OpenOrdersObject} from "./index";
import {Fragment} from "react";
import styles from "../shop-orders.module.css"

interface OrderInformationProps {
    orderID: string
    openOrders: Map<string, OpenOrdersObject[]>
    deleteOrder: (x:OpenOrdersObject) => void
}

export default function OrderInformation(props: OrderInformationProps) {

    if (props.orderID) {
        let order = props.openOrders.get(props.orderID)
        let tempArray: JSX.Element[] = []
        tempArray.push(
            <div key={1} className={styles["shop-orders-table-containers"]}>
                <div className={styles["shop-order-information"]} key={props.orderID}>
                    <span>ID: {order[0].supplier}({order[0].id})</span>
                    <span>Cost: £{order[0].price ? order[0].price : 0}</span>
                    <span className={styles["primary-buttons"]}>
                    <button onClick={() => props.deleteOrder(order[0])}>Delete Order</button>
                    <button>Download CSV</button>
                </span>
                </div>
            </div>
        )
        return <Fragment key={order[0].id}>{tempArray}</Fragment>
    } else {
        return null
    }


}