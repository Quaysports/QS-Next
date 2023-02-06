import {useRef} from "react";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {addNewQuickLinkMenu} from "../../../store/shop-tills/quicklinks-slice";
import {useDispatch} from "react-redux";
import styles from './quick-links.module.css'
/**
 * Popup content component for creation of new Quick Links, adds new details to slice and saves to DB
 */
export default function NewQuickLinkMenuPopup(){
    const inputRef = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch()

    return (
        <div className={styles["new-quick-link"]}>
            <div>Enter Quick link menu ID</div>
            <input ref={inputRef}/>
            <button onClick={()=>{
                let itemsArray = Array.from({length:25}, ()=>{return ""})
                let dataArray = Array.from({length:25}, ()=>(
                    {SKU:"",title:"",prices:{amazon:0, ebay:0, magento:0, shop:0, purchase:0,retail:0},till:{color:""}})
                )
                dispatch(addNewQuickLinkMenu({id:inputRef.current!.value,links:itemsArray, data: dataArray}))
                dispatchNotification()
            }}>Submit</button>
        </div>
    )
}