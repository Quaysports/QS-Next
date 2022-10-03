import style from './user.module.css'

/**
 * Create user component. Used in popup call.
 */
export default function CreateUser(){

    let userTemplate = {
        "username": "",
        "colour": "#ffffff",
        "password": "indiahoteL76",
        "pin": "",
        "role": "user",
        "rota": "online",
        "holiday": "",
        "permissions":{},
        "theme":{}
    }

    return (
        <div className={style["create-user-grid"]}>
            <input placeholder="Username..." onBlur={(e)=>userTemplate.username = e.target.value}/>
            <button onClick={async()=>{
                const opt = {method:'POST', body: JSON.stringify(userTemplate)}
                await fetch('/api/user/update-user', opt).then(res=>console.log(res))
                window.location.reload()
            }}>Submit</button>
        </div>
    )
}