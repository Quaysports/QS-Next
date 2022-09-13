import * as React from 'react';
import {useEffect} from "react";
import {appWrapper} from "../../store/store";
import {useRouter} from "next/router";
import {deadStockReport} from "../../server-modules/shop/shop";
import {useDispatch} from "react-redux";
import {setMenuOptions} from "../../store/menu-slice";
import {setDeadStock} from "../../store/shop-orders-slice";

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
        dispatch(setMenuOptions(props.menuOptions))
        dispatch(setDeadStock(props.deadStockList))
        router.push("/shop-orders/orders")
    }, [])

    return null;
}

//Builds an object to set the top menu. Key is the UI display, value folder location
function buildMenu() {
    return (
        {
            "Orders": "/dashboard/orders",
            "Completed Orders": "/dashboard/completed-orders",
            "New Order": "/dashboard/new-order",
            "Dead Stock": "/dashboard/dead-stock",
        }
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(
    (store) =>
        async (context) => {
            const deadStock = JSON.parse(JSON.stringify(await deadStockReport()))
            let sortedArray = deadStock.sort((a, b) => {
                return a.SUPPLIER === b.SUPPLIER ? 0 : a.SUPPLIER > b.SUPPLIER ? 1 : -1
            })
            let tempObject = {}
            for (const item of sortedArray) {
                tempObject[item.SUPPLIER] ? tempObject[item.SUPPLIER].push(item) : tempObject[item.SUPPLIER] = [item]
            }
            const menuObject = buildMenu()
            return {
                props: {menuOptions: menuObject, deadStockList: tempObject}
            }
        }
)