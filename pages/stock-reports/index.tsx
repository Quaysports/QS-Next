import React, {useEffect} from "react";
import IncorrectStock from "./incorrect-stock/index"
import {useDispatch} from "react-redux";
import {getIncorrectStock} from "../../server-modules/shop/shop"
import {
    setIncorrectStockInitialState,
    setZeroStockInitialState,
} from "../../store/incorrect-stock-slice";
import Menu from "../../components/menu/menu";
import {useRouter} from "next/router";
import StockReportTabs from "./tabs";
import ShopStockTake from "./shop";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";

export default function IncorrectStockLandingPage({incorrectStock, zeroStock}) {

    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        dispatch(setIncorrectStockInitialState(incorrectStock))
        dispatch(setZeroStockInitialState(zeroStock))
    }, [])

    return (
        <>
            {router.query.tab === "incorrect-stock" ?
                <div>
                    <Menu tabs={<StockReportTabs/>}/>
                    <IncorrectStock/>
                </div> : null}
            {router.query.tab === "shop" ?
                <SidebarOneColumn>
                    <Menu tabs={<StockReportTabs/>}/>
                    <ShopStockTake/>
                </SidebarOneColumn> : null}
        </>
    )
}

export async function getServerSideProps() {
    const data = JSON.parse(JSON.stringify(await getIncorrectStock()))
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

    return {props: {incorrectStock: incorrectStock, zeroStock: zeroStock}}
}