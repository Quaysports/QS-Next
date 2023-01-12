import styles from './layout-styles.module.css'
import {ReactNode} from "react";

/**
 * @param {ReactNode} children - Sidebar button child elements.
 * @param {boolean} [active] - Toggle for button active styling.
 * @param {onClick} [onClick] - Pass through for onClick function.
 * @param {string} [className] - Pass through for css class names.
 */
interface Props {
    children:ReactNode;
    active?:boolean;
    onClick?: ()=>void;
    className?: string;
}

/**
 * Sidebar dive button layout.
 */
export default function SidebarButton({children, active = false, onClick = ()=>{}, className = ""}:Props){

    return(
        <div data-testid={"sidebar-button"} className={`${styles["sidebar-button"]} ${active ? styles.active : ""} ${className}`} onClick={onClick}>{children}</div>
    )
}