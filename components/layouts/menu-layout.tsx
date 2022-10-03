import styles from './layout-styles.module.css'
import {ReactNode} from "react";

interface Props {
    children:ReactNode
}

/**
 * Menu Layout wrapper
 */
export default function MenuLayout({children}:Props){
    return(
        <div className={styles["menu-layout"]}>{children}</div>
    )
}