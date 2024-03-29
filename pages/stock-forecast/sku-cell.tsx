import styles from './stock-forecast.module.css'
import {dispatchNotification} from "../../components/notification/dispatch-notification";
import {useRef} from "react";
import {StockForecastItem} from "./index";

interface Props {
    item: StockForecastItem
}

export default function SkuCell({item}: Props) {

    if(!item) return null

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
                dispatchNotification()
        }}
    >{item.SKU}</div>
}