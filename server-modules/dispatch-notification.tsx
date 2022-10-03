
interface Options {type?:string,title?:string,content?:JSX.Element | JSX.Element[] | string,fn?:Function}
 //It dispatches a notification event to the notification-target element.
export function dispatchNotification(options:Options) {
    const event = new CustomEvent('notification', {detail: options});
    document.getElementById("notification-target")?.dispatchEvent(event)
}