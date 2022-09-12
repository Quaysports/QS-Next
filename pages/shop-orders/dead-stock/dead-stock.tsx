import * as React from 'react';
import SideBar from "../sidebar/sidebar";
import {useEffect, useState} from "react";

interface DeadStockProps {
    deadStockList: Map<string, {
        SKU: string,
        SUPPLIER: string,
        TITLE: string
    }>
}

export default function DeadStock(props: DeadStockProps) {

    const [supplier, setSupplier] = useState<string>(null)
    const [sideBarContent, setSideBarContent] = useState<Map<string, object>>(new Map<string, {}>())


    useEffect(() => {

        function transformDeadStockDataForSidebar(deadStockList){
            let tempMap = new Map()
            deadStockList.forEach((value, key) => {
                tempMap.set(deadStockList.get(key).SUPPLIER, tempMap.get(deadStockList.get(key).SUPPLIER) + 1 || 1)
            })
            setSideBarContent(new Map(tempMap))
        }

        transformDeadStockDataForSidebar(props.deadStockList)
    }, [props.deadStockList])


    function deadStockListHandler(supplier) {
        setSupplier(supplier)
    }

    function deadStockList() {
        let tempArray = []
        if (supplier) {
            props.deadStockList.forEach((value, key) => {
                if (value.SUPPLIER === supplier)
                    tempArray.push(<div key={key} className="shop-orders-table shop-orders-table-cells dead-stock-list-grid">
                        <span/>
                        <span>{value.SKU}</span>
                        <span>{value.TITLE}</span>
                    </div>)
            })
            return (
                <div className="shop-orders-table-containers">{tempArray}</div>
            )
        } else {
            return <></>
        }

    }

    //TODO CSS below into flex/grid
    return (
        <div className="shop-orders-parent">
            <SideBar
                loadContent={sideBarContent}
                supplierFilter={(x: string) => {
                    deadStockListHandler(x)
                }}
                title={"Suppliers"}
            />
            <div className="shop-orders-table-parent">
                {deadStockList()}
            </div>
        </div>
    );
}




