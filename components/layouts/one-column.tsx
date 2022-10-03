import styles from './layout-styles.module.css'
import {ReactNode} from "react";

interface Props {
    children:ReactNode
}

/**
 * Single column layout wrapper
 */
export default function OneColumn({children}:Props){
    return(
        <div className={styles["one-column"]}>{children}</div>
    )
}