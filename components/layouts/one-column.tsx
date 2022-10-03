import styles from './layout-styles.module.css'
import {ReactNode} from "react";

interface Props {
    children:ReactNode
}

export default function OneColumn({children}:Props){
    return(
        <div className={styles["one-column"]}>{children}</div>
    )
}