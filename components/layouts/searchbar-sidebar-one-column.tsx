import styles from "./layout-styles.module.css"
import {ReactNode} from "react";

interface Props {
    children:ReactNode
}

export default function SearchbarSidebarOneColumn({children}:Props){
    return(
        <div className={styles["searchbar-sidebar-one-column"]}>
            {children}
        </div>
    )
}