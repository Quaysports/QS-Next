import styles from "./quick-links.module.css";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import NewQuickLinkMenuPopup from "./new-quicklink-menu-popup";
import SidebarButton from "../../../components/layouts/sidebar-button";

/**
 * Sidebar button that creates a popup that allows you to create a new Quick Link menu.
 */
export default function QuickLinkSidebarAddButton() {
    return (
        <>
            <SidebarButton
                className={styles["sidebar-add-button"]}
                onClick={() => dispatchNotification({
                    type: "popup",
                    title: "New QuickLink Menu",
                    content: <NewQuickLinkMenuPopup/>
                })}>+</SidebarButton>
        </>
    )
}