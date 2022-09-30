import styles from './layout-styles.module.css'

export default function ColumnLayout({children, background = true, scroll = false, maxWidth = undefined}) {

    const styleOverrides = {overflowY: null, margin: null, maxHeight: null, maxWidth: null}

    if (scroll) {
        styleOverrides.overflowY = "auto"
        styleOverrides.maxHeight = "calc(100vh - 52px)"
    }
    if (maxWidth) {
        styleOverrides.margin = "var(--sidebar-margin) auto"
        styleOverrides.maxWidth = maxWidth
    }

    return (
        <>
            {children ?
                <div
                    className={`${styles["column-layout"]} ${background === true ? styles["column-layout-background"] : ""}`}
                    style={styleOverrides}>
                    {children}
                </div> : null}
        </>
    )
}