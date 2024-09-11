import Menu from "../../components/menu/menu";
import StockForecastMenuTabs from "./tabs";
import {getItems, getAllSuppliers} from "../../server-modules/items/items";
import OneColumn from "../../components/layouts/one-column";
import ColumnLayout from "../../components/layouts/column-layout";
import styles from "./stock-forecast.module.css";
import InfiniteScroll from "../../components/infinite-scroll";
import {appWrapper} from "../../store/store";
import {
    incrementThreshold, setItems, setSuppliers
} from "../../store/stock-forecast-slice";
import {schema} from "../../types";
import StockForecastTable from "./stock-forecast-row";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {dispatchNotification} from "../../components/notification/dispatch-notification";

export default function StockForecastLandingPage() {

    const router = useRouter()
    useEffect(() =>dispatchNotification(),[router.query])

    return (
        <OneColumn>
            <Menu>
                <StockForecastMenuTabs/>
            </Menu>
            <ColumnLayout scroll={true} stickyTop={true} height={30} background={false}>
                <div className={styles.table}>
                    <InfiniteScroll incrementReducer={incrementThreshold}>
                        <StockForecastTable/>
                    </InfiniteScroll>
                </div>
            </ColumnLayout>
        </OneColumn>
    )
}

export type StockForecastItem = Pick<schema.Item,
    "SKU"
    | "supplier"
    | "title"
    | "stockHistory"
    | "stockConsumption"
    | "stock"
    | "tags"
    | "checkboxStatus"
    | "onOrder"
>

export const getServerSideProps = appWrapper.getServerSideProps(
    store =>
        async (context) => {
            const domestic = context.query.domestic === 'true'
            const show = context.query.show  === "true"
            const list = context.query.list === "true"
            let selectedSuppliers = typeof context.query.suppliers  === "string"
                ? [context.query.suppliers]
                : context.query.suppliers
            console.log(selectedSuppliers)

            const baseQuery = [
                {isComposite: false},
                {stockHistory:{$not:{$size:0}}},
                {tags: domestic ? {'$in': ["domestic"]} : {'$nin': ["domestic"]}},
                !show ? {"checkboxStatus.stockForecast.hide": {'$ne': true}} : {},
                list ? {"checkboxStatus.stockForecast.list": {'$eq': true}} : {},
            ]

            const itemQuery = {$and: [...baseQuery, selectedSuppliers ? {suppliers:{'$in':selectedSuppliers}} : {}]}
            const supplierQuery = {$and: baseQuery}

            const projection = {
                SKU: 1,
                supplier: 1,
                title: 1,
                stockHistory: 1,
                stockConsumption: 1,
                stock: 1,
                tags: 1,
                checkboxStatus: 1,
                onOrder:1
            }

            const sort = {SKU: 1}
            const items = await getItems<StockForecastItem>(itemQuery, projection, sort)

            const suppliers = await getAllSuppliers(supplierQuery)
            suppliers ? store.dispatch(setSuppliers(suppliers)) : store.dispatch(setSuppliers([]))

            if(items){
                store.dispatch(setItems(items))
            }

            return {props:{}}
        })