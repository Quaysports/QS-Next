import {useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteQuickLink,
    selectQuickLinks,
    updateQuickLinkID
} from "../../../store/shop-tills/quicklinks-slice";
import styles from "../shop-tills.module.css";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";

export default function EditQuickLinkMenuPopup({id}){
    const inputRef = useRef(null)
    const links = useSelector(selectQuickLinks)
    const dispatch = useDispatch()
    return(
        <div className={styles["new-quick-link-popup"]}>
            <div>Edit Quick link menu ID using the input <br/> or click delete to remove menu.</div>
            <input ref={inputRef} defaultValue={links[id].id}/>
            <div className={styles["dual-button-container"]}>
                <button onClick={()=>{
                dispatch(updateQuickLinkID({id:id, data:inputRef.current.value}))
                dispatchNotification({type:null})
                }}>Update</button>
                <button onClick={()=>{
                    dispatch(deleteQuickLink(id))
                    dispatchNotification({type:null})
                }}>Delete</button>
            </div>
        </div>
    )
}