import React, {Fragment, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Popup from "../../../components/popup";
import {
    orderObject, selectEditOrder,
    selectNewOrderArray,
    selectSupplierFilter,
    selectTotalPrice,
    setChangeOrderArray, setEditOrder, setNewOrderArray, setTotalPrice
} from "../../../store/shop-orders-slice";
import {setShowPopup} from "../../../store/popup-slice";

export default function OrderList() {

    const newOrderArray = useSelector(selectNewOrderArray)
    const totalPrice = useSelector(selectTotalPrice)
    const supplier = useSelector(selectSupplierFilter)
    const editOrder = useSelector(selectEditOrder)
    const dispatch = useDispatch()

    function saveOrder() {
        const confirmBox = window.confirm(`Create new ${supplier} order?`)
        if (confirmBox) {
            const date = new Date();

            let newOrder = {
                id: `${date.getDate().toString()}-${(date.getMonth() + 1).toString()}-${date.getFullYear().toString()}`,
                supplier: supplier,
                date: editOrder.date ? editOrder.date: date.getTime(),
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

            fetch("https://localhost/Shop/ShopStockOrder", options)
                .then((res) => {
                    res.json()
                        .then((res) => {
                            if (res.acknowledged) {
                                alert("New order created")
                                dispatch(setEditOrder([]))
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
                        <div key={item.SKU} className="shop-orders-table shop-orders-table-cells order-list-grid">
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
        if (type === "qty") item.qty = parseFloat(value)
        if (type === "tradePack") item.tradePack = parseFloat(value)
        dispatch(setChangeOrderArray({item: item, type: "add", index: index, qtyChange: true}))
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
        <div id={"add-new-item-container"}>
            <div>SKU:<input onChange={(e) => newProduct.SKU = e.target.value}/></div>
            <div>Title:<input onChange={(e) => newProduct.TITLE = e.target.value}/></div>
            <div>
                <button
                    onClick={() => {dispatch(setChangeOrderArray({item: newProduct, type: "add", index: null})); dispatch(setShowPopup(false))}}>Submit
                </button>
                <button id={"add-new-item-container-cancel-button"} onClick={() => dispatch(setShowPopup(false))}>Cancel</button>
            </div>
        </div>
    ]

    if (supplier) {
        return (
            <div className="shop-orders-table-containers">
                <div className="table-title-container">
                    <span>Order List</span>
                    <span className={"primary-buttons"}>
                            <button onClick={() => saveOrder()}>Save</button>
                        </span>
                    <span className={"primary-buttons"}>
                            <button onClick={() => dispatch(setShowPopup(true))}>Add New Item</button>
                        </span>
                    <span id={"order-total"}
                          style={{float: "right"}}>Total Order: £{totalPrice.toFixed(2)}</span>
                </div>
                <div className="shop-orders-table order-list-grid">
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
                {Popup({title: "New Item", content: tempArray})}
            </div>
        )
    }
}