import styles from './toast.module.css'
import {CSSProperties} from "react";
/**
 * Notification options:
 * @property  {string} [type] - Notification Type, "popup", "confirm", "alert" or null.
 * @property  {string} [title] - Notification window title.
 * @property  {JSX.Element | JSX.Element[] | string} [content] - Window content.
 * @property  {fn} [fn] - Function for confirm window, runs on "OK".
 */
export interface Options {
    content?: JSX.Element | JSX.Element[] | string;
    duration?: number;
    key?:string
}

/**
 * Notification props
 * @param {Options} options - Notification options object
 * @param {close} close - Run on notification popup close
 */
interface Props {
    options?: Options,
    handler: (key:string) => void
}

/**
 * Returns a popup, confirm, or alert depending on the type of notification passed to it
 */
export default function Toast(this: any, {options = undefined, handler}: Props) {

    if(!options) return null
    let style: CSSProperties = options.duration ? {animationDuration: options.duration+"s"} : {}
    return (
        <div className={styles.frame} style={style} onAnimationEnd={()=>handler(options.key!)}>
            <div className={styles.content}>
                {options?.content}
            </div>
        </div>
    )
}