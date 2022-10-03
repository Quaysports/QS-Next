import styles from './layout-styles.module.css'
import {ReactNode, CSSProperties} from "react";

interface Props {
    children:ReactNode;
    scroll:boolean;
}

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