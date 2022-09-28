import styles from './layout-styles.module.css'

export default function SidebarLayout({children, scroll = false}){
    const styleOverrides = {overflowY:null, maxHeight:null}

    if(scroll){
        styleOverrides.overflowY = "scroll"
        styleOverrides.maxHeight = "calc(100vh - 52px)"
    }
    return(
        <div className={styles["sidebar-layout"]}><div style={styleOverrides}>{children}</div></div>
    )
}