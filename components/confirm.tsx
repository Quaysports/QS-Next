import style from '../styles/confirm-component.module.css'
import {useDispatch, useSelector} from "react-redux";
import {selectShowConfirm, setShowConfirm} from "../store/confirm-slice";

export default function Confirm(title, text, fn){
    const show = useSelector(selectShowConfirm)
    const dispatch = useDispatch()
    if(show){
        return(
            <div className={style['fullscreen-dim']}>
                <div className={style['confirm-frame']}>
                    <div className={style['confirm-title']}>{title}</div>
                    <div className={style['confirm-text']}>{text}</div>
                    <div className={style['confirm-buttons']}>
                        <button onClick={()=>{fn();dispatch(setShowConfirm(false))}}>Yes</button>
                        <button onClick={()=> dispatch(setShowConfirm(false))}>No</button>
                    </div>
                </div>
            </div>
        )
    }
    return null
}