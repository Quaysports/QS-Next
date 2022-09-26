import styles from "../shop-tills.module.css";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import NewQuickLinkMenuPopup from "./new-quicklink-menu-popup";

export default function QuickLinkSidebarAddButton({type}){


    if(type === "parent"){
        return (
            <>
                <div className={styles["quick-link-add-button"]}
                     onClick={()=>dispatchNotification({
                         type:"popup",
                         title:"New QuickLink Menu",
                         content:<NewQuickLinkMenuPopup/>
                     })}
                >+</div>
            </>
        )
    }

    return null
}