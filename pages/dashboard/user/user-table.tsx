import style from "./user.module.css";
import PermissionsPopup from "./permissions-popup";
import {deleteUser, setUserData} from "../../../store/dashboard/user-slice";
import {useDispatch} from "react-redux";
import {User} from "../../../server-modules/users/user";
import CreateUser from "./create-user-popup";
import {dispatchNotification} from "../../../server-modules/dispatch-notification";
import RegexInput from "../../../components/RegexInput";
import {ReactElement} from "react";

interface Props {
    userInfo: User[]
}

export default function UserTable({userInfo}: Props) {
    const dispatch = useDispatch()

    function updateUserData(index: string, key: string, data: string) {
        dispatch(setUserData({index: index, key: key, data: data}))
    }

    
    const userArray:ReactElement[] = [<div key="title" className={style["user-table-row"]}>
        <span></span>
        <span><button
            className={style["add-user-button"]}
            onClick={() => {
                dispatchNotification({type: "popup", title: 'User Permissions', content: <CreateUser/>});
        }}>Add User
        </button></span>
        <span>Username</span>
        <span>Role</span>
        <span>Rota</span>
        <span>Holiday</span>
        <span>Password</span>
        <span>Pin</span>
        <span>User Colour</span>
    </div>]

    const selectOptions = (values:string[]) => {
        const options = []
        for (const value of values) options.push(<option key={options.length} value={value}>{value}</option>)
        return options
    }

    if (!userInfo || userInfo.length === 0) return null

    for (const [index, user] of Object.entries(userInfo)) {

        const pinHandler = (value:string) => updateUserData(index, "pin", value)
        
        userArray.push(
            <div key={index} className={style["user-table-row"]}>
                <span><button onClick={() => {
                    dispatchNotification({
                        type: "confirm",
                        title: 'Delete User',
                        content: "Are you sure you wish to delete this user?",
                        fn: () => dispatch(deleteUser({index: index}))
                    });
                }}>X</button></span>

                <span><button onClick={() => {
                    dispatchNotification({
                        type: "popup",
                        title: 'User Permissions',
                        content: <PermissionsPopup index={index}/>
                    });
                }}>Permissions</button></span>

                <span><input type="text" defaultValue={user.username} onBlur={(e) => updateUserData(index, "username", e.target.value)}/></span>

                <span><select defaultValue={user.role} onChange={(e) => updateUserData(index, "role", e.target.value)}>
                    {selectOptions(['admin', 'senior', 'user'])}
                </select></span>

                <span><select defaultValue={user.rota} onChange={(e) => updateUserData(index, "rota", e.target.value)}>
                    {selectOptions(['online', 'shop'])}
                </select></span>

                <span><input type="number" defaultValue={user.holiday} onBlur={(e) => updateUserData(index, "holiday", e.target.value)}/></span>
                <span><input type="text" defaultValue={user.password} onBlur={(e) => updateUserData(index, "password", e.target.value)}/></span>
                <span>
                    <RegexInput type={"pin"} value={user.pin ? user.pin : ""} errorMessage={"Pin must contain only numbers and be exactly four digits long."} handler={pinHandler}/>
                </span>
                <span><input type="color" defaultValue={user.colour} onBlur={(e) => updateUserData(index, "colour", e.target.value)}/></span>
            </div>
        )
    }
    return <>{userArray}</>
}