import styles from './stock-forecast.module.css'
import {StockForecastItem} from "../../server-modules/stock-forecast/process-data";
import {dispatchNotification} from "../../server-modules/dispatch-notification";
import {useRef} from "react";

interface Props {
    item: StockForecastItem
}

export default function SkuCell({item}: Props) {

    const divRef = useRef(null)

    return <div
        ref={divRef}
        className={styles["sku-cell"]}
        onMouseOver={(e)=>{
            const element = e.target as HTMLElement
            if(element.offsetWidth < element.scrollWidth)
                dispatchNotification({type:"tooltip", e:e, content:item.SKU})
        }}
        onMouseLeave={(e)=>{
            const element = e.target as HTMLElement
            if(element.offsetWidth < element.scrollWidth)
                dispatchNotification({type:undefined})
        }}
    >{item.SKU}</div>
}