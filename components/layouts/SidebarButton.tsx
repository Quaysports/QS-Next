import styles from './layout-styles.module.css'
import {ReactNode} from "react";

interface Props {
    children:ReactNode;
    active?:boolean;
    onClick: ()=>void;
    className?: string;
}

export default function SidebarButton({children, active = false, onClick = ()=>{}, className = ""}:Props){

    return(
        <div className={`${styles["sidebar-button"]} ${active ? styles.active : ""} ${className}`} onClick={onClick}>{children}</div>
    )
}