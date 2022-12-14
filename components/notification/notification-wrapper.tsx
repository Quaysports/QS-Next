import Notification, {Options} from "./notification";
import {useEffect, useRef, useState} from "react";

/**
 * A wrapper component that listens for a custom event called "notification" and when it receives the event, it passes the event's detail to the Notification component
 */
export default function NotificationWrapper(){

    const element = useRef<HTMLDivElement>(null)

    const [notificationContent, setNotificationContent] = useState<Options>({})

    useEffect(()=>{
        element.current?.addEventListener('notification', notificationEventHandler);
        return () => {
            element.current?.removeEventListener('notification', notificationEventHandler);
        };
    },[])

    function notificationEventHandler(e:Event){
        setNotificationContent((e as CustomEvent).detail as Options)
    }

    return <div id="notification-target" ref={element}>
        <Notification options={notificationContent} close={()=>setNotificationContent({})}/>
    </div>
}