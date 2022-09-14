import style from '../styles/popup-component.module.css'
import {useDispatch, useSelector} from "react-redux";
import {selectShowPopup, setShowPopup} from "../store/popup-slice";

export default function Popup(title, contents){
    const show = useSelector(selectShowPopup)
    const dispatch = useDispatch()
    if(show){
        return(
            <div className={style['fullscreen-dim']}>
                <div className={style['popup-frame']}>
                    <div className={style['popup-title']}><span>{title}</span><button onClick={()=>dispatch(setShowPopup(false))}>x</button></div>
                    {contents}
                </div>
            </div>
        )
    }
    return null
}