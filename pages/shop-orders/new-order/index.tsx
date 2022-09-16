import React, {useEffect} from 'react';
import SideBar from "../sidebar/sidebar";
import StockList from "./stock-list";
import OrderList from "./order-list";
import {
    selectDeadStock,
    selectEditOrder, selectNewOrderArray,
    selectSupplierFilter, selectSupplierItems, selectTotalPrice, setEditOrder, setNewOrderArray,
    setSideBarContent,
    setSupplierItems, setTotalPrice
} from "../../../store/shop-orders-slice";
import {useDispatch, useSelector} from "react-redux";
import styles from "../shop-orders.module.css"

export default function NewOrder({updateNotification}) {

    const dispatch = useDispatch()
    const supplierItems = useSelector(selectSupplierItems)
    const supplier = useSelector(selectSupplierFilter)
    const editOrder = useSelector(selectEditOrder)
    const newOrderArray = useSelector(selectNewOrderArray)
    const totalPrice = useSelector(selectTotalPrice)
    const deadStockList = useSelector(selectDeadStock)

    const newOrderHandler = (freshOrder?) => {
        if(supplier) {
            const opts = {
                method: "POST",
                body: JSON.stringify({supplier: supplier}),
                headers: {
                    'token': "9b9983e5-30ae-4581-bdc1-3050f8ae91cc",
                    'Content-Type': 'application/json'
                }
            }
            fetch("/api/shop-orders/get-supplier-items", opts)
                .then(res => res.json())
                .then(res => {
                    let itemsTempObject = {}
                    itemsTempObject[supplier] = []
                    for (let i = 0; i < res.length; i++) {
                        res[i].SUPPLIER = supplier
                        res[i].bookedIn = "false"
                        res[i].newProduct = false
                        res[i].lowStock = false
                        res[i].inOrder = false
                        res[i].arrived = 0
                        res[i].tradePack = 1
                        res[i].qty = 1
                        if (res[i].STOCKTOTAL < res[i].MINSTOCK) res[i].lowStock = true;
                        deadStockList[supplier].find((element) => element.SKU === res[i].SKU) ? res[i].deadStock = true : res[i].deadStock = false;
                        itemsTempObject[supplier].push(res[i]);
                    }
                    if (freshOrder) {
                        dispatch(setNewOrderArray([]))
                        dispatch(setTotalPrice(0))
                        dispatch(setEditOrder([]))
                    } else {
                        let totalPrice = 0
                        for (let i = 0; i < newOrderArray.length; i++) {
                            totalPrice += (newOrderArray[i].PURCHASEPRICE * newOrderArray[i].tradePack * newOrderArray[i].qty)
                            if(editOrder) {
                                let index = itemsTempObject[supplier].findIndex(item => item.SKU === newOrderArray[i].SKU)
                                itemsTempObject[supplier].splice(index, 1)
                            }
                        }
                        dispatch(setTotalPrice(totalPrice))
                    }
                    console.log(itemsTempObject)
                    dispatch(setSupplierItems(itemsTempObject[supplier]))
                })
        }
    }

    useEffect(() => {
            const opts = {
                method: "POST",
                headers: {
                    'token': "9b9983e5-30ae-4581-bdc1-3050f8ae91cc",
                    'Content-Type': 'application/json'
                }
            }
            fetch("/api/shop-orders/get-suppliers-and-low-stock", opts)
                .then(res => res.json())
                .then(res => {
                    transformLowStockDataForSidebar(res)
                })

            newOrderHandler()

        function transformLowStockDataForSidebar(data) {
            let sortedData = data.sort((a, b) => {
                if (!a.SUPPLIER) a.SUPPLIER = "Default"
                if (!b.SUPPLIER) b.SUPPLIER = "Default"
                return a.SUPPLIER.localeCompare(b.SUPPLIER)
            })
            let tempObject = {}
            for (let i = 0; i < sortedData.length; i++) {
                tempObject[sortedData[i].SUPPLIER] = sortedData[i].LOWSTOCKCOUNT
            }
            dispatch(setSideBarContent({content:tempObject, title: "Suppliers"}))
        }
    }, [supplier])

    return (
        <div className={styles["shop-orders-parent"]}>
            <SideBar/>
            <div className={styles["shop-orders-table-parent"]}>
                {supplier ? <OrderList updateNotification={updateNotification}/> : null}
                {supplier ? <StockList/> : null}
            </div>
        </div>
    );

}