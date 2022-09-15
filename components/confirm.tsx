import style from '../styles/confirm-component.module.css'
import {useDispatch, useSelector} from "react-redux";
import {selectShowConfirm, setShowConfirm} from "../store/components/confirm-slice";

export default function Confirm(options:{title:string,text:string,fn:Function}){
    const show = useSelector(selectShowConfirm)
    const dispatch = useDispatch()
    if(show){
        return(
            <div className={style['fullscreen-dim']}>
                <div className={style['confirm-frame']}>
                    <div className={style['confirm-title']}>{options.title}</div>
                    <div className={style['confirm-text']}>{options.text}</div>
                    <div className={style['confirm-buttons']}>
                        <button onClick={()=>{options.fn(); dispatch(setShowConfirm(false))}}>Yes</button>
                        <button onClick={()=> dispatch(setShowConfirm(false))}>No</button>
                    </div>
                </div>
            </div>
        )
    }
    return null
}