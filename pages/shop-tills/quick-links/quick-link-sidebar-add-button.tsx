import styles from "../shop-tills.module.css";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import NewQuickLinkMenuPopup from "./new-quicklink-menu-popup";
import SidebarButton from "../../../components/layouts/SidebarButton";

export default function QuickLinkSidebarAddButton({type}){


    if(type === "parent"){
        return (
            <>
                <SidebarButton
                    className={styles["quick-link-sidebar-add-button"]}
                     onClick={()=>dispatchNotification({
                         type:"popup",
                         title:"New QuickLink Menu",
                         content:<NewQuickLinkMenuPopup/>
                     })}
                >+</SidebarButton>
            </>
        )
    }

    return null
}