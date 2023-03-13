import Menu from "../../components/menu/menu";
import StockForecastMenuTabs from "./tabs";
import {getShipment, Shipment} from "../../server-modules/shipping/shipping";
import {getItems, getAllSuppliers} from "../../server-modules/items/items";
import {StockForecastItem} from "../../server-modules/stock-forecast/process-data";
import {binarySearch} from "../../server-modules/core/core";
import OneColumn from "../../components/layouts/one-column";
import ColumnLayout from "../../components/layouts/column-layout";
import {NextParsedUrlQuery} from "next/dist/server/request-meta";
import styles from "./stock-forecast.module.css";
import ItemRow from "./stock-forecast-row";
import InfiniteScroll from "../../components/infinite-scroll";
import {appWrapper} from "../../store/store";
import {
    incrementThreshold, selectInitialItems, setInitialItems, setSearchItems, setSuppliers
} from "../../store/stock-forecast-slice";
import {useDispatch, useSelector} from "react-redux";

export default function StockForecastLandingPage() {

    const initialItems = useSelector(selectInitialItems)

    const dispatch = useDispatch()

    const updateItemsHandler = (items: StockForecastItem[]) => dispatch(setSearchItems(items))

    return (
        <OneColumn>
            <Menu>
                <StockForecastMenuTabs
                    searchData={initialItems}
                    updateItemsHandler={updateItemsHandler}/>
            </Menu>
            <ColumnLayout scroll={true} stickyTop={true}>
                <div className={styles.table}>
                    <InfiniteScroll incrementReducer={incrementThreshold}>
                        <ItemRow/>
                    </InfiniteScroll>
                </div>
            </ColumnLayout>
        </OneColumn>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(
    store =>
        async (context) => {
            const shipping = await getShipment({delivered: false}) as Shipment[]
            const domestic = context.query.domestic
            const show = context.query.show
            const list = context.query.list
            let selectedSuppliers = typeof context.query.suppliers  === "string"
                ? [context.query.suppliers]
                : context.query.suppliers
            console.log(selectedSuppliers)

            const baseQuery = [
                {isComposite: false},
                {stockHistory:{$not:{$size:0}}},
                {tags: domestic === 'true' ? {'$in': ["domestic"]} : {'$nin': ["domestic"]}},
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
                stock: 1,
                tags: 1,
                checkboxStatus: 1
            }

            const sort = {SKU: 1}
            const items = await getItems(itemQuery, projection, sort) as StockForecastItem[] | undefined
            console.log(items)
            const suppliers = await getAllSuppliers(supplierQuery)
            suppliers ? store.dispatch(setSuppliers(suppliers)) : store.dispatch(setSuppliers([]))

            addOnOrderToItems(shipping, items)
            store.dispatch(setInitialItems(await filterDataBasedOnToggles(items!, context.query)))

            return {props:{}}
        })

/**
 * Merges any shipment data into item data under .onOrder,
 * which contains total amount of that sku on order,
 * how much of it is late and an object with the year/month/day on which any quantities will arrive.
 * @param shipments - array of shipments
 * @param items - array of items
 */

export interface onOrder {
    late: number,
    total: number,

    [key: number]: {
        [key: number]: {
            [key: number]: number
        }
    }
}

function addOnOrderToItems(shipments: Shipment[] = [], items: StockForecastItem[] = []) {
    for (const shipment of shipments) {
        if (shipment.delivered) continue
        for (let val of shipment.data) {
            let item = binarySearch<StockForecastItem>(items, "SKU", val.sku, 0, items.length - 1)
            if (!item) continue;

            let cd = new Date();
            let date = new Date(shipment.due);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            item.onOrder ??= {late: 0, total: 0}
            if (date < cd) item.onOrder.late += parseFloat(val.qty);

            item.onOrder[year] ??= {}
            item.onOrder[year][month] ??= {}
            item.onOrder[year][month][day]
                ? item.onOrder[year][month][day] += parseFloat(val.qty)
                : item.onOrder[year][month][day] = parseFloat(val.qty);

            item.onOrder.total += parseFloat(val.qty);
        }
    }
}

/**
 * Filters item object array base on page params,
 * List returns just the items that have been added to custom list
 * Show toggles whether items with the hide flag are shown or not
 * List overrides show
 * @param items
 * @param pageQuery
 */

async function filterDataBasedOnToggles(items: StockForecastItem[], pageQuery: NextParsedUrlQuery) {
    let filter: StockForecastItem[] = []
    for (const v of items) {
        if (pageQuery.list === 'true') {
            if (v.checkboxStatus.stockForecast.list) filter.push(v)
            continue
        }

        if (pageQuery.show === 'false') {
            if (!v.checkboxStatus.stockForecast.hide) filter.push(v)
            continue
        }

        filter.push(v)
    }
    return filter
}