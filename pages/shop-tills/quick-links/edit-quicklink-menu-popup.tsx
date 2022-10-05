import {useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteQuickLink,
    selectQuickLinks,
    updateQuickLinkID
} from "../../../store/shop-tills/quicklinks-slice";
import styles from "./quick-links.module.css";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";

/**
 * @param {number} index - Index of Quick Link in Quick Links array of slice.
 */
interface Props {
    index: number;
}

export default function EditQuickLinkMenuPopup({index}:Props){
    const inputRef = useRef<HTMLInputElement>(null)
    const links = useSelector(selectQuickLinks)
    const dispatch = useDispatch()
    return(
        <div className={styles["new-quick-link"]}>
            <div>Edit Quick link menu ID using the input <br/> or click delete to remove menu.</div>
            <input ref={inputRef} defaultValue={links[index]?.id}/>
            <div className={styles["dual-button-container"]}>
                <button onClick={()=>{
                dispatch(updateQuickLinkID({id:index, data:inputRef.current!.value}))
                dispatchNotification({type:undefined})
                }}>Update</button>
                <button onClick={()=>{
                    dispatch(deleteQuickLink(index))
                    dispatchNotification({type:undefined})
                }}>Delete</button>
            </div>
        </div>
    )
}