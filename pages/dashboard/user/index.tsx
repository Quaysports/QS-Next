import {useEffect, useState, FocusEvent} from "react";
import {user} from "../../../server-modules/users/user";
import style from './user.module.css'
import Popup from "../../../components/popup";
import {selectShowPopup, setShowPopup} from "../../../store/components/popup-slice";
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, selectUsers, setAllUserData, setUserData} from "../../../store/dashboard/user-slice";
import PermissionsPopup from "./permissions-popup";
import {setShowConfirm} from "../../../store/components/confirm-slice";
import Confirm from "../../../components/confirm";

export default function UserLandingPage() {

    const [popupContent, setPopupContent] = useState(null)
    const [confirmOptions, setConfirmOptions] = useState({title:"",text:"",fn:()=>{}})
    const userInfo = useSelector(selectUsers)
    const dispatch = useDispatch()
    const show = useSelector(selectShowPopup)

    useEffect(() => {
        fetch('/api/user/get-user')
            .then(async (res) => {
                let data = await res.json()
                dispatch(setAllUserData(data))
            })
    }, [])

    console.log(userInfo)

    function updateUserData(index:string,key:string,data:string){
        dispatch(setUserData({index:index,key:key,data:data}))
    }

    function verifyPin(index:string,key:string,e:FocusEvent<HTMLInputElement>){
        if (e.target.validity.patternMismatch) {
            e.target.style.borderColor = "var(--secondary-color)"
            e.target.setCustomValidity("Pin must contain only numbers and be exactly four digits long.")
            e.target.reportValidity()
        } else {
            e.target.style.borderColor = "";
            updateUserData(index, key, e.target.value)
        }

    }

    const createTable = () => {
        const userArray = [<div key="title" className={style["user-table-row"]}>
            <span></span>
            <span></span>
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
            for (const value of values) options.push(<option value={value}>{value}</option>)
            return options
        }

        if(userInfo.length === 0) return

        for (const [index, user] of Object.entries(userInfo)) {


            const userPermissionsPopup = <PermissionsPopup index={index}/>

            userArray.push(<div key={index} className={style["user-table-row"]}>
                <span><button onClick={() => {
                    setConfirmOptions({title:"Delete User", text:"Are you sure you wish to delete this user?", fn:()=> dispatch(deleteUser({index:index}))})
                    dispatch(setShowConfirm(true))
                }
                }>X</button></span>
                <span><button onClick={() => {
                    setPopupContent(userPermissionsPopup)
                    dispatch(setShowPopup(true))
                }}>Permissions</button></span>
                <span><input type="text" defaultValue={user.username} onBlur={(e)=> updateUserData(index,"username",e.target.value)}/></span>
                <span><select defaultValue={user.role} onChange={(e)=> updateUserData(index,"role",e.target.value)}>
                        {selectOptions(['admin', 'senior', 'user'])}
                    </select></span>
                <span>
                    <select defaultValue={user.rota} onChange={(e)=> updateUserData(index,"rota",e.target.value)}>
                        {selectOptions(['online', 'shop'])}
                    </select>
                </span>
                <span><input type="number" defaultValue={user.holiday} onBlur={(e)=> updateUserData(index,"holiday",e.target.value)}/></span>
                <span><input type="text" defaultValue={user.password} onBlur={(e)=> updateUserData(index,"password",e.target.value)}/></span>
                <span><input defaultValue={user.pin} pattern="^[0-9]{4}$" onBlur={(e)=> verifyPin(index,"pin",e)}/></span>
                <span><input type="color" defaultValue={user.colour} onBlur={(e)=> updateUserData(index,"colour",e.target.value)}/></span>
            </div>)
        }
        return userArray
    }

    return (
        <div>
            {Confirm(confirmOptions)}
            {Popup({title:'User Permissions', content:popupContent, show:show})}
            <div className={style["user-table"]}>
                {createTable()}
            </div>
        </div>
    )
}