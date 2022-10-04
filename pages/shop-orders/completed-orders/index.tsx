import * as React from 'react';
import SideBar from "../sidebar/sidebar";
import {useEffect, useState} from "react";
import {
    OpenOrdersObject,
    selectCompletedOrders,
    setOrderContents,
    setSideBarContent
} from "../../../store/shop-orders-slice";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import ColumnLayout from "../../../components/layouts/column-layout";
import ShowOrder from "./show-order";
import CompletedOrdersList from "./completed-orders-list";

/**
 * Completed Orders Tab
 */

export default function CompletedOrders() {

    const dispatch = useDispatch()
    const completedOrders = useSelector(selectCompletedOrders)
    const [supplier, setSupplier] = useState<string | null>(null)

    useEffect(() => {
        function transformCompletedOrdersForSideBar(completedOrders: {[key:string]:OpenOrdersObject[]}) {
            let tempObject: { [key: string]: number } = {}
            for (let supplier in completedOrders) {
                tempObject[supplier] = completedOrders[supplier].length
            }
            dispatch(setSideBarContent({content: tempObject, title: "Completed Orders"}))
        }
        transformCompletedOrdersForSideBar(completedOrders!)
    })

    function supplierHandler(supplier:string){
        setSupplier(supplier)
        dispatch(setOrderContents(null))
    }

    return (
        <>
            <SideBar supplierFilter={(x) => supplierHandler(x)}/>
            {!supplier ? null : <ColumnLayout background={false}>
                <CompletedOrdersList supplier={supplier}/>
                <ShowOrder/>
            </ColumnLayout>}
        </>
    );
}