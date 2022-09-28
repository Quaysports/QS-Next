import styles from './layout-styles.module.css'

export default function ColumnLayout({children, scroll = false, maxWidth = undefined}){

    const styleOverrides = {overflowY:null, margin:null, maxHeight:null, maxWidth:null}

    if(scroll){
        styleOverrides.overflowY = "scroll"
        styleOverrides.maxHeight = "calc(100vh - 52px)"
    }
    if(maxWidth){
        styleOverrides.margin = "var(--sidebar-margin) auto"
        styleOverrides.maxWidth = maxWidth
    }

    return(
        <div className={styles["column-layout"]}>
            <div
                style={styleOverrides}
            >{children}</div>
        </div>
    )
}