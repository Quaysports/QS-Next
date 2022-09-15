import style from './user.module.css'
import {useDispatch} from "react-redux";
import {setShowPopup} from "../../../store/popup-slice";

export default function CreateUser(){

    const dispatch = useDispatch()

    let userTemplate = {
        "username": "",
        "colour": "#ffffff",
        "password": "indiahoteL76",
        "pin": "",
        "role": "user",
        "rota": "online",
        "holiday": ""
    }

    return (
        <div className={style["create-user-grid"]}>
            <input placeholder="Username..." onBlur={(e)=>userTemplate.username = e.target.value}/>
            <button onClick={async()=>{
                console.log(userTemplate)
                const opt = {method:'POST', body: JSON.stringify(userTemplate)}
                await fetch('/api/user/update-user', opt).then(res=>console.log(res))
                dispatch(setShowPopup(false))
                window.location.reload()
            }}>Submit</button>
        </div>
    )
}