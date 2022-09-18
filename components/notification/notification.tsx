import style from './notification.module.css'

/**
 * Notification options:
 * @property  {string} type - Notification Type, "popup", "confirm", "alert" or null.
 * @property  {string} [title] - Notification window title.
 * @property  {JSX.Element | JSX.Element[] | string} [content] - Window content.
 * @property  {function} [fn] - Function for confirm window, runs on "OK".
 */
export interface options {type:string,title?:string,content?:JSX.Element | JSX.Element[] | string,fn?:Function}


/* Defining the props that the component will receive. */
interface props {options:options, close:Function}

/**
 * It returns a popup, confirm, or alert depending on the type of notification passed to it
 * @param {props}  - options.type - the type of notification to display.
 * @returns A React component
 */
export default function Notification({options = {type:null}, close}:props){
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
                        <button onClick={()=>{options.fn(); close()}}>Yes</button>
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