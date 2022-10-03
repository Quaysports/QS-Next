import styles from './layout-styles.module.css'
import {ReactNode, CSSProperties} from "react";

/**
 * @param {ReactNode[]} children - Children elements.
 * @param {boolean} [scroll=false] - Enables scrolling on sidebar.
 */
interface Props {
    children:ReactNode;
    scroll?:boolean;
}

/**
 * Sidebar layout, takes JSX element array of divs and renders as buttons
 */
export default function SidebarLayout({children, scroll = false}:Props){
    const styleOverrides:CSSProperties = {overflowY:undefined, maxHeight:undefined}

    if(scroll){
        styleOverrides.overflowY = "auto"
        styleOverrides.maxHeight = "calc(100vh - 52px)"
    }
    return(
        <div className={styles["sidebar-layout"]}><div style={styleOverrides}>{children}</div></div>
    )
}