import styles from './stock-forecast.module.css'
import {StockForecastItem} from "../../server-modules/stock-forecast/process-data";
import {dispatchNotification} from "../../server-modules/dispatch-notification";

interface Props {
    item: StockForecastItem
}

export default function OnOrderCell({item}: Props) {

    function createContent(item: StockForecastItem) {
        let tooltipText = []
        for (let y in item.onOrder) {
            if (y === 'late' || y === 'total') continue
            for (let m in item.onOrder[Number(y)]) {
                for (let d in item.onOrder[Number(y)][Number(m)]) {
                    tooltipText.push(<div key={d+m+y}>{d}/{m}/{y}: {item.onOrder[Number(y)][Number(m)][Number(d)]}</div>)
                }
            }
        }
        return tooltipText
    }

    return <div
        className={styles["details-cell"]}
        onMouseOver={(e)=>{
            if(item.onOrder?.total && item.onOrder?.total > 0)
                dispatchNotification({type:"tooltip", e:e, title:"Stock Ordered", content:createContent(item)});
        }}
        onMouseLeave={()=>{
            if(item.onOrder?.total && item.onOrder?.total > 0)
                dispatchNotification({type:undefined})
        }}
    >{item.onOrder?.total}</div>
}