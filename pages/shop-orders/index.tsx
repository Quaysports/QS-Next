import * as React from 'react';
import {useRouter} from "next/router";
import {deadStockReport} from "../../server-modules/shop/shop";
import {setDeadStock} from "../../store/shop-orders-slice";
import Orders from "./orders";
import CompletedOrders from "./completed-orders/completed-orders";
import NewOrder from "./new-order/index";
import DeadStock from "./dead-stock/dead-stock";
import Menu from "../../components/menu/menu";
import ShopOrdersTabs from "./tabs";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";


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

export default function ShopOrdersLandingPage(props) {

    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setDeadStock(props.deadStock))
    })

    return (
        <SidebarOneColumn>
            <Menu tabs={<ShopOrdersTabs/>}/>
            {router.query.tab === undefined || router.query.tab === "orders" ? <Orders/> : null}
            {router.query.tab === "completed-orders" ? <CompletedOrders/> : null}
            {router.query.tab === "new-order" ? <NewOrder/> : null}
            {router.query.tab === "dead-stock" ? <DeadStock/> : null}
        </SidebarOneColumn>
    );
}

export async function getServerSideProps() {
    const deadStock = JSON.parse(JSON.stringify(await deadStockReport()))

    function compare( a, b ) {
        if ( a.SOLDFLAG < b.SOLDFLAG ){
            return 1;
        }
        if ( a.SOLDFLAG > b.SOLDFLAG ){
            return -1;
        }
        return 0;
    }

    deadStock.sort( compare );

    let tempObject = {}
    for (const item of deadStock) {
        tempObject[item.SUPPLIER] ? tempObject[item.SUPPLIER].push(item) : tempObject[item.SUPPLIER] = [item]
    }
    return {props: {deadStock: tempObject}}
}