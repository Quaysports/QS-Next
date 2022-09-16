import Notification from "./notification";
import {useEffect, useRef, useState} from "react";

export default function NotificationWrapper(){

    const element = useRef<HTMLDivElement>(null)

    const [notificationContent, setNotificationContent] = useState(undefined)

    useEffect(()=>{
        element.current.addEventListener('notification', notificationEventHandler);
        return () => {
            element.current.removeEventListener('notification', notificationEventHandler);
        };
    },[])

    function notificationEventHandler(e){
        setNotificationContent(e.detail)
    }

    return <div id="notification-target" ref={element}>
        <Notification options={notificationContent} close={()=>setNotificationContent({type:"", title:"", content:""})}/>
    </div>
}

export function dispatchNotification(details){
    const event = new CustomEvent('notification', { detail: details });
    document.getElementById("notification-target").dispatchEvent(event)
}