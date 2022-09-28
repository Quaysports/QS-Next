import styles from './layout-styles.module.css'
export default function SidebarOneColumn({children}){
    return(
        <div className={styles["sidebar-one-column"]}>{children}</div>
    )
}