import styles from '../shop-tills.module.css'
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import EditQuickLinkMenuPopup from "./edit-quicklink-menu-popup";

export default function QuickLinksSidebarButton({id, handler, text}){
    return(
        <div className={styles["quick-link-sidebar-button"]}>
            <div className={styles["sidebar-button-edit"]} onClick={()=>dispatchNotification({
                type:"popup",
                title:"New QuickLink Menu",
                content:<EditQuickLinkMenuPopup id={id}/>
            })}>&#9998;</div>
            <div className={styles["sidebar-button-title"]} onClick={()=>handler(id)}>{text}</div>
        </div>
    )
}