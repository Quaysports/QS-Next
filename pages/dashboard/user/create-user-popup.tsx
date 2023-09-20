import style from './user.module.css'
import {User} from "../../../server-modules/users/user";

/**
 * Create user component. Used in popup call.
 */
export default function CreateUser(){

    let userTemplate:User = {
        "username": "",
        "colour": "#ffffff",
        "password": "indiahoteL76",
        "pin": "",
        "role": "user",
        "rota": "online",
        "sharedRota": "no",
        "holiday": [],
        "sick":{
            "paid":[],
            "unpaid":[]
        },
        "permissions":{},
        "theme":{},
        "settings":{}
    }

    return (
        <div className={style["create-user-grid"]}>
            <input placeholder="Username..." onBlur={(e)=>userTemplate.username = e.target.value}/>
            <button onClick={async()=>{
                const opt = {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify(userTemplate)}
                await fetch('/api/user/update-user', opt)
                window.location.reload()
            }}>Submit</button>
        </div>
    )
}