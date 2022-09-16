import style from "./user.module.css";
import PermissionsPopup from "./permissions-popup";
import {deleteUser, setUserData} from "../../../store/dashboard/user-slice";
import {FocusEvent} from "react";
import {useDispatch} from "react-redux";
import {user} from "../../../server-modules/users/user";
import CreateUser from "./create-user-popup";

interface propTypes {
    userInfo: user[]
}

export default function UserTable({userInfo}: propTypes) {
    const dispatch = useDispatch()

    function updateUserData(index: string, key: string, data: string) {
        dispatch(setUserData({index: index, key: key, data: data}))
    }

    function verifyPin(index: string, key: string, e: FocusEvent<HTMLInputElement>) {
        if (e.target.validity.patternMismatch) {
            e.target.style.borderColor = "var(--secondary-color)"
            e.target.setCustomValidity("Pin must contain only numbers and be exactly four digits long.")
            e.target.reportValidity()
        } else {
            e.target.style.borderColor = "";
            updateUserData(index, key, e.target.value)
        }
    }

    const userArray = [<div key="title" className={style["user-table-row"]}>
        <span></span>
        <span><button
            className={style["add-user-button"]}
            onClick={() => {
                const event = new CustomEvent('notification', {
                    detail: {
                        type: "popup",
                        title: 'User Permissions',
                        content: <CreateUser/>
                    }
                });
                window.dispatchEvent(event)
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

    const selectOptions = (values) => {
        const options = []
        for (const value of values) options.push(<option key={options.length} value={value}>{value}</option>)
        return options
    }

    if (userInfo.length === 0) return

    for (const [index, user] of Object.entries(userInfo)) {
        console.log(user)
        userArray.push(
            <div key={index} className={style["user-table-row"]}>
                <span><button onClick={() => {
                    const event = new CustomEvent('notification', {
                        detail: {
                            type: "confirm",
                            title: 'Delete User',
                            content: "Are you sure you wish to delete this user?",
                            fn: () => dispatch(deleteUser({index: index}))
                        }
                    });
                    window.dispatchEvent(event)
                }}>X
                </button></span>

                <span><button onClick={() => {
                    const event = new CustomEvent('notification', {
                        detail: {
                            type: "popup",
                            title: 'User Permissions',
                            content: <PermissionsPopup index={index}/>
                        }
                    });
                    window.dispatchEvent(event)
                }}>Permissions
                </button></span>

                <span><input type="text" defaultValue={user.username} onBlur={(e) => updateUserData(index, "username", e.target.value)}/></span>

                <span><select defaultValue={user.role} onChange={(e) => updateUserData(index, "role", e.target.value)}>
                    {selectOptions(['admin', 'senior', 'user'])}
                </select></span>

                <span><select defaultValue={user.rota} onChange={(e) => updateUserData(index, "rota", e.target.value)}>
                    {selectOptions(['online', 'shop'])}
                </select></span>

                <span><input type="number" defaultValue={user.holiday} onBlur={(e) => updateUserData(index, "holiday", e.target.value)}/></span>
                <span><input type="text" defaultValue={user.password} onBlur={(e) => updateUserData(index, "password", e.target.value)}/></span>
                <span><input defaultValue={user.pin} pattern="^[0-9]{4}$" onBlur={(e) => verifyPin(index, "pin", e)}/></span>
                <span><input type="color" defaultValue={user.colour} onBlur={(e) => updateUserData(index, "colour", e.target.value)}/></span>
            </div>
        )
    }
    return <>{userArray}</>
}