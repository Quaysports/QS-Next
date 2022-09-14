import {useEffect, useState} from "react";
import {user} from "../../../server-modules/users/user";
import style from './user.module.css'
import Popup from "../../../components/popup";
import {setShowPopup} from "../../../store/popup-slice";
import {useDispatch} from "react-redux";

export default function UserLandingPage() {

    const [userInfo, setUserInfo] = useState<user[]>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if(userInfo === null) {
            fetch('/api/user/get-user')
                .then(async (res) => {
                    setUserInfo(await res.json())
                })
        }
    })
    console.log(userInfo)

    const createTable = () => {
        const userArray = [<div className={style["user-table-row"]}>
            <span></span>
            <span>Username</span>
            <span>Role</span>
            <span>Rota</span>
            <span>Holiday</span>
            <span>Password</span>
            <span>Pin</span>
            <span>User Colour</span>
        </div>]
        if (!userInfo) return

        const selectOptions = (values) => {
            const options = []
            for(const value of values) options.push(<option value={value}>{value}</option>)
            return options
        }

        for (const user of userInfo) {
            userArray.push(<div className={style["user-table-row"]}>
                <span><button onClick={()=>dispatch(setShowPopup(true))}>Permissions</button></span>
                <span><input type="text" value={user.username}/></span>
                <span><select defaultValue={user.role}>
                        {selectOptions(['admin', 'senior', 'user'])}
                    </select></span>
                <span>
                    <select defaultValue={user.rota}>
                        {selectOptions(['online', 'shop'])}
                    </select>
                </span>
                <span><input type="number" value={user.holiday}/></span>
                <span><input type="text" value={user.password}/></span>
                <span><input type="number" value={user.pin}/></span>
                <span><input type="color" value={user.colour}/></span>
            </div>)
        }
        return userArray
    }

    const userPermissionsPopup = <div>User Permissions</div>

    return (
        <div>
            {Popup('User Permissions', userPermissionsPopup)}
            <div className={style["user-table"]}>
                {createTable()}
            </div>
        </div>
    )
}