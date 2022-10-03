import * as React from 'react';
import SideBar from "../sidebar/sidebar";
import DisplayOnOrder from "./display-on-order";
import DisplayArrived from "./display-arrived";
import OrderInformation from "./order-information";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    setLoadedOrder,
    setSideBarContent,
    setOpenOrders,
    selectOpenOrders
} from "../../../store/shop-orders-slice";
import ColumnLayout from "../../../components/layouts/column-layout";
import {shopOrder} from "../../../server-modules/shop/shop-order-tool";

/**
 * Orders Tab
 */
export default function Orders() {

    const dispatch = useDispatch()
    const openOrders = useSelector(selectOpenOrders)
    const [supplier, setSupplier] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (!supplier) {
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
                    transformOrdersDataToObject(res)
                })

            function transformOrdersDataForSideBar(openOrders:shopOrder[]) {
                let tempObject:{[key:string]: string} = {}
                for (let i = 0; i < openOrders.length; i++) {
                    tempObject[(i + 1).toString() + " - " + openOrders[i].supplier] = openOrders[i].id
                }
                dispatch(setSideBarContent({content: tempObject, title: "Orders"}))
            }

            function transformOrdersDataToObject(openOrders:shopOrder[]) {
                let tempObject:{[key:string]:shopOrder} = {}
                let i = 0
                for (const order of openOrders) {
                    tempObject[(i + 1).toString() + " - " + openOrders[i].supplier] = order
                    i++
                }
                dispatch(setOpenOrders(tempObject))
            }
        }
        if (supplier) {
            let loadedOrder = openOrders[supplier]
            dispatch(setLoadedOrder(loadedOrder))
        }

    }, [supplier])

    function supplierHandler(supplier:string | undefined) {
        setSupplier(supplier)
    }

    return (
        <>
            <SideBar supplierFilter={(x) => supplierHandler(x)}/>
            {!supplier ? undefined : <ColumnLayout background={false}>
                <OrderInformation supplierFilter={() => supplierHandler(undefined)}/>
                <DisplayOnOrder/>
                <DisplayArrived supplierFilter={() => supplierHandler(undefined)}/></ColumnLayout>}
        </>
    );
}

//TODO When submitting the order to linnworks post to /Shop/AdjustStock with the Query prefix being StockIn - "insert date here"