import styles from './layout-styles.module.css'
import {CSSProperties, ReactNode} from "react";

interface Props {
    children:ReactNode;
    background?: boolean;
    scroll?:boolean;
    maxWidth?:string;
}

export default function ColumnLayout({children, background = true, scroll = false, maxWidth = undefined}:Props) {

    const styleOverrides: CSSProperties = {overflowY: undefined, margin: undefined, maxHeight: undefined, maxWidth: undefined}

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
                    className={`${styles["column-layout"]} ${background ? styles["column-layout-background"] : ""}`}
                    style={styleOverrides}>
                    {children}
                </div> : null}
        </>
    )
}