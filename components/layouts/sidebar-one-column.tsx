import styles from './layout-styles.module.css'
import {ReactNode} from "react";

interface Props {
    children:ReactNode
}

/**
 * Sidebar and Column layout wrapper
 */
export default function SidebarOneColumn({children}:Props){
    return(
        <div className={styles["sidebar-one-column"]}>{children}</div>
    )
}