import * as React from 'react';
import {Fragment} from "react";
import styles from "../shop-orders.module.css"
import {useDispatch, useSelector} from "react-redux";
import {selectLoadedOrder, setLoadedOrder, setSupplierFilter} from "../../../store/shop-orders-slice";

export default function OrderInformation() {

    const loadedOrder = useSelector(selectLoadedOrder)
    const dispatch = useDispatch()

    async function deleteOrder(order){
        let conf = window.confirm("Are you sure you want to delete "+ order.id + " order?")
        if(conf) {
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
                    res.ok ? alert(order.id + " deleted") : alert("Error, please contact IT")
                    dispatch(setLoadedOrder(null))
                    dispatch(setSupplierFilter(null))
                })
        }
    }

    if (loadedOrder) {
        console.log(loadedOrder)
        let tempArray: JSX.Element[] = []
        tempArray.push(
            <div key={1} className={styles["shop-orders-table-containers"]}>
                <div className={styles["shop-order-information"]} key={loadedOrder.date}>
                    <span>ID: {loadedOrder.supplier}({loadedOrder.id})</span>
                    <span>Cost: £{loadedOrder.price ? loadedOrder.price : 0}</span>
                    <span className={styles["primary-buttons"]}>
                    <button onClick={() => deleteOrder(loadedOrder)}>Delete Order</button>
                    <button>Download CSV</button>
                </span>
                </div>
            </div>
        )
        return <Fragment key={loadedOrder.date}>{tempArray}</Fragment>
    } else {
        return null
    }


}