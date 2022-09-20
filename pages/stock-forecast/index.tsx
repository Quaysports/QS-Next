import Menu from "../../components/menu/menu";
import StockForecastMenuTabs from "./tabs";
import StockForecastTable from "./stock-forecast-table";
import styles from './stock-forecast.module.css'
import {get} from "../../server-modules/shipping/shipping";
import {useEffect} from "react";
import {getItems} from "../../server-modules/items/items";

export default function stockForecastLandingPage({shipping, items}) {
    console.log(items)

    useEffect(() => {

    }, [])

    return (
        <div className={styles["fullscreen-layout"]}>
            <Menu tabs={<StockForecastMenuTabs/>}/>
            <StockForecastTable props={shipping}/>
        </div>
    )
}

export async function getServerSideProps() {
    const shipping = JSON.parse(JSON.stringify(await get({delivered: false})))
    const domestic = false

    const itemQuery = {
        $and: [
            {ISCOMPOSITE: false},
            {
                MONTHSTOCKHIST: {
                    $exists: true
                }
            },
            {IDBFILTER: domestic ? {'$eq': "domestic"} : {'$ne': "domestic"}}
        ]
    }

    const projection = {
        SKU: 1,
        SUPPLIER: 1,
        MONTHSTOCKHIST: 1,
        ROLLINGAVG: 1,
        STOCKTOTAL: 1,
        //ONORDER: 1,
        IDBFILTER: 1,
        CHECK: 1
    }

    const sort = {SKU: 1}
    const items = JSON.parse(JSON.stringify(await getItems(itemQuery, projection, sort)))

    return {
        props: {shipping, items}
    }
}