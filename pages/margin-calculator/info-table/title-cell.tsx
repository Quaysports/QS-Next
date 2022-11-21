import {MarginItem} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css"
import {dispatchNotification} from "../../../components/notification/dispatch-notification";

export default function TitleCell({item}:{item:MarginItem}){
    return <span
                 onMouseOver={(e)=>{
                     const element = e.target as HTMLElement
                     if(element.offsetWidth < element.scrollWidth)
                         dispatchNotification({type:"tooltip", e:e, content:item.TITLE})
                 }}
                 onMouseLeave={
                    (e)=>dispatchNotification({type:undefined})
                 }><div className={styles["info-cell"]}>{item.TITLE}</div></span>
}