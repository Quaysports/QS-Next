import styles from './stock-forecast.module.css'
import {dispatchNotification} from "../../components/notification/dispatch-notification";
import {StockForecastItem} from "./index";

interface Props {
    item: StockForecastItem
}

export default function StockTotalCell({item}: Props) {

    if (!item) return null

    function createContent(item: StockForecastItem) {
        let currentMonth = new Date().getMonth()
        let perDayAverage = 0
        let lastFourMonthsAverage = 0
        let lastOneMonthAverage = 0
        let {historicConsumption, historicOutOfStock, oneMonthOutOfStock, fourMonthOutOfStock} = item.stockConsumption

        function toLocalDate(ms: number) {
            return new Date(ms).toLocaleDateString("en-GB")
        }

        if (historicConsumption.length > 0) {
            perDayAverage = historicConsumption.reduce((acc, val) => acc + val, 0) / historicConsumption.length
        }

        if (fourMonthOutOfStock > 0) {
            let months
            if (currentMonth >= 3) {
                months = historicConsumption.slice(currentMonth - 4, currentMonth)
            } else {
                months = [...historicConsumption.slice(0, currentMonth+1), ...historicConsumption.slice(-(3 - currentMonth))]
            }
            lastFourMonthsAverage = months.reduce((acc, val) => acc + val, 0) / months.length
        }

        if (oneMonthOutOfStock > 0) {
            let index = currentMonth - 1 > 0 ? currentMonth - 1 : 11
            lastOneMonthAverage = historicConsumption[index]
        }

        return <>
            <div>Last Year: {Math.round(perDayAverage)}</div>
            {historicOutOfStock > 0 ?
                <div>Out of Stock Est: <strong>{toLocalDate(historicOutOfStock)}</strong></div> : null}
            <div>----------------</div>
            <div>Past 4 Months: {Math.round(lastFourMonthsAverage)}</div>
            {fourMonthOutOfStock > 0 ?
                <div>Out of Stock Est: <strong>{toLocalDate(fourMonthOutOfStock)}</strong></div> : null}
            <div>----------------</div>
            <div>Past One Months:{Math.round(lastOneMonthAverage)}</div>
            {oneMonthOutOfStock > 0 ?
                <div>Out of Stock Est: <strong>{toLocalDate(oneMonthOutOfStock)}</strong></div> : null}
        </>
    }

    return <div
        className={styles["details-cell"]}
        onMouseOver={(e) => {
            dispatchNotification({
                type: "tooltip",
                e: e,
                title: "Stock consumption (per-day)",
                content: createContent(item)
            })
        }}
        onMouseLeave={() => dispatchNotification()}
    >{item.stock.total}</div>
}