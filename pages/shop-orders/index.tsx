import * as React from 'react';
import {appWrapper} from "../../store/store";
import {useRouter} from "next/router";
import {deadStockReport} from "../../server-modules/shop/shop";
import {setDeadStock} from "../../store/shop-orders-slice";
import Orders from "./orders";
import CompletedOrders from "./completed-orders/completed-orders";
import NewOrder from "./new-order/index";
import DeadStock from "./dead-stock/dead-stock";
import Menu from "../../components/menu/menu";
import ShopOrdersTabs from "./tabs";


export interface item {
    IDBEP: { BRAND: string },
    MINSTOCK: number,
    SKU: string,
    STOCKTOTAL: number,
    SUPPLIER: string,
    TITLE: string,
    PURCHASEPRICE: number,
    _id: string
    qty: number
    deadStock: boolean
    tradePack: number
    lowStock?: boolean
    newProduct: boolean
}

export default function ShopOrdersLandingPage() {

    const router = useRouter()

    return (
        <div>
            <Menu tabs={<ShopOrdersTabs/>}/>
            {router.query.tab === undefined || router.query.tab === "orders" ? <Orders/> : null}
            {router.query.tab === "completed-orders" ? <CompletedOrders/> : null}
            {router.query.tab === "new-order" ? <NewOrder/> : null}
            {router.query.tab === "dead-stock" ? <DeadStock/> : null}
        </div>
    );
}

export const getServerSideProps = appWrapper.getServerSideProps(
    (store) =>
        async () => {
            const deadStock = JSON.parse(JSON.stringify(await deadStockReport()))
            let sortedArray = deadStock.sort((a, b) => {
                return a.SUPPLIER === b.SUPPLIER ? 0 : a.SUPPLIER > b.SUPPLIER ? 1 : -1
            })
            let tempObject = {}
            for (const item of sortedArray) {
                tempObject[item.SUPPLIER] ? tempObject[item.SUPPLIER].push(item) : tempObject[item.SUPPLIER] = [item]
            }
            await store.dispatch(setDeadStock(tempObject))
            return void {}
        }
)