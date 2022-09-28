import Menu from "../../components/menu/menu";
import StockForecastMenuTabs from "./tabs";
import StockForecastTable from "./stock-forecast-table";
import {get} from "../../server-modules/shipping/shipping";
import {useEffect, useState} from "react";
import {getItems} from "../../server-modules/items/items";
import {processData} from "../../server-modules/stock-forecast/process-data";
import {binarySearch} from "../../server-modules/core/core";

export default function stockForecastLandingPage({filteredItems}) {

    const[items, setItems] = useState(filteredItems)

    const updateItemsHandler = (items)=> setItems(items)

    useEffect(() => {
        let processedItems = []
        for(let item of filteredItems) processedItems.push(processData(item))
        setItems(processedItems)
    }, [filteredItems])

    return (
        <div className={"fullscreen-layout"}>
            <Menu tabs={<StockForecastMenuTabs searchData={filteredItems} updateItemsHandler={updateItemsHandler}/>}/>
            <StockForecastTable items={items}/>
        </div>
    )
}



export async function getServerSideProps(context) {
    const shipping = JSON.parse(JSON.stringify(await get({delivered: false})))
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
        MONTHSTOCKHIST: 1,
        ROLLINGAVG: 1,
        STOCKTOTAL: 1,
        IDBFILTER: 1,
        CHECK: 1
    }

    const sort = {SKU: 1}
    const items = JSON.parse(JSON.stringify(await getItems(itemQuery, projection, sort)))

    addOnOrderToItems(shipping, items)
    const filteredItems = filterDataBasedOnToggles(items, context.query)

    return {
        props: {filteredItems}
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
function addOnOrderToItems(shipments, items) {
    for (const shipment of shipments) {
        if(shipment.delivered) continue
        for (let val of shipment.data) {
            let item = binarySearch(items, "SKU", val.sku, 0, items.length - 1)
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
function filterDataBasedOnToggles(items, pageQuery) {
    let filter = []
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