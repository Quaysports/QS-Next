import styles from './stock-forecast.module.css'
import {dispatchNotification} from "../../components/notification/dispatch-notification";
import {StockForecastItem} from "./index";

interface Props {
    item: StockForecastItem
}

export default function OnOrderCell({item}: Props) {

    if(!item) return null

    function createContent(item: StockForecastItem) {
        let tooltipText = []
        for (let order of item.onOrder) {
            tooltipText.push(<div key={order.id}>{new Date(order.due).toLocaleDateString("en-GB")}: {order.quantity}</div>)
        }
        return tooltipText
    }

    let total = 0
    if(item.onOrder.length > 0) {
        total = item.onOrder.reduce((acc, order) => acc + order.quantity, 0)
    }

    return <div
        className={styles["details-cell"]}
        onMouseOver={(e)=>{
            if(total && total > 0)
                dispatchNotification({type:"tooltip", e:e, title:"Stock Ordered", content:createContent(item)});
        }}
        onMouseLeave={()=>{
            if(total && total > 0)
                dispatchNotification()
        }}
    >{total}</div>
}