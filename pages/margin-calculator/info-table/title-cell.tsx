import {MarginItem} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css"
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {useRef} from "react";

export default function TitleCell({item}:{item:MarginItem}){

    const ref = useRef(null)

    return <span onMouseOver={(e)=>{
                     const element = e.target as HTMLElement
                     if(element.offsetWidth < element.scrollWidth)
                         dispatchNotification({type:"tooltip", e:e, content:item?.TITLE})
                 }}
                 onMouseLeave={
                    ()=>dispatchNotification({type:undefined})
                 }
                 onClick={()=>{
                     if(ref.current){
                         window.getSelection()?.selectAllChildren(ref.current)
                         document.execCommand("copy")
                     }
                 }}>
        <div ref={ref} className={styles["info-cell"]}>{item?.TITLE}</div>
    </span>
}