import styles from "./layout-styles.module.css"

export default function SearchbarSidebarOneColumn({children}){
    return(
        <div className={styles["searchbar-sidebar-one-column"]}>
            {children}
        </div>
    )
}