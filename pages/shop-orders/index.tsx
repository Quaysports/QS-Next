import * as React from 'react';
import {useRouter} from "next/router";
import {DeadStockReport, deadStockReport} from "../../server-modules/shop/shop";
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
import {InferGetServerSidePropsType} from "next";

/**
 * Shop Orders Landing Page
 */

export default function ShopOrdersLandingPage(props:InferGetServerSidePropsType<typeof getServerSideProps>) {

    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setDeadStock(props.deadStock))
    })

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

export async function getServerSideProps() {
    const deadStock = await deadStockReport()

    function compare( a:DeadStockReport, b:DeadStockReport ) {
        if ( a.SOLDFLAG < b.SOLDFLAG ){
            return 1;
        }
        if ( a.SOLDFLAG > b.SOLDFLAG ){
            return -1;
        }
        return 0;
    }

    deadStock.sort( compare );

    let tempObject:{[key:string]: DeadStockReport[]} = {}
    for (const item of deadStock) {
        tempObject[item.SUPPLIER] ? tempObject[item.SUPPLIER].push(item) : tempObject[item.SUPPLIER] = [item]
    }
    return {props: {deadStock: tempObject}}
}