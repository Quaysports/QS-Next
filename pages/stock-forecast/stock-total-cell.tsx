import styles from './stock-forecast.module.css'
import {dispatchNotification} from "../../components/notification/dispatch-notification";
import {StockForecastItem} from "./index";

interface Props {
    item: StockForecastItem
}

export default function StockTotalCell({item}: Props) {

    if (!item) return null

    function createContent(item: StockForecastItem) {
        const currentMonth = new Date().getMonth()

        const {historicConsumption, historicOutOfStock, oneMonthOutOfStock, fourMonthOutOfStock} = item.stockConsumption

        function toLocalDate(ms: number) {
            return new Date(ms).toLocaleDateString("en-GB")
        }

        return <>
            {historicOutOfStock > 0 ?
                <div>Historic: <strong>{toLocalDate(historicOutOfStock)}</strong></div> : null}
            {fourMonthOutOfStock > 0 ?
                <div>Four Month: <strong>{toLocalDate(fourMonthOutOfStock)}</strong></div> : null}
            {oneMonthOutOfStock > 0 ?
                <div>One Month: <strong>{toLocalDate(oneMonthOutOfStock)}</strong></div> : null}
        </>
    }

    return <div
        className={styles["details-cell"]}
        onMouseOver={(e) => {
            dispatchNotification({
                type: "tooltip",
                e: e,
                title: "Out of Stock Estimates",
                content: createContent(item)
            })
        }}
        onMouseLeave={() => dispatchNotification()}
    >{item.stock.total}</div>
}

function consumptionTable(historicConsumption: number[]){

    let elements = [<div key={"title"}><div>Month</div><div>Consumption</div></div>]
    for(let i = 0; i < historicConsumption.length; i++){
        elements.push(<div key={i}><div>{i+1}</div><div>{historicConsumption[i]}</div></div>)
    }

}