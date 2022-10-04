import React from "react";
import IncorrectStock from "./incorrect-stock/index"
import {getIncorrectStock, StockError} from "../../server-modules/shop/shop"
import {
    BrandItem,
    setBrandItems,
    setBrands,
    setIncorrectStockInitialState,
    setZeroStockInitialState,
} from "../../store/stock-reports-slice";
import Menu from "../../components/menu/menu";
import {useRouter} from "next/router";
import StockReportTabs from "./tabs";
import ShopStockTake from "./shop";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import OneColumn from "../../components/layouts/one-column";
import ColumnLayout from "../../components/layouts/column-layout";
import {appWrapper} from "../../store/store";
import {getBrands, getItems} from "../../server-modules/items/items";

export default function IncorrectStockLandingPage() {

    const router = useRouter()

    return (
        <>
            {router.query.tab === "incorrect-stock" ?
                <OneColumn>
                    <Menu>
                        <StockReportTabs/>
                    </Menu>
                    <ColumnLayout scroll={true} maxWidth={"fit-content"}>
                        <IncorrectStock/>
                    </ColumnLayout>
                </OneColumn> : null}
            {router.query.tab === "shop" ?
                <SidebarOneColumn>
                    <Menu>
                        <StockReportTabs/>
                    </Menu>
                    <ShopStockTake/>
                </SidebarOneColumn> : null}
        </>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async(context)=>{

    if(context.query.tab === "shop") {
        let data = await getBrands({IDBFILTER: "domestic"})
        if(data) store.dispatch(setBrands(data))
    }

    if(context.query.brand) {
        let data =  await getItems(
            {"IDBEP.BRAND": context.query.brand, IDBFILTER: "domestic", ISCOMPOSITE: false},
            {SKU: 1, TITLE: 1, EAN: 1, STOCKTOTAL: 1, stockTake: 1})
        if(data) store.dispatch(setBrandItems(data as BrandItem[]))
    }

    if(context.query.tab === "incorrect-stock") {
        const data = await getIncorrectStock()
        if(data) {
            let incorrectStock:{[key:string]:StockError[]} = {}
            let zeroStock:{[key:string]:StockError[]} = {}
            for (let i = 0; i < data.length; i++) {
                if(!data[i].BRAND) continue;
                if (data[i].PRIORITY) {
                    incorrectStock[data[i].BRAND!] ??= []
                    incorrectStock[data[i].BRAND!]!.push(data[i])
                } else {
                    zeroStock[data[i].BRAND!] ??= []
                    zeroStock[data[i].BRAND!]!.push(data[i])
                }
            }
            store.dispatch(setIncorrectStockInitialState(incorrectStock))
            store.dispatch(setZeroStockInitialState(zeroStock))
        }
    }

    return {props:{}}
})