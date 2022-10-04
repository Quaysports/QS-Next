import styles from "../shop-tills.module.css";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import NewQuickLinkMenuPopup from "./new-quicklink-menu-popup";
import SidebarButton from "../../../components/layouts/SidebarButton";

/**
 * Sidebar button that creates a popup that allows you to create a new Quick Link menu.
 */
export default function QuickLinkSidebarAddButton() {
    return (
        <>
            <SidebarButton
                className={styles["quick-link-sidebar-add-button"]}
                onClick={() => dispatchNotification({
                    type: "popup",
                    title: "New QuickLink Menu",
                    content: <NewQuickLinkMenuPopup/>
                })}>+</SidebarButton>
        </>
    )
}