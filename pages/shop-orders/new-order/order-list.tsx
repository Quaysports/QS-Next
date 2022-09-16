import React, {Fragment} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    orderObject, selectEditOrder,
    selectNewOrderArray,
    selectSupplierFilter, selectSupplierItems,
    selectTotalPrice,
    setChangeOrderArray, setChangeOrderQty, setEditOrder, setNewOrderArray, setTotalPrice
} from "../../../store/shop-orders-slice";
import styles from "../shop-orders.module.css"
import {dispatchNotification} from "../../../components/notification/notification-wrapper";

export default function OrderList() {

    const newOrderArray = useSelector(selectNewOrderArray)
    const totalPrice = useSelector(selectTotalPrice)
    const supplier = useSelector(selectSupplierFilter)
    const editOrder = useSelector(selectEditOrder)
    const supplierItems = useSelector(selectSupplierItems)
    const dispatch = useDispatch()

    function saveOrder() {
        const confirmBox = window.confirm(`Create new ${supplier} order?`)
        if (confirmBox) {
            const date = new Date();

            let newOrder = {
                id: `${date.getDate().toString()}-${(date.getMonth() + 1).toString()}-${date.getFullYear().toString()}`,
                supplier: supplier,
                date: editOrder ? editOrder.date : date.getTime(),
                complete: false,
                arrived: [],
                order: newOrderArray,
            }

            let options = {
                method: 'POST',
                body: JSON.stringify(newOrder),
                headers: {
                    'token': "9b9983e5-30ae-4581-bdc1-3050f8ae91cc",
                    'Content-Type': 'application/json'
                }
            }

            fetch("api/shop-orders/update-order", options)
                .then((res) => {
                    res.json()
                        .then((res) => {
                            if (res.acknowledged) {
                                alert("New order created")
                                dispatch(setEditOrder(null))
                                dispatch(setNewOrderArray([]))
                                dispatch(setTotalPrice(0))
                            } else {
                                alert("Order failed, please try again")
                            }
                        })
                })
        } else {
            alert("order cancelled")
        }
    }

    function currentOrderList() {
        return (<Fragment>
                {newOrderArray.map((item, index) => {
                    return (
                        <div key={item.SKU} className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["order-list-grid"]}`}>
                            <button onClick={() => {
                                dispatch(setChangeOrderArray({item: item, type: "remove", index: index}))
                            }}>⇅
                            </button>
                            <span className={"center-align"}>{item.STOCKTOTAL} </span>
                            <span className={"center-align"}>{item.MINSTOCK} </span>
                            <span>{item.SKU} </span>
                            <span>{item.TITLE} </span>
                            <input defaultValue={item.qty ? item.qty : 1} onChange={(e) => {
                                changeInputAmountHandler(item, index, e.target.value, "qty")
                            }}/>
                            <input defaultValue={item.tradePack ? item.tradePack : 1} onChange={(e) => {
                                changeInputAmountHandler(item, index, e.target.value, "tradePack")
                            }}/>
                            <span
                                className={"center-align"}>£{item.PURCHASEPRICE ? item.PURCHASEPRICE.toFixed(2) : 0}</span>
                        </div>
                    )

                })}</Fragment>
        )
    }

    function changeInputAmountHandler(item: orderObject, index: number, value: string, type: string) {
        dispatch(setChangeOrderQty({item: item, index: index, value: value, type: type}))
    }

    let newProduct: orderObject = {
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
        arrived: 0
    }
    let tempArray = [
        <div id={styles["add-new-item-container"]}>
            <div>SKU:<input onChange={(e) => newProduct.SKU = e.target.value}/></div>
            <div>Title:<input onChange={(e) => newProduct.TITLE = e.target.value}/></div>
            <div>
                <button
                    onClick={() => {
                        dispatch(setChangeOrderArray({item: newProduct, type: "add", index: null}));
                        dispatchNotification({type: null});
                    }}>Submit
                </button>
                <button id={styles["add-new-item-container-cancel-button"]} onClick={() => {
                    dispatchNotification({type: null});
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
                            <button onClick={() => dispatchNotification({type: "popup", title: "New Item", content: tempArray,})}>Add New Item</button>
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
            {currentOrderList()}
        </div>
    )

}