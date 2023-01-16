import styles from './stock-forecast.module.css'
import {StockForecastItem} from "../../server-modules/stock-forecast/process-data";
import {dispatchNotification} from "../../components/notification/dispatch-notification";

interface Props {
    item: StockForecastItem
}

export default function StockTotalCell({item}: Props) {

    if(!item) return null

    function createContent(item: StockForecastItem) {
        let hist = 0
        if (item.hist) {
            if (item.hist.perDay) hist = item.hist.perDay
        }
        return <>
            <div>Last Year: {hist > 0 ? hist.toFixed(2) : 0}</div>
            {item.stockOOS === '' ? null : <div>Out of Stock Est: <strong>{item.stockOOS}</strong></div>}
            <div>----------------</div>
            <div>Past 4 Months: {item.fourMonth! > 0 ? item.fourMonth!.toFixed(2) : 0}</div>
            {item.fourMonthOOS === '' ? null : <div>Out of Stock Est: <strong>{item.fourMonthOOS}</strong></div>}
            <div>----------------</div>
            <div>Past One Months: {item.oneMonth! > 0 ? item.oneMonth!.toFixed(2) : 0}</div>
            {item.oneMonthOOS === '' ? null : <div>Out of Stock Est: <strong>{item.oneMonthOOS}</strong></div>}
        </>
    }

    return <div
        className={styles["details-cell"]}
        onMouseOver={(e) => {
            dispatchNotification({type:"tooltip", e:e, title:"Stock consumption (per-day)", content:createContent(item)})
        }}
        onMouseLeave={()=>dispatchNotification()}
    >{item.stock.total}</div>
}