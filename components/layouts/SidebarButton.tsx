import styles from './layout-styles.module.css'

export default function SidebarButton({children, active = false, onClick = ()=>{}, className = ""}){

    return(
        <div className={`${styles["sidebar-button"]} ${active ? styles.active : ""} ${className}`} onClick={onClick}>{children}</div>
    )
}