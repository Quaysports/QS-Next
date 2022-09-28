import styles from './layout-styles.module.css'

export default function SidebarLayout({children}){
    return(
        <div className={styles["sidebar-layout"]}>{children}</div>
    )
}