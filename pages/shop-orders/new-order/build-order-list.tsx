import React, {Fragment} from "react";
import styles from "../shop-orders.module.css";
import {selectNewOrderArray, setChangeOrderArray, setChangeOrderQty} from "../../../store/shop-orders-slice";
import {orderObject} from "../../../server-modules/shop/shop-order-tool";
import {useDispatch, useSelector} from "react-redux";
import {toCurrency} from "../../../components/margin-calculator-utils/utils";

export default function CurrentOrderList() {

    const dispatch = useDispatch()
    const newOrderArray = useSelector(selectNewOrderArray)

    function changeInputAmountHandler(item: orderObject, index: number, value: string, type: string) {
        dispatch(setChangeOrderQty({item: item, index: index, value: value, type: type}))
    }

    return (<Fragment>
            {newOrderArray.order.map((item, index) => {
                return (
                    <div key={item.SKU}
                         className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["order-list-grid"]}`}>
                        <button onClick={() => {
                            dispatch(setChangeOrderArray({item: item, type: "remove", index: index}))
                        }}>⇅
                        </button>
                        <span className={"center-align"}>{item.stock.total} </span>
                        <span className={"center-align"}>{item.stock.minimum} </span>
                        <span>{item.SKU} </span>
                        <span>{item.title} </span>
                        <input defaultValue={item.quantity ? item.quantity : 1} onChange={(e) => {
                            changeInputAmountHandler(item, index, e.target.value, "qty")
                        }}/>
                        <input defaultValue={item.tradePack ? item.tradePack : 1} onChange={(e) => {
                            changeInputAmountHandler(item, index, e.target.value, "tradePack")
                        }}/>
                        <span
                            className={"center-align"}>{item.prices.purchase ? toCurrency(item.prices.purchase) : 0}</span>
                    </div>
                )

            })}</Fragment>
    )
}