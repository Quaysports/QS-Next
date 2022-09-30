import React, {useEffect, useState} from 'react';
import SideBar from "../sidebar/sidebar";
import StockList from "./stock-list";
import OrderList from "./order-list";
import {
    selectEditOrder, selectNewOrderArray,
    setEditOrder, setNewOrderArray,
    setSideBarContent, setSupplierItems,
    setTotalPrice, selectDeadStock, setOrderInfoReset
} from "../../../store/shop-orders-slice";
import {useDispatch, useSelector} from "react-redux";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import ColumnLayout from "../../../components/layouts/column-layout";

export default function NewOrder() {

    const dispatch = useDispatch()
    const editOrder = useSelector(selectEditOrder)
    const newOrderArray = useSelector(selectNewOrderArray)
    const deadStockList = useSelector(selectDeadStock)
    const [supplier, setSupplier] = useState<string>(editOrder ? editOrder.supplier : null)

    const newOrderHandler = (freshOrder?) => {
        if (supplier) {
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
                        res[i].submitted = false
                        if (res[i].STOCKTOTAL < res[i].MINSTOCK) res[i].lowStock = true;
                        let item = deadStockList[supplier].find((element) => element.SKU === res[i].SKU)
                        if (item){
                            res[i].deadStock = true
                            res[i].SOLDFLAG = item.SOLDFLAG
                        } else {
                            res[i].deadStock = false
                            res[i].SOLDFLAG = 0
                        }
                        itemsTempObject[supplier].push(res[i]);
                    }
                    if (freshOrder) {
                        dispatch(setNewOrderArray([]))
                        dispatch(setTotalPrice(0))
                        dispatch(setEditOrder(null))
                    } else {
                        let totalPrice = 0
                        for (let i = 0; i < newOrderArray.length; i++) {
                            totalPrice += (newOrderArray[i].PURCHASEPRICE * newOrderArray[i].tradePack * newOrderArray[i].qty)
                            if (editOrder) {
                                let index = itemsTempObject[supplier].findIndex(item => item.SKU === newOrderArray[i].SKU)
                                itemsTempObject[supplier].splice(index, 1)
                            }
                        }
                        dispatch(setTotalPrice(totalPrice))
                    }
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
            dispatch(setSideBarContent({content: tempObject, title: "Suppliers"}))
        }

        newOrderHandler()

    }, [supplier])

    function supplierHandler(supplier) {
        if(newOrderArray.length > 0){
            dispatchNotification({
                type:"confirm",
                title: "Order not saved",
                content: "This order has not been saved, changing the supplier will delete the current order, continue?",
                fn:() => {dispatch(setOrderInfoReset({})); setSupplier(supplier)}
            })
        } else {
            setSupplier(supplier)
        }
    }

    return (
        <>
            <SideBar supplierFilter={(x) => supplierHandler(x)}/>
            {!supplier ? null : <ColumnLayout background={false}><OrderList supplier={supplier}/><StockList/></ColumnLayout>}
        </>
    );
}