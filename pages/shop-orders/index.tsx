import * as React from 'react';
import {useRouter} from "next/router";
import {DeadStockReport, deadStockReport} from "../../server-modules/shop/shop";
import {OpenOrdersObject, setCompletedOrders, setDeadStock} from "../../store/shop-orders-slice";
import Orders from "./orders";
import CompletedOrders from "./completed-orders/index";
import NewOrder from "./new-order/index";
import DeadStock from "./dead-stock/index";
import Menu from "../../components/menu/menu";
import ShopOrdersTabs from "./tabs";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import {getCompleteOrders, shopOrder} from "../../server-modules/shop/shop-order-tool";
import {appWrapper} from "../../store/store";

/**
 * Shop Orders Landing Page
 */

export default function ShopOrdersLandingPage() {
    const router = useRouter()

    return (
        <SidebarOneColumn>
            <Menu><ShopOrdersTabs/></Menu>
            {router.query.tab === undefined || router.query.tab === "orders" ? <Orders/> : null}
            {router.query.tab === "completed-orders" ? <CompletedOrders/> : null}
            {router.query.tab === "new-order" ? <NewOrder/> : null}
            {router.query.tab === "dead-stock" ? <DeadStock/> : null}
        </SidebarOneColumn>
    );
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async (context) => {

    if (context.query.tab === "dead-stock") {
        const deadStock = await deadStockReport()

        function compare(a: DeadStockReport, b: DeadStockReport) {
            if (a.SOLDFLAG < b.SOLDFLAG) {
                return 1;
            }
            if (a.SOLDFLAG > b.SOLDFLAG) {
                return -1;
            }
            return 0;
        }

        deadStock.sort(compare);

        let tempObject: { [key: string]: DeadStockReport[] } = {}
        for (const item of deadStock) {
            tempObject[item.SUPPLIER] ? tempObject[item.SUPPLIER].push(item) : tempObject[item.SUPPLIER] = [item]
        }
        store.dispatch(setDeadStock(tempObject))
    }

    if (context.query.tab === "completed-orders") {
        const today = new Date()
        const lastYear = new Date()
        lastYear.setFullYear(today.getFullYear() - 1)

        const start = {date: {$gt: lastYear.getTime()}}
        const end = {date: {$lt: today.getTime()}}

        let res = await getCompleteOrders(start, end)

        let sortedData = res!.sort((a, b) => {
            return a.supplier === b.supplier ? 0 : a.supplier > b.supplier ? 1 : -1
        })
        let tempObject: { [key: string]: shopOrder[] } = {}
        for (let i = 0; i < sortedData!.length; i++) {
            tempObject[sortedData![i].supplier] ?
                tempObject[sortedData![i].supplier].push(sortedData![i]) :
                tempObject[sortedData![i].supplier] = [sortedData![i]]
        }
        await store.dispatch(setCompletedOrders(tempObject as { [key: string]: OpenOrdersObject[] }))
    }

    return {props: {}}
})