import styles from './layout-styles.module.css'

export default function SidebarButton({children, active = false, onClick = ()=>{}}){

    return(
        <div className={`${styles["sidebar-button"]} ${active ? styles.active : ""}`} onClick={onClick}>{children}</div>
    )
}