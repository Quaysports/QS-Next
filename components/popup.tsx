import style from '../styles/popup-component.module.css'
import {useDispatch, useSelector} from "react-redux";
import {selectShowPopup, setShowPopup} from "../store/components/popup-slice";

export default function Popup(options:{title:string, content:JSX.Element | JSX.Element[], show:boolean}){
    const dispatch = useDispatch()
    const show = useSelector(selectShowPopup)
    if(show){
        return(
            <div className={style['fullscreen-dim']}>
                <div className={style['popup-frame']}>
                    <div className={style['popup-title']}><span>{options.title}</span><button onClick={()=>dispatch(setShowPopup(false))}>X</button></div>
                    {options.content}
                </div>
            </div>
        )
    }
    return null
}