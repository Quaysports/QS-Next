import style from './notification.module.css'

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
export default function Notification({options = {type:undefined}, close}:Props){
    switch(options.type){
        case "popup": return(
            <div className={style['fullscreen-dim']}>
                <div className={style['popup-frame']}>
                    <div className={style['popup-title']}><span>{options.title}</span><button onClick={()=>close()}>X</button></div>
                    {options.content}
                </div>
            </div>
        )
        case "confirm": return(
            <div className={style['fullscreen-dim']}>
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
            <div className={style['fullscreen-dim']}>
                <div className={style['alert-frame']}>
                    <div className={style['alert-title']}>{options.title}</div>
                    <div className={style['alert-text']}>{options.content}</div>
                    <div className={style['alert-buttons']}>
                        <button onClick={()=> close()}>Ok</button>
                    </div>
                </div>
            </div>
        )
        default: return null
    }
}