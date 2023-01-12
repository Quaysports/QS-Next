import styles from './layout-styles.module.css'
import {ReactNode} from "react";

export default function SidebarBreak({children}:{children:ReactNode}) {
    return <div className={styles["sidebar-break"]}>{children}</div>
}