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
                let itemsArray = Array.from({length:25}, ()=>({SKU:""}))
                dispatch(addNewQuickLinkMenu({id:inputRef.current!.value,links:itemsArray}))
                dispatchNotification()
            }}>Submit</button>
        </div>
    )
}