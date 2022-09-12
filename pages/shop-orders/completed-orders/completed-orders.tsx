import * as React from 'react';
import SideBar from "../sidebar/sidebar";
import {useEffect, useState} from "react";

interface CompletedOrdersObject {
    _id: string
    arrived: {
        MINSTOCK: number
        SKU: string
        STOCKTOTAL: string
        TITLE: string
        _id: string
        bookedIn: boolean
        qty: number
    }[]
    complete: boolean
    date: number
    id: string
    order: []
    supplier: string
}

export default function CompletedOrders() {

    const [completedOrders, setCompletedOrders] = useState<Map<string, CompletedOrdersObject[]>>(new Map<string, []>())
    const [sideBarContent, setSideBarContent] = useState<Map<string, {}>>(new Map<string, {}>())
    const [supplierFilter, setSupplierFilter] = useState<string>(null)
    const [orderContents, setOrderContents] = useState<CompletedOrdersObject | null>(null)

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

        fetch('https://localhost/Shop/GetCompleteOrders', opts)
            .then(res => res.json())
            .then(res => {

                transformCompletedOrdersForSideBar(res)
                let tempMap = new Map()
                for (let i = 0; i < res.length; i++) {
                    tempMap.has(res[i].supplier) ?
                        tempMap.get(res[i].supplier).push(res[i]) :
                        tempMap.set(res[i].supplier, [res[i]])
                }
                setCompletedOrders(new Map(tempMap))

                function transformCompletedOrdersForSideBar(completedOrders) {
                    let sortedData = completedOrders.sort((a,b)=>{return a.supplier === b.supplier ? 0 : a.supplier > b.supplier ? 1: -1})
                    let tempMap = new Map()
                    for (let i = 0; i < sortedData.length; i++) {
                        tempMap.set(sortedData[i].supplier, tempMap.get(sortedData[i].supplier) + 1 || 1)
                    }
                    setSideBarContent(new Map(tempMap))
                }
            })
    }, [])

    function completedOrdersSupplierFilter(x) {
        setSupplierFilter(x)
        setOrderContents(null)
    }

    function orderContentsHandler(order) {
        setOrderContents(order)
    }

    function completedOrdersList() {
        if (supplierFilter) {
            let tempArray = [<option onClick={() => orderContentsHandler({})} key={0}>Select Order</option>]
            let i = 0
            completedOrders.get(supplierFilter).slice().reverse().forEach((value) => {
                console.log(value.id)
                tempArray.push(
                    <option onClick={() => orderContentsHandler(value)} key={value.id + i}>{value.id}</option>
                )
                i++
            })
            return (
                <div className="shop-orders-table-containers">
                    Completed Order: <select>{tempArray}</select>
                </div>
            )
        } else {
            return null
        }
    }

    function showOrderContents() {
        if (orderContents) {
            let tempArray = []
            orderContents.arrived.forEach((item, index) => {
                    tempArray.push(
                        <div key={index} className="shop-orders-table shop-orders-table-cells completed-orders-list-grid">
                            <span className={"center-align"}>{item.qty}</span>
                            <span>{item.SKU}</span>
                            <span>{item.TITLE}</span>
                        </div>
                    )
                }
            )
            return (
                <div className="shop-orders-table-containers">
                    <div className="shop-orders-table completed-orders-list-grid">
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

    return (
        <div className="shop-orders-parent">
            <SideBar
                loadContent={sideBarContent}
                supplierFilter={(x) => {
                    completedOrdersSupplierFilter(x)
                }}
                title={"Orders"}
            />
            <div className="shop-orders-table-parent">
                    {completedOrdersList()}
                    {showOrderContents()}
            </div>
        </div>
    );
}