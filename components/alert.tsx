import style from '../styles/alert-component.module.css'
import {useDispatch, useSelector} from "react-redux";
import {selectShowAlert, setShowAlert} from "../store/alert-slice";

export default function Alert(title, text){
    const show = useSelector(selectShowAlert)
    const dispatch = useDispatch()
    if(show){
        return(
            <div className={style['fullscreen-dim']}>
                <div className={style['alert-frame']}>
                    <div className={style['alert-title']}>{title}</div>
                    <div className={style['alert-text']}>{text}</div>
                    <div className={style['alert-buttons']}>
                        <button onClick={()=> dispatch(setShowAlert(false))}>Ok</button>
                    </div>
                </div>
            </div>
        )
    }
    return null
}