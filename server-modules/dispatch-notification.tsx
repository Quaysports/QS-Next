import React, {MouseEvent} from 'react'

/**
 * Notification options:
 * @property  {string} type - Notification Type, "popup", "confirm", "alert" or null.
 * @property  {string} [title] - Notification window title.
 * @property  {JSX.Element | JSX.Element[] | string} [content] - Window content.
 * @property  {function} [fn] - Function for confirm window, runs on "OK".
 */
interface Options {type?:string,title?:string,content?:JSX.Element | JSX.Element[] | string,fn?:Function, e?: React.MouseEvent<HTMLElement>}

//It dispatches a notification event to the notification-target element.
export function dispatchNotification(options: Options) {
    const event = new CustomEvent('notification', {detail: options});
    document.getElementById("notification-target")?.dispatchEvent(event)
}