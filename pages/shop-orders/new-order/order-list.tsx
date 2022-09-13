import React, {Fragment, useState} from 'react';
import {item} from "../landing-page/landing-page";

interface OrderListProps {
    removeFromOrderArray: (item: item, index: number) => void
    addToOrderArray: (items: item, index?:number, qtyChange?:boolean) => void
    supplier: string
    orderAndPrice: { orderArray: item[], totalPrice: number }
    loadListHandler: (x: string) => void
    saveOrder: Function
}

export default function OrderList(props: OrderListProps) {

    const [newItem, setNewItem] = useState<boolean>(false)

    function currentOrderList() {
        return (<Fragment>
                {props.orderAndPrice.orderArray.map((item, index) => {
                    return (
                        <div key={item.SKU} className="shop-orders-table shop-orders-table-cells order-list-grid">
                            <button onClick={() => {
                                props.removeFromOrderArray(item, index)
                            }}>⇅
                            </button>
                            <span className={"center-align"}>{item.STOCKTOTAL} </span>
                            <span className={"center-align"}>{item.MINSTOCK} </span>
                            <span>{item.SKU} </span>
                            <span>{item.TITLE} </span>
                            <input defaultValue={item.qty ? item.qty : 1} onChange={(e) => {changeInputAmountHandler(item, index, e.target.value, "qty")}}/>
                            <input defaultValue={item.tradePack ? item.tradePack : 1} onChange={(e) => {changeInputAmountHandler(item, index, e.target.value, "tradePack")}}/>
                            <span
                                className={"center-align"}>£{item.PURCHASEPRICE ? item.PURCHASEPRICE.toFixed(2) : 0}</span>
                        </div>
                    )

                })}</Fragment>
        )
    }

    function changeInputAmountHandler(item:item, index:number, value: string, type: string){
        if(type === "qty") item.qty = parseFloat(value)
        if(type === "tradePack") item.tradePack = parseFloat(value)
        props.addToOrderArray(item, index, true)
    }

    function addNewItemToOrder() {
        //TODO add function to submit button to push into a new items array
        if (newItem === true) {
            let newProduct:item = {
                IDBEP: {BRAND: ""},
                MINSTOCK: 0,
                PURCHASEPRICE: 0,
                STOCKTOTAL: 0,
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
                <div id={"full-screen-dim"}>
                    <div id={"add-new-item-container"}>
                        <div>SKU:<input onChange={(e) => newProduct.SKU = e.target.value}/></div>
                        <div>Title:<input onChange={(e) => newProduct.TITLE = e.target.value}/></div>
                        <div>
                            <button onClick={() => createNewItem(newProduct)}>Submit</button>
                            <button id={"add-new-item-container-cancel-button"} onClick={addNewItemToOrderHandler}>Cancel</button>
                        </div>
                    </div>
                </div>
            ]
            return <Fragment>{tempArray}</Fragment>
        }
        //TODO pass back the new item to push into the order array under NEW ITEM
    }

    function createNewItem(newProduct) {
        props.addToOrderArray(newProduct)
        addNewItemToOrderHandler()
    }

    function addNewItemToOrderHandler() {
        setNewItem(!newItem)
    }

    if (props.supplier) {
        return (
            <div className="shop-orders-table-containers">
                {addNewItemToOrder()}
                <div className="table-title-container">
                    <span>Order List</span>
                    <span className={"primary-buttons"}>
                            <button onClick={() => props.saveOrder()}>Save</button>
                        </span>
                    <span className={"primary-buttons"}>
                            <button onClick={() => addNewItemToOrderHandler()}>Add New Item</button>
                        </span>
                    <span id={"order-total"}
                          style={{float: "right"}}>Total Order: £{props.orderAndPrice.totalPrice.toFixed(2)}</span>
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
            </div>
        )
    }
}