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
import {
    getShopMonthDayByDayDataForYear,
    getReportYears,
    ShopYearTotals,
    OnlineYearTotals,
    getShopYearData,
    getOnlineYearData,
    getShopMonthDataForYear,
    getOnlineMonthDataForYear, getOnlineMonthDayByDayDataForYear,
} from "../../server-modules/reports/reports";
import {
    setFirstYearAndLastYear, setOnlineDayTotals,
    setOnlineLastYearComparison, setOnlineLastYearMonthComparison, setOnlineMonthTotals,
    setOnlineYearTotals, setShopDayTotals,
    setShopLastYearComparison, setShopLastYearMonthComparison, setShopMonthTotals,
    setShopYearTotals,
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
                    <SidebarLayout>
                        <SalesSidebar/>
                    </SidebarLayout>
                    <ColumnLayout scroll={true} height={50}>
                        <SalesReportTable/>
                    </ColumnLayout>
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

async function getShopData(store: AppStore, context: GetServerSidePropsContext) {
    let data = await getBrands({tags: {$in: ["domestic"]}})
    if (data) store.dispatch(setBrands(data))

    if (!context.query.brand) return
    let brandData = await getItems(
        {"brand": context.query.brand, tags: {$in: ["domestic"]}, isComposite: false,  "stock.minimum":{$gt:0}},
        {SKU: 1, title: 1, EAN: 1, stock: 1, stockTake: 1},
        {SKU: 1})
    if (brandData) store.dispatch(setBrandItems(brandData as BrandItem[]))
}

async function getIncorrectStockData(store: AppStore) {
    const data = await getIncorrectStock()
    if (data) store.dispatch(setIncorrectStockInitialState(data))
}

async function getSalesData(store: AppStore, context: GetServerSidePropsContext) {

    const location = context?.query?.location ? context.query.location as "shop" | "online" : "shop"

    const years = await getReportYears(location)
    if (!years) return
    store.dispatch(setFirstYearAndLastYear(years))

    let year = context.query.year as string ?? new Date().getFullYear().toString()
    if (!year) return

    let i = new Date(Number(years.firstYear)).getFullYear()
    let last = new Date(Number(years.lastYear)).getFullYear()

    if (location === "shop") {
        let yearTotals: ShopYearTotals [] = []
        for (i; i <= last; i++) {
            let yearTotal: ShopYearTotals | OnlineYearTotals | undefined = undefined
            yearTotal = await getShopYearData(i) as ShopYearTotals ?? {
                grandTotal: 0,
                profit: 0,
                profitWithLoss: 0
            }
            yearTotal.year = i
            if (yearTotal) yearTotals.push(yearTotal)
        }
        store.dispatch(setShopYearTotals(yearTotals))

        if (Number(year) !== new Date(Number(years.firstYear)).getFullYear()) {
            let comparison = await getShopLastYearComparison(year)
            if (comparison) store.dispatch(setShopLastYearComparison(comparison))
        }

        let monthData = await getShopMonthDataForYear(Number(year))
        if (monthData) store.dispatch(setShopMonthTotals(monthData))

        if (Number(year) !== new Date(Number(years.firstYear)).getFullYear()) {
            let monthComparisonData = await getShopMonthDataForYearComparison(location, years.firstYear, Number(year))
            if (monthComparisonData) store.dispatch(setShopLastYearMonthComparison(monthComparisonData))
        }

        if (!context.query.month) return
        let dayByDayData = await getShopMonthDayByDayDataForYear(Number(year), Number(context.query.month as string))
        if (dayByDayData) store.dispatch(setShopDayTotals(dayByDayData))
    }

    if (location === "online") {
        let yearTotals: OnlineYearTotals[] = []
        for (i; i <= last; i++) {
            let yearTotal: ShopYearTotals | OnlineYearTotals | undefined = undefined
            yearTotal = await getOnlineYearData(i) as OnlineYearTotals ?? [{
                year: i,
                grandTotal: 0,
                profit: 0,
            }]
            if (yearTotal) yearTotals.push(yearTotal)
        }
        store.dispatch(setOnlineYearTotals(yearTotals))

        if (Number(year) !== new Date(Number(years.firstYear)).getFullYear()){
            let comparison = await getOnlineLastYearComparison(year)
            if (comparison) store.dispatch(setOnlineLastYearComparison(comparison))
        }

        let monthData = await getOnlineMonthDataForYear(Number(year))
        if (monthData) store.dispatch(setOnlineMonthTotals(monthData))

        if (Number(year) !== new Date(Number(years.firstYear)).getFullYear()) {
            let monthComparisonData = await getOnlineMonthDataForYearComparison(location, years.firstYear, Number(year))
            if (monthComparisonData) store.dispatch(setOnlineLastYearMonthComparison(monthComparisonData))
        }

        if (!context.query.month) return
        let dayByDayData = await getOnlineMonthDayByDayDataForYear(Number(year), Number(context.query.month as string))
        if (dayByDayData) store.dispatch(setOnlineDayTotals(dayByDayData))
    }

    return
}

async function getShopLastYearComparison(year: string) {

    const currentDate = new Date()
    let to = new Date(Number(year) - 1, 11, 31, 23, 59, 59)
    if (currentDate.getFullYear() === Number(year)) {
        currentDate.setFullYear(currentDate.getFullYear() - 1)
        to = currentDate
    }

    let data = await getShopYearData(Number(year) - 1, to.getTime()) as ShopYearTotals | null
    if (!data) return data

    data.year = Number(year) - 1
    return data
}

async function getOnlineLastYearComparison(year: string) {

    const currentDate = new Date()
    let to = new Date(Number(year) - 1, 11, 31, 23, 59, 59)
    if (currentDate.getFullYear() === Number(year)) {
        currentDate.setFullYear(currentDate.getFullYear() - 1)
        to = currentDate
    }

    let data = await getOnlineYearData(Number(year) - 1, to.getTime()) as OnlineYearTotals | null
    if (!data) return data

    return data
}

async function getShopMonthDataForYearComparison(location: "shop" | "online", firstYear: string, year: number) {

    const currentDate = new Date()
    let to;
    if (currentDate.getFullYear() === Number(year)) {
        currentDate.setFullYear(currentDate.getFullYear() - 1)
        to = currentDate
    }

    return await getShopMonthDataForYear(Number(year) - 1, to?.getTime())
}

async function getOnlineMonthDataForYearComparison(location: "shop" | "online", firstYear: string, year: number) {

    const currentDate = new Date()
    let to;
    if (currentDate.getFullYear() === Number(year)) {
        currentDate.setFullYear(currentDate.getFullYear() - 1)
        to = currentDate
    }

    return await getOnlineMonthDataForYear(Number(year) - 1, to?.getTime())
}