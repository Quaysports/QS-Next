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
    maxWidth?:string;
}

/**
 * Layout component for basic column, child elements are the columns contents.
 */
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