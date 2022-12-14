import styles from './layout-styles.module.css'
import {CSSProperties, ReactNode} from "react";

/**
 * @param {ReactNode} children - Wrapped child elements.
 * @param {boolean} [background=true] - Toggles display of column background.
 * @param {boolean} [scroll=false] - Toggles column scroll when true, if false whole window scrolls.
 * @param {string} [maxWidth=undefined] - Sets the maxWidth of the column content.
 */
interface Props {
    children:ReactNode;
    background?: boolean;
    scroll?:boolean;
    height?: number;
    maxWidth?:string;
    stickyTop?:boolean
}

/**
 * Layout component for basic column, child elements are the columns contents.
 */
export default function ColumnLayout({children, background = true, scroll = false, height = 30, maxWidth = undefined, stickyTop = false}:Props) {

    const styleOverrides: CSSProperties = {overflowY: undefined, margin: undefined, maxHeight: undefined, maxWidth: undefined}

    if (scroll) {
        styleOverrides.overflowY = "auto"
        styleOverrides.height = `calc(100vh - ${height}px)`
    }
    if (maxWidth) {
        styleOverrides.margin = "var(--sidebar-margin) auto"
        styleOverrides.maxWidth = maxWidth
    }
    if(stickyTop){
        styleOverrides.paddingTop = 0
    }

    return (
        <>
            {children ?
                <div
                    id={"column-layout"}
                    className={`${styles["column-layout"]} ${background ? styles["column-layout-background"] : ""}`}
                    style={styleOverrides}>
                    {children}
                </div> : null}
        </>
    )
}