import * as React from 'react';
import SideBar from "../sidebar/sidebar";
import DisplayOnOrder from "./display-on-order";
import DisplayArrived from "./display-arrived";
import styles from "../shop-orders.module.css"
import OrderInformation from "./order-information";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    setLoadedOrder,
    setSideBarContent,
    setOpenOrders,
    selectSupplierFilter,
    selectOpenOrders, selectLoadedOrder
} from "../../../store/shop-orders-slice";

export default function Orders() {

    const dispatch = useDispatch()
    const supplierFilter = useSelector(selectSupplierFilter)
    const openOrders = useSelector(selectOpenOrders)

    useEffect(() => {
        if(!supplierFilter) {
            const opts = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
                }
            }
            fetch("/api/shop-orders/get-open-orders", opts)
                .then(res => res.json())
                .then((res) => {
                    transformOrdersDataForSideBar(res)
                    transformOrdersDataToMap(res)
                })

            function transformOrdersDataForSideBar(openOrders) {
                let tempObject = {}
                for (let i = 0; i < openOrders.length; i++) {
                    tempObject[(i + 1).toString() + " - " + openOrders[i].supplier] = openOrders[i].id
                }
                dispatch(setSideBarContent({content: tempObject, title: "Orders"}))
            }

            function transformOrdersDataToMap(openOrders) {
                let tempObject = {}
                let i = 0
                for (const order of openOrders) {
                    tempObject[order.id] = order
                    i++
                }
                dispatch(setOpenOrders(tempObject))
            }
        }
        if(supplierFilter){
            let loadedOrder = openOrders[supplierFilter]
            dispatch(setLoadedOrder(loadedOrder))
        }
    }, [supplierFilter])

    return (
        <div className={styles["shop-orders-parent"]}>
            <SideBar/>
            <div className={styles["shop-orders-table-parent"]}>
                <OrderInformation/>
                <DisplayOnOrder/>
                <DisplayArrived/>
            </div>
        </div>
    );
}

//TODO When submitting the order to linnworks post to /Shop/AdjustStock with the Query prefix being StockIn - "insert date here"