import style from './notification.module.css'
import {MouseEvent, useEffect, useRef, useState} from "react";


/**
 * Notification options:
 * @property  {string} [type] - Notification Type, "popup", "confirm", "alert" or null.
 * @property  {string} [title] - Notification window title.
 * @property  {JSX.Element | JSX.Element[] | string} [content] - Window content.
 * @property  {fn} [fn] - Function for confirm window, runs on "OK".
 */
export interface Options {
    type?:string;
    title?:string;
    content?:JSX.Element | JSX.Element[] | string;
    fn?:()=>void;
    e?:MouseEvent<HTMLElement, MouseEvent>;
}

/**
 * Notification props
 * @param {Options} options - Notification options object
 * @param {close} close - Run on notification popup close
 */
interface Props {options:Options, close:()=>void}

/**
 * Returns a popup, confirm, or alert depending on the type of notification passed to it
 */
export default function Notification(this: any, {options = {type:undefined}, close}:Props){

    const tooltip = useRef<any>()

    const [left, setLeft] = useState<number>(0)
    const [top, setTop] = useState<number>(0)

    useEffect(()=>{
        if(options.e && tooltip.current) {
            let styleLeft = options.e.clientX + 40;
            let styleTop = options.e.clientY + 10;
            let xBound = window.innerWidth - (tooltip.current.offsetWidth + styleLeft)
            let yBound = window.innerHeight - (tooltip.current.offsetHeight + styleTop)
            if (xBound < 10) styleLeft = (options.e.clientX - 40) - tooltip.current.offsetWidth
            if (yBound < 10) styleTop = (options.e.clientY - 10) - tooltip.current.offsetHeight
            setLeft(styleLeft)
            setTop(styleTop)
        }
    })

    switch(options.type){
        case "popup": return(
            <div key={new Date().toString()} className={style['fullscreen-dim']}>
                <div className={style['popup-frame']}>
                    <div className={style['popup-title']}><span>{options.title}</span><button onClick={()=>close()}>X</button></div>
                    {options.content}
                </div>
            </div>
        )
        case "confirm": return(
            <div  key={new Date().toString()} className={style['fullscreen-dim']}>
                <div className={style['confirm-frame']}>
                    <div className={style['confirm-title']}>{options.title}</div>
                    <div className={style['confirm-text']}>{options.content}</div>
                    <div className={style['confirm-buttons']}>
                        <button onClick={()=>{options.fn!(); close()}}>Yes</button>
                        <button onClick={()=> close()}>No</button>
                    </div>
                </div>
            </div>
        )
        case "alert": return(
            <div key={new Date().toString()} className={style['fullscreen-dim']}>
                <div className={style['alert-frame']}>
                    <div className={style['alert-title']}>{options.title}</div>
                    <div className={style['alert-text']}>{options.content}</div>
                    <div className={style['alert-buttons']}>
                        <button onClick={()=> close()}>Ok</button>
                    </div>
                </div>
            </div>
        )
        case "tooltip":
            return (
            <div key={new Date().toString()} ref={tooltip} className={style["tooltip-frame"]} style={{left: left , top: top}}>
                <div className={style["tooltip-title"]}>{options.title}</div>
                <div className={style["tooltip-text"]}>{options.content}</div>
            </div>
        )
        default: return null
    }
}