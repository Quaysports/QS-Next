import styles from './layout-styles.module.css'
import {ReactNode} from "react";

interface Props {
    children:ReactNode
}

export default function MenuLayout({children}:Props){
    return(
        <div className={styles["menu-layout"]}>{children}</div>
    )
}