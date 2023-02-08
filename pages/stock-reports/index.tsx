import React from "react";
import IncorrectStock from "./incorrect-stock/index"
import {getIncorrectStock} from "../../server-modules/shop/shop"
import {
    BrandItem,
    setBrandItems,
    setBrands,
    setIncorrectStockInitialState
} from "../../store/reports/stock-reports-slice";
import Menu from "../../components/menu/menu";
import {useRouter} from "next/router";
import StockReportTabs from "./tabs";
import ShopStockTake from "./shop";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import OneColumn from "../../components/layouts/one-column";
import ColumnLayout from "../../components/layouts/column-layout";
import {appWrapper} from "../../store/store";
import {getBrands, getItems} from "../../server-modules/items/items";

export default function StockReports() {

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
        let data = await getBrands({tags: {$in : ["domestic"]}})
        if(data) store.dispatch(setBrands(data))
    }

    if(context.query.brand) {
        let data =  await getItems(
            {"brand": context.query.brand, tags: {$in : ["domestic"]}, isComposite: false},
            {SKU: 1, title: 1, EAN: 1, stock: 1, stockTake: 1})
        if(data) store.dispatch(setBrandItems(data as BrandItem[]))
    }

    if(context.query.tab === "incorrect-stock") {
        const data = await getIncorrectStock()
        if(data) {
            store.dispatch(setIncorrectStockInitialState(data))
        }
    }

    return {props:{}}
})