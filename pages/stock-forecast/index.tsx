import Menu from "../../components/menu/menu";
import StockForecastMenuTabs from "./tabs";
import StockForecastTable from "./stock-forecast-table";
import {get, Shipment} from "../../server-modules/shipping/shipping";
import {useEffect, useState} from "react";
import {getItems} from "../../server-modules/items/items";
import {processData, StockForecastItem} from "../../server-modules/stock-forecast/process-data";
import {binarySearch} from "../../server-modules/core/core";
import OneColumn from "../../components/layouts/one-column";
import ColumnLayout from "../../components/layouts/column-layout";
import {NextPageContext} from "next";
import {NextParsedUrlQuery} from "next/dist/server/request-meta";

interface Props {
    filteredItems:StockForecastItemProjection[]
}

export default function StockForecastLandingPage({filteredItems}:Props) {
    console.log(filteredItems)

    const[items, setItems] = useState<StockForecastItem[] | null>(null)

    const updateItemsHandler = (items:StockForecastItem[])=> setItems(items)

    useEffect(() => {
        let processedItems:StockForecastItem[] = []
        for(let item of filteredItems) processedItems.push(processData(item))
        setItems(processedItems)
    }, [filteredItems])

    return (
        <OneColumn>
            <Menu><StockForecastMenuTabs searchData={items} updateItemsHandler={updateItemsHandler}/></Menu>
            <ColumnLayout scroll={true}>
                <StockForecastTable items={items}/>
            </ColumnLayout>
        </OneColumn>
    )
}

export interface StockForecastItemProjection {
    SKU:string;
    SUPPLIER:string;
    TITLE:string;
    MONTHSTOCKHIST:sbt.MonthStockHistory;
    ROLLINGAVG:string;
    STOCKTOTAL:number;
    IDBFILTER:string;
    CHECK:sbt.Item["CHECK"]
    onOrder?:onOrder
}

export async function getServerSideProps(context:NextPageContext) {
    const shipping = await get({delivered: false})
    const domestic = context.query.domestic

    const itemQuery = {
        $and: [
            {ISCOMPOSITE: false},
            {
                MONTHSTOCKHIST: {
                    $exists: true
                }
            },
            {IDBFILTER: domestic === 'true' ? {'$eq': "domestic"} : {'$ne': "domestic"}}
        ]
    }

    const projection = {
        SKU: 1,
        SUPPLIER: 1,
        TITLE:1,
        MONTHSTOCKHIST: 1,
        ROLLINGAVG: 1,
        STOCKTOTAL: 1,
        IDBFILTER: 1,
        CHECK: 1
    }

    const sort = {SKU: 1}
    const items = await getItems(itemQuery, projection, sort) as StockForecastItemProjection[] | undefined

    addOnOrderToItems(shipping!, items!)
    const filteredItems = filterDataBasedOnToggles(items!, context.query)

    return {
        props: {filteredItems:filteredItems}
    }
}

/**
 * Merges any shipment data into item data under .onOrder,
 * which contains total amount of that sku on order,
 * how much of it is late and an object with the year/month/day on which any quantities will arrive.
 * @param shipments - array of shipments
 * @param items - array of items
 */

export interface onOrder {
    late:number,
    total:number,
    [key:number]:{
        [key:number]:{
            [key:number]:number
        }
    }
}
function addOnOrderToItems(shipments:Shipment[], items:StockForecastItemProjection[]) {
    for (const shipment of shipments) {
        if(shipment.delivered) continue
        for (let val of shipment.data) {
            let item = binarySearch<StockForecastItemProjection>(items, "SKU", val.sku, 0, items.length - 1)
            if (!item) continue;

            let cd = new Date();
            let date = new Date(shipment.due);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            item.onOrder ??= {late:0,total:0}
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
function filterDataBasedOnToggles(items:StockForecastItemProjection[], pageQuery:NextParsedUrlQuery) {
    let filter:StockForecastItemProjection[] = []
    for (const v of items) {
        if (pageQuery.list === 'true') {
            if(v.CHECK?.SF?.LIST) filter.push(v)
            continue
        }

        if (pageQuery.show === 'false') {
            if (!v.CHECK?.SF?.HIDE) filter.push(v)
            continue
        }

        filter.push(v)
    }
    return filter
}