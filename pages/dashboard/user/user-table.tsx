import style from "./user.module.css";
import PermissionsPopup from "./permissions-popup";
import {deleteUser, setUserData} from "../../../store/dashboard/user-slice";
import {setShowConfirm} from "../../../store/confirm-slice";
import {setShowPopup} from "../../../store/popup-slice";
import {FocusEvent} from "react";
import {useDispatch} from "react-redux";
import {user} from "../../../server-modules/users/user";
import CreateUser from "./create-user-popup";

interface propTypes {
    userInfo: user[],
    confirmContentHandler: Function,
    popupContentHandler: Function
}

export default function UserTable({userInfo, confirmContentHandler, popupContentHandler}: propTypes) {
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
        <div></div>
        <button onClick={() => {
            popupContentHandler({
                title: "Create User",
                content: <CreateUser />
            })
            dispatch(setShowPopup(true))
        }}>Add User
        </button>
        <div>Username</div>
        <div>Role</div>
        <div>Rota</div>
        <div>Holiday</div>
        <div>Password</div>
        <div>Pin</div>
        <div>User Colour</div>
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
                <button onClick={() => {
                    confirmContentHandler({
                        title: "Delete User",
                        text: "Are you sure you wish to delete this user?",
                        fn: () => dispatch(deleteUser({index: index}))
                    })
                    dispatch(setShowConfirm(true))
                }}>X
                </button>

                <button onClick={() => {
                    popupContentHandler({
                        title: "User Permissions",
                        content: <PermissionsPopup index={index}/>
                    })
                    dispatch(setShowPopup(true))
                }}>Permissions
                </button>

                <input type="text" defaultValue={user.username} onBlur={(e) => updateUserData(index, "username", e.target.value)}/>

                <select defaultValue={user.role} onChange={(e) => updateUserData(index, "role", e.target.value)}>
                    {selectOptions(['admin', 'senior', 'user'])}
                </select>

                <select defaultValue={user.rota} onChange={(e) => updateUserData(index, "rota", e.target.value)}>
                    {selectOptions(['online', 'shop'])}
                </select>

                <input type="number" defaultValue={user.holiday} onBlur={(e) => updateUserData(index, "holiday", e.target.value)}/>
                <input type="text" defaultValue={user.password} onBlur={(e) => updateUserData(index, "password", e.target.value)}/>
                <input defaultValue={user.pin} pattern="^[0-9]{4}$" onBlur={(e) => verifyPin(index, "pin", e)}/>
                <input type="color" defaultValue={user.colour} onBlur={(e) => updateUserData(index, "colour", e.target.value)}/>
            </div>
        )
    }
    return <>{userArray}</>
}