import * as React from 'react';
import SideBar from "../sidebar/sidebar";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    selectDeadStock,
    setSideBarContent, ShopOrdersState,
} from "../../../store/shop-orders-slice";
import ColumnLayout from "../../../components/layouts/column-layout";
import DeadStockList from "./dead-stock-list";

/**
 * Dead Stock Tab
 */
export default function DeadStock() {

    const deadStockList = useSelector(selectDeadStock)
    const dispatch = useDispatch()
    const [supplier, setSupplier] = useState<string | null>(null)

    useEffect(() => {
        function transformDeadStockDataForSidebar(deadStockList:ShopOrdersState["deadStock"]) {

                let tempObject:{[key:string]:number} = {}
                for (const key in deadStockList) {
                    tempObject[key] = deadStockList[key].length
                }
                dispatch(setSideBarContent({content: tempObject, title: "Dead Stock"}))
            }
        transformDeadStockDataForSidebar(deadStockList)
    }, [deadStockList])

    function supplierHandler(supplier:string){
        setSupplier(supplier)
    }
    return (
        <>
            <SideBar supplierFilter={(x) => supplierHandler(x)}/>
            {!supplier ? null :
                <ColumnLayout background={false}>
                    <DeadStockList supplier={supplier}/>
                </ColumnLayout>}
        </>
    );
}