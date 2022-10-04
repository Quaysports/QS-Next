import * as React from 'react';
import SideBar from "../sidebar/sidebar";
import {useEffect, useState} from "react";
import {
    OpenOrdersObject,
    selectCompletedOrders, selectOrderContents,
    setCompletedOrders, setOrderContents,
    setSideBarContent
} from "../../../store/shop-orders-slice";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import styles from '../shop-orders.module.css'
import ColumnLayout from "../../../components/layouts/column-layout";
import {shopOrder} from "../../../server-modules/shop/shop-order-tool"

/**
 * Completed Orders Tab
 */
export default function CompletedOrders() {

    const dispatch = useDispatch()
    const completedOrders = useSelector(selectCompletedOrders)
    const orderContents = useSelector(selectOrderContents)
    const [supplier, setSupplier] = useState<string | null>(null)

    useEffect(() => {
        const today = new Date()
        const lastYear = new Date()
        lastYear.setFullYear(today.getFullYear() - 1)

        const start = {date: {$gt: lastYear.getTime()}}
        const end = {date: {$lt: today.getTime()}}

        let searchParams = {start, end}
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
            },
            body: JSON.stringify(searchParams)
        }

        fetch('/api/shop-orders/get-complete-orders', opts)
            .then(res => res.json())
            .then(res => {

                let tempObject:{[key:string]:shopOrder[]} = {}
                for (let i = 0; i < res.length; i++) {
                    tempObject[res[i].supplier] ?
                        tempObject[res[i].supplier].push(res[i]) :
                        tempObject[res[i].supplier] = [res[i]]
                }
                dispatch(setCompletedOrders(tempObject as {[key:string]:OpenOrdersObject[]}))

                function transformCompletedOrdersForSideBar(completedOrders:shopOrder[]) {
                    let sortedData = completedOrders.sort((a, b) => {
                        return a.supplier === b.supplier ? 0 : a.supplier > b.supplier ? 1 : -1
                    })
                    let tempObject:{[key:string]:number} = {}
                    for (let i = 0; i < sortedData.length; i++) {
                        tempObject[sortedData[i].supplier] ? tempObject[sortedData[i].supplier]++ : tempObject[sortedData[i].supplier] = 1
                    }
                    dispatch(setSideBarContent({content: tempObject, title: "Completed Orders"}))
                }
                transformCompletedOrdersForSideBar(res)
            })
    }, [supplier])

    function completedOrdersList() {
        if (supplier) {
            let tempArray = [<option onClick={() => dispatch(setOrderContents(null))} key={0}>Select Order</option>]
            let i = 0
            completedOrders![supplier].slice().reverse().forEach((value) => {
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
        } else {
            return null
        }
    }

    function showOrderContents() {
        if (orderContents) {
            let tempArray:JSX.Element[] = []
            orderContents.arrived.forEach((item, index) => {
                    tempArray.push(
                        <div key={index}
                             className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["completed-orders-list-grid"]}`}>
                            <span className={"center-align"}>{item.qty}</span>
                            <span>{item.SKU}</span>
                            <span>{item.TITLE}</span>
                        </div>
                    )
                }
            )
            return (
                <div className={styles["shop-orders-table-containers"]}>
                    <div className={`${styles["shop-orders-table"]} ${styles["completed-orders-list-grid"]}`}>
                        <span className={"center-align"}>Amount</span>
                        <span>SKU</span>
                        <span>Title</span>
                    </div>
                    {tempArray}
                </div>
            )
        } else {
            return null
        }
    }

    function supplierHandler(supplier:string){
        setSupplier(supplier)
        dispatch(setOrderContents(null))
    }

    return (
        <>
            <SideBar supplierFilter={(x) => supplierHandler(x)}/>
            {!supplier ? null : <ColumnLayout background={false}>
                {completedOrdersList()}
                {showOrderContents()}
            </ColumnLayout>}
        </>
    );
}