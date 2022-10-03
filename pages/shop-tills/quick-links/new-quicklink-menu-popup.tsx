import {useRef} from "react";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import {addNewQuickLinkMenu} from "../../../store/shop-tills/quicklinks-slice";
import {useDispatch} from "react-redux";
import styles from '../shop-tills.module.css'

export default function NewQuickLinkMenuPopup(){
    const inputRef = useRef(null)
    const dispatch = useDispatch()

    return (
        <div className={styles["new-quick-link-popup"]}>
            <div>Enter Quick link menu ID</div>
            <input ref={inputRef}/>
            <button onClick={()=>{
                let itemsArray = Array.from({length:20}, ()=>({SKU:""}))
                dispatch(addNewQuickLinkMenu({id:inputRef.current.value,links:itemsArray}))
                dispatchNotification({type:null})
            }}>Submit</button>
        </div>
    )
}