import {selectCompletedOrders, setOrderContents} from "../../../store/shop-orders-slice";
import styles from "../shop-orders.module.css";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";

interface Props {
    supplier: string
}
export default function CompletedOrdersList({supplier}:Props) {

    const dispatch = useDispatch()
    const completedOrders = useSelector(selectCompletedOrders)

    let tempArray = [<option onClick={() => dispatch(setOrderContents(null))} key={0}>Select Order</option>]
    let i = 0
    completedOrders?.[supplier].slice().reverse().forEach((value) => {
        tempArray.push(
            <option onClick={() => dispatch(setOrderContents(value))} key={value.id + i}>{value.id}</option>
        )
        i++
    })
    return (
        <div className={styles["shop-orders-table-containers"]}>
            Completed Order: <select>{tempArray}</select>
        </div>
    )
}