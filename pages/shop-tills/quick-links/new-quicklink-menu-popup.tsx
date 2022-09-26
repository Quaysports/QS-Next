import {useRef} from "react";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import {selectQuickLinks, updateQuickLinks} from "../../../store/shop-tills/quicklinks";
import {useDispatch, useSelector} from "react-redux";
import styles from '../shop-tills.module.css'

export default function NewQuickLinkMenuPopup(){
    const inputRef = useRef(null)
    const links = useSelector(selectQuickLinks)
    const dispatch = useDispatch()

    return (
        <div className={styles["new-quick-link-popup"]}>
            <div>Enter Quick link menu ID</div>
            <input ref={inputRef}/>
            <button onClick={()=>{
                let newQuickLinks = [...links]
                newQuickLinks.push({id:inputRef.current.value,links:[]})
                dispatch(updateQuickLinks(newQuickLinks))
                dispatchNotification({type:null})
            }}>Submit</button>
        </div>
    )
}