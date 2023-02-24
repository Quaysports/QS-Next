import React from "react";
import IncorrectStock from "./incorrect-stock"
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
import {AppStore, appWrapper} from "../../store/store";
import {getBrands, getItems} from "../../server-modules/items/items";
import SidebarLayout from "../../components/layouts/sidebar-layout";
import SalesSidebar from "./sales/sidebar";
import SalesReportTable from "./sales/table";
import {getMonthDataForYear, getShopReportYears, getYearData, YearTotals} from "../../server-modules/reports/reports";
import {
    setFirstYearAndLastYear,
    setLastYearComparison, setLastYearMonthComparison, setMonthTotals,
    setYearTotals
} from "../../store/reports/sales-slice";
import {GetServerSidePropsContext} from "next";


export default function StockReports() {

    const router = useRouter()

    return (
        <>
            {router.query.tab === "sales" ?
                <SidebarOneColumn>
                    <Menu>
                        <StockReportTabs/>
                    </Menu>
                    <SidebarLayout><SalesSidebar/></SidebarLayout>
                    <ColumnLayout scroll={true} height={50}><SalesReportTable/></ColumnLayout>
                </SidebarOneColumn> : null
            }
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

export const getServerSideProps = appWrapper.getServerSideProps(store => async (context) => {

    if (context.query.tab === "shop") await getShopData(store, context)
    if (context.query.tab === "incorrect-stock") await getIncorrectStockData(store)
    if (context.query.tab === "sales") await getSalesData(store, context)

    return {props: {}}
})

async function getShopData(store:AppStore, context: GetServerSidePropsContext){
    let data = await getBrands({tags: {$in: ["domestic"]}})
    if (data) store.dispatch(setBrands(data))

    if(!context.query.brand) return
    let brandData = await getItems(
        {"brand": context.query.brand, tags: {$in: ["domestic"]}, isComposite: false},
        {SKU: 1, title: 1, EAN: 1, stock: 1, stockTake: 1},
        {SKU: 1})
    if (brandData) store.dispatch(setBrandItems(brandData as BrandItem[]))
}

async function getIncorrectStockData(store:AppStore){
    const data = await getIncorrectStock()
    if (data) store.dispatch(setIncorrectStockInitialState(data))
}

async function getSalesData(store:AppStore, context: GetServerSidePropsContext){
    const location = context.query.location as string ?? "shop"
    if (location === "shop") {
        const years = await getShopReportYears() as { firstYear: string, lastYear: string } | null
        if (!years) return

        store.dispatch(setFirstYearAndLastYear(years))
        let i = new Date(Number(years.firstYear)).getFullYear()
        let last = new Date(Number(years.lastYear)).getFullYear()
        let yearTotals = []
        for (i; i <= last; i++) {
            let yearTotal: YearTotals = await getYearData(i) ?? {
                grandTotal: 0,
                profit: 0,
                profitWithLoss: 0
            }
            yearTotal.year = i
            yearTotals.push(yearTotal)
        }
        store.dispatch(setYearTotals(yearTotals))

        let year = context.query.year as string ?? new Date().getFullYear().toString()
        if(!year) return

        let comparison = await getLastYearComparison(years.firstYear,year)
        if(comparison) store.dispatch(setLastYearComparison(comparison))

        let monthData = await getMonthDataForYear(Number(year))
        if(monthData) store.dispatch(setMonthTotals(monthData))

        let monthComparisonData = await getMonthDataForYearComparison(years.firstYear, Number(year))
        console.log(monthComparisonData)
        if(monthComparisonData) store.dispatch(setLastYearMonthComparison(monthComparisonData))
    }
}

async function getLastYearComparison(firstYear:string, year: string){

    if(Number(year) === new Date(Number(firstYear)).getFullYear()) return null

    const currentDate = new Date()
    let to = new Date(Number(year) -1, 11, 31, 23, 59, 59)
    if(currentDate.getFullYear() === Number(year)){
        currentDate.setFullYear(currentDate.getFullYear() - 1)
        to = currentDate
    }

    const data = await getYearData(Number(year) - 1, to.getTime()) as YearTotals | null
    if(!data) return data

    data.year = Number(year) - 1
    return data
}

async function getMonthDataForYearComparison(firstYear:string, year: number) {
    if(Number(year) === new Date(Number(firstYear)).getFullYear()) return null

    const currentDate = new Date()
    let to;
    if(currentDate.getFullYear() === Number(year)){
        currentDate.setFullYear(currentDate.getFullYear() - 1)
        to = currentDate
    }

    return await getMonthDataForYear(Number(year) - 1, to?.getTime())
}