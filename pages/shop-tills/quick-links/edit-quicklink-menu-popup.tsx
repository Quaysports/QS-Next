import {useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteQuickLink,
    selectQuickLinks,
    updateQuickLinkID
} from "../../../store/shop-tills/quicklinks-slice";
import styles from "./quick-links.module.css";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import {useRouter} from "next/router";

export default function EditQuickLinkMenuPopup(){

    const router = useRouter()
    const linksIndex = Number(router.query.linksIndex)

    const inputRef = useRef<HTMLInputElement>(null)
    const links = useSelector(selectQuickLinks)
    const dispatch = useDispatch()

    return(
        <div className={styles["new-quick-link"]}>
            <div>Edit Quick link menu ID using the input <br/> or click delete to remove menu.</div>
            <input ref={inputRef} defaultValue={links[linksIndex]?.id}/>
            <div className={styles["dual-button-container"]}>
                <button onClick={()=>{
                dispatch(updateQuickLinkID({linksIndex:linksIndex, data:inputRef.current!.value}))
                dispatchNotification({type:undefined})
                }}>Update</button>
                <button onClick={()=>{
                    dispatch(deleteQuickLink(linksIndex))
                    dispatchNotification({type:undefined})
                }}>Delete</button>
            </div>
        </div>
    )
}