import * as React from 'react';
import SideBar from "../sidebar/sidebar";
import DisplayOnOrder from "./display-on-order";
import DisplayArrived from "./display-arrived";
import styles from "../shop-orders.module.css"
import OrderInformation from "./order-information";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {setLoadedOrder, setSideBarContent, setOpenOrders} from "../../../store/shop-orders-slice";

export default function Orders() {

    const dispatch = useDispatch()

    const [reloadPage, setReloadPage] = useState<boolean>(false)

    useEffect(() => {
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
            }
        }
        fetch("/api/get-open-orders", opts)
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
            dispatch(setSideBarContent({content:tempObject, title: "Orders"}))
        }

        function transformOrdersDataToMap(openOrders) {
            let tempObject = {}
            let i = 0
            for(const order of openOrders) {
                tempObject[(i + 1).toString() + " - " + order.orderID] = order
                i++
            }
            dispatch(setOpenOrders(tempObject))
        }
    }, [reloadPage])

    function deleteOrder(order) {
        const conf = window.confirm(`Are you sure you want to permanently delete order ${order.id}`)
        if (conf) {
            const opts = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
                },
                body: JSON.stringify(order)
            }
            fetch("/api/delete-order", opts)
                .then(() => {
                    //setReloadPage(!reloadPage)
                    dispatch(setLoadedOrder({loadedOrder: null, orderID: null}))
                })
        }
    }

    return (
        <div className={styles["shop-orders-parent"]}>
            <SideBar/>
            <div className={styles["shop-orders-table-parent"]}>
                <OrderInformation
                    deleteOrder={(x) => deleteOrder(x)}
                />
                <DisplayOnOrder/>
                <DisplayArrived/>
            </div>
        </div>
    );
}

//TODO When submitting the order to linnworks post to /Shop/AdjustStock with the Query prefix being StockIn - "insert date here"