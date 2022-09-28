import * as React from 'react';
import SideBar from "../sidebar/sidebar";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styles from '../shop-orders.module.css'
import {
    selectDeadStock,
    setSideBarContent,
} from "../../../store/shop-orders-slice";
import ColumnLayout from "../../../components/layouts/column-layout";
import Image from "next/image";

export default function DeadStock() {

    const deadStockList = useSelector(selectDeadStock)
    const dispatch = useDispatch()
    const [supplier, setSupplier] = useState<string>(null)


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

    function imageCheck(item){
        switch (item.SOLDFLAG) {
            case 3:
                return (<Image src="/dead-stock-icon-green.webp" width="22px" height="22px"
                               alt={"dead-stock-icon"}/>)

            case 6:
                return (<Image src="/dead-stock-icon-orange.webp" width="22px" height="22px"
                               alt={"dead-stock-icon"}/>)

            case 10:
                return (<Image src="/dead-stock-icon-red.webp" width="22px" height="22px"
                               alt={"dead-stock-icon"}/>)
        }
    }

    function buildDeadStockList() {
        let tempArray = []
            tempArray.push(
                <div className={`${styles["shop-orders-table"]} ${styles["dead-stock-list-grid"]}`}>
                    <span/>
                    <span>SKU</span>
                    <span>Title</span>
                    <span/>
                </div>
            )
            deadStockList[supplier].forEach((value, key) => {
                    tempArray.push(<div key={key} className={`${styles["shop-orders-table"]} ${styles["shop-orders-table-cells"]} ${styles["dead-stock-list-grid"]}`}>
                        <span/>
                        <span>{value.SKU}</span>
                        <span>{value.TITLE}</span>
                        <span>{imageCheck(value)}</span>
                    </div>)
            })
            return (
                <div className={styles["shop-orders-table-containers"]}>{tempArray}</div>
            )
    }

    function supplierHandler(supplier){
        setSupplier(supplier)
    }

    return (
        <>
            <SideBar supplierFilter={(x) => supplierHandler(x)}/>
            {!supplier ? null :<ColumnLayout>
                {buildDeadStockList()}
            </ColumnLayout>}
        </>
    );
}