import React from 'react'
import {Options} from "./toast";

//It dispatches a notification event to the notification-target element.
export function dispatchToast(options: Options = {}) {
    console.log(options)
    const event = new CustomEvent('toast', {detail: options});
    document.getElementById("toast-target")?.dispatchEvent(event)
}