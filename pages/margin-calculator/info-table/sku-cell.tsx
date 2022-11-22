import {MarginItem, setActiveIndex} from "../../../store/margin-calculator-slice";
import styles from "../margin-calculator.module.css"
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {useDispatch} from "react-redux";

export default function SkuCell({item, index}:{item:MarginItem, index:string}){

    const dispatch = useDispatch()

    return <span onMouseOver={(e)=>{
                    const element = e.target as HTMLElement
                    if(element.offsetWidth < element.scrollWidth)
                        dispatchNotification({type:"tooltip", e:e, content:item?.SKU})
                 }}
                 onMouseLeave={
                    ()=>dispatchNotification({type:undefined})
                 }
                 onClick={()=>dispatch(setActiveIndex(index))}>
        <div className={styles["info-cell"]}>{item?.SKU}</div>
    </span>
}