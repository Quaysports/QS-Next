import * as React from 'react';
import {useRouter} from "next/router";
import {DeadStockReport, deadStockReport} from "../../server-modules/shop/shop";
import {
    setCompletedOrders,
    setDeadStock, setNewOrderArray, setOnOrderSKUs,
    setOpenOrders,
    setSideBarContent, setSupplierItems
} from "../../store/shop-orders-slice";
import Orders from "./orders";
import CompletedOrders from "./completed-orders/index";
import NewOrder from "./new-order/index";
import DeadStock from "./dead-stock/index";
import Menu from "../../components/menu/menu";
import ShopOrdersTabs from "./tabs";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import {
    getCompleteOrders,
    getOpenOrders, getSupplierItems,
    getSuppliersAndLowStock, orderObject,
    shopOrder,

} from "../../server-modules/shop/shop-order-tool";
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

    const deadStock:DeadStockReport[] = await deadStockReport()
    store.dispatch(setDeadStock(deadStock))
    const orders = await getOpenOrders()

    if (context.query.tab === "new-order") {

        let lowStock = await getSuppliersAndLowStock()
        store.dispatch(setOnOrderSKUs(orders))

        let tempArray = lowStock.map(item => ({[item.supplier]: item.lowStockCount}))
        store.dispatch(setSideBarContent({content: tempArray, title: "Suppliers"}))

        let supplier = ""

        if (context.query.editOrder) {
            store.dispatch(setNewOrderArray(orders[Number(context.query.editOrder)]))
            let tempArray = [{[orders[Number(context.query.editOrder)].supplier]: "Order Edit"}]
            store.dispatch(setSideBarContent({content: tempArray, title: "Suppliers"}))
            supplier = orders[Number(context.query.editOrder)].supplier
        }
        if (context.query.index) {
            supplier = lowStock[Number(context.query.index)].supplier
        }
        if(context.query.index || context.query.editOrder){

            const supplierItems = await getSupplierItems(supplier) as unknown as orderObject[]
            let itemsTempObject: { [key: string]: orderObject[] } = {}
            itemsTempObject[supplier] = []
            for (let i = 0; i < supplierItems.length; i++) {
                supplierItems[i].supplier = supplier
                supplierItems[i].bookedIn = "false"
                supplierItems[i].newProduct = false
                supplierItems[i].lowStock = false
                supplierItems[i].arrived = 0
                supplierItems[i].tradePack = 1
                supplierItems[i].qty = 1
                supplierItems[i].submitted = false
                supplierItems[i].onOrder = false
                if (Number(supplierItems[i].stock.total) < supplierItems[i].stock.minimum) supplierItems[i].lowStock = true;
                let item = deadStock.find((element) => element.SKU === supplierItems[i].SKU)
                if (item) {
                    supplierItems[i].deadStock = true
                    supplierItems[i].soldFlag = item.SOLDFLAG
                } else {
                    supplierItems[i].deadStock = false
                    supplierItems[i].soldFlag = 0
                }
                itemsTempObject[supplier].push(supplierItems[i]);
            }
            store.dispatch(setSupplierItems(itemsTempObject[supplier]))
        }
    }

    if (context.query.tab === "completed-orders") {
        const today = new Date()
        const lastYear = new Date()
        lastYear.setFullYear(today.getFullYear() - 1)

        const start = {date: {$gt: lastYear.getTime()}}
        const end = {date: {$lt: today.getTime()}}

        let completedOrders = await getCompleteOrders(start, end)

        let ordersMap: Map<string, shopOrder[]> = new Map()
        completedOrders.forEach((item) => {
            ordersMap.has(item.supplier) ? ordersMap.get(item.supplier)!.push(item!) : ordersMap.set(item.supplier, [item])
        } )
        let tempArray: {[key:string]:shopOrder[]}[]= []
        let sideBarArray: { [key: string]: number }[] = []
        ordersMap.forEach((item, key) => {
            tempArray.push({[key]:item})
            sideBarArray.push({[key]: item.length})
        })
        store.dispatch(setCompletedOrders(tempArray))
        store.dispatch(setSideBarContent({content: sideBarArray, title: "Suppliers"}))

    }

    if (context.query.tab === "orders") {
        console.log("orders!")
        store.dispatch(setOpenOrders(orders))
        let tempArray = orders.map((item,index) => ({[(index + 1).toString() + " - " + item.supplier]: item.id}))
        store.dispatch(setSideBarContent({content: tempArray, title: "Orders"}))
    }
    return {props: {}}
})