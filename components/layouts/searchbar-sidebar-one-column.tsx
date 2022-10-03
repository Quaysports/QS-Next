import styles from "./layout-styles.module.css"
import {ReactNode} from "react";

interface Props {
    children:ReactNode
}

/**
 * Search bar, Sidebar and Column layout wrapper
 */
export default function SearchbarSidebarOneColumn({children}:Props){
    return(
        <div className={styles["searchbar-sidebar-one-column"]}>
            {children}
        </div>
    )
}