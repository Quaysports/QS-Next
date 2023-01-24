import styles from './toast.module.css'
import {CSSProperties} from "react";
/**
 * Notification options:
 * @property  {JSX.Element | JSX.Element[] | string} [content] - Window content.
 * @property  {number} [duration] - Number of seconds to run, defaults to 3.
 */
export interface Options {
    content?: JSX.Element | JSX.Element[] | string;
    duration?: number;
}

interface OptionsWithKey extends Options{
    key:string
}
/**
 * Notification props
 * @param {Options} options - Notification options object
 * @param {Function} handler - Returns the key of the notification after animation is completed
 */
interface Props {
    options?: OptionsWithKey,
    handler: (key:string) => void
}

/**
 * Returns a popup, confirm, or alert depending on the type of notification passed to it
 */
export default function Toast({options = undefined, handler}: Props) {

    if(!options) return null
    let style: CSSProperties = options.duration ? {animationDuration: options.duration+"s"} : {animationDuration: "3s"}
    return (
        <div className={styles.frame} style={style} onAnimationEnd={()=>handler(options.key!)}>
            <div className={styles.content}>
                {options?.content}
            </div>
        </div>
    )
}