import React from "react";
import IncorrectStock from "./incorrect-stock/index"
import {getIncorrectStock} from "../../server-modules/shop/shop"
import {
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
import {getBrands} from "../../server-modules/items/items";

export default function IncorrectStockLandingPage({brands}) {

    const router = useRouter()

    return (
        <>
            {router.query.tab === "incorrect-stock" ?
                <OneColumn>
                    <Menu tabs={<StockReportTabs/>}/>
                    <ColumnLayout scroll={true} maxWidth={"fit-content"}>
                        <IncorrectStock/>
                    </ColumnLayout>
                </OneColumn> : null}
            {router.query.tab === "shop" ?
                <SidebarOneColumn>
                    <Menu tabs={<StockReportTabs/>}/>
                    <ShopStockTake brands={brands}/>
                </SidebarOneColumn> : null}
        </>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async()=>{
    const data = JSON.parse(JSON.stringify(await getIncorrectStock()))
    const brands = await getBrands()

    let incorrectStock = {}
    let zeroStock = {}
    for (let i = 0; i < data.length; i++) {
        if (data[i].PRIORITY) {
            incorrectStock[data[i].BRAND] ??= []
            incorrectStock[data[i].BRAND].push(data[i])
        } else {
            zeroStock[data[i].BRAND] ??= []
            zeroStock[data[i].BRAND].push(data[i])
        }
    }
    store.dispatch(setIncorrectStockInitialState(incorrectStock))
    store.dispatch(setZeroStockInitialState(zeroStock))
    return {props:{brands:brands}}
})