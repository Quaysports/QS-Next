import React from 'react'
import styles from './layout-styles.module.css'

export default function ColumnLayout({children, scroll = false, maxWidth = undefined}){

    const cssStyles = {overflowY:null, margin:null, maxHeight:null, maxWidth:null}

    if(scroll){
        cssStyles.overflowY = "scroll"
        cssStyles.maxHeight = "calc(100vh - 52px)"
    }
    if(maxWidth){
        cssStyles.margin = "var(--sidebar-margin) auto"
        cssStyles.maxWidth = maxWidth
    }

    return(
        <>
        {children ? <div className={styles["column-layout"]}>
            <div
                style={cssStyles}
            >{children}</div>
        </div> : null}
        </>
    )
}