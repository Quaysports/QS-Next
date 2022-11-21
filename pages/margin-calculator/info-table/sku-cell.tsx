import {MarginItem} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css"
import {dispatchNotification} from "../../../components/notification/dispatch-notification";

export default function SkuCell({item}:{item:MarginItem}){
    return <span
        onMouseOver={(e)=>{
            const element = e.target as HTMLElement
            if(element.offsetWidth < element.scrollWidth)
                dispatchNotification({type:"tooltip", e:e, content:item.SKU})
        }}
        onMouseLeave={
            (e)=>dispatchNotification({type:undefined})
        }><div className={styles["info-cell"]}>{item.SKU}</div></span>
}