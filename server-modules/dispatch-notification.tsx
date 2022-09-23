
/**
 * It dispatches a notification event to the notification-target element.
 * @param {options} options - {
 */
export function dispatchNotification(options) {
    const event = new CustomEvent('notification', {detail: options});
    document.getElementById("notification-target")?.dispatchEvent(event)
}