import Toast, {Options} from "./toast";
import {useEffect, useRef, useState} from "react";
import {guid} from "../../server-modules/core/core";

/**
 * A wrapper component that listens for a custom event called "notification" and when it receives the event, it passes the event's detail to the Notification component
 */
export default function ToastWrapper() {

    const element = useRef<HTMLDivElement>(null)

    const [toastContent, setToastContent] = useState<Options & {key:string}| undefined>()
    const [toastRender, setToastRender] = useState<{ [key: string]: Options  }>({})


    useEffect(() => {
        element.current?.addEventListener('toast', toastEventHandler);
        return () => {
            element.current?.removeEventListener('toast', toastEventHandler);
        };
    }, [])

    useEffect(() => {
        if (Object.keys(toastRender).length === 0) return
        const key = Object.keys(toastRender)[0]
        setToastContent({...toastRender[key], key: key})
    }, [toastRender])

    function toastAnimationHandler(key:string){
        delete toastRender[key]
        setToastRender({...toastRender})
    }

    function toastEventHandler(e: Event) {
        setToastRender(msg => ({
                ...msg,
                ...{[guid()]: (e as CustomEvent).detail as Options}
            })
        )
    }

    return <div id="toast-target" ref={element}>
        <Toast key={toastContent?.key} options={toastContent} handler={toastAnimationHandler} />
    </div>
}