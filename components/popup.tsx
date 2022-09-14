import style from '../styles/popup-component.module.css'
import {useDispatch, useSelector} from "react-redux";
import {selectShowPopup, setShowPopup} from "../store/popup-slice";

export default function Popup(options:{title:string, content:JSX.Element | JSX.Element[]}){
    const show = useSelector(selectShowPopup)
    const dispatch = useDispatch()
    if(show){
        return(
            <div className={style['fullscreen-dim']}>
                <div className={style['popup-frame']}>
                    <div className={style['popup-title']}><span>{options.title}</span><button onClick={()=>dispatch(setShowPopup(false))}>x</button></div>
                    {options.content}
                </div>
            </div>
        )
    }
    return null
}