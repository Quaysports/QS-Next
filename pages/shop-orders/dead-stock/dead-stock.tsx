import * as React from 'react';
import SideBar from "../sidebar/sidebar";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import styles from '../shop-orders.module.css'
import {
    selectDeadStock,
    selectSupplierFilter,
    setSideBarContent,
} from "../../../store/shop-orders-slice";

export default function DeadStock() {

    const deadStockList = useSelector(selectDeadStock)
    const supplier = useSelector(selectSupplierFilter)
    const dispatch = useDispatch()


    useEffect(() => {
        function transformDeadStockDataForSidebar(deadStockList) {

                let tempObject = {}
                for (const key in deadStockList) {
                    tempObject[key] = deadStockList[key].length
                }
                dispatch(setSideBarContent({content: tempObject, title: "Dead Stock"}))
            }
        transformDeadStockDataForSidebar(deadStockList)
    }, [deadStockList])

    function buildDeadStockList() {
        let tempArray = []
        if (supplier) {
            tempArray.push(
                <div className={`${styles["shop-orders-table"]} ${styles["dead-stock-list-grid"]}`}>
                    <span/>
                    <span>SKU</span>
                    <span>Title</span>
                </div>
            )
            deadStockList[supplier].forEach((value, key) => {
                    tempArray.push(<div key={key} className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["dead-stock-list-grid"]}`}>
                        <span/>
                        <span>{value.SKU}</span>
                        <span>{value.TITLE}</span>
                    </div>)
            })
            return (
                <div className={styles["shop-orders-table-containers"]}>{tempArray}</div>
            )
        } else {
            return <></>
        }
    }

    return (
        <div className={styles["shop-orders-parent"]}>
            <SideBar/>
            <div className={styles["shop-orders-table-parent"]}>
                {buildDeadStockList()}
            </div>
        </div>
    );
}