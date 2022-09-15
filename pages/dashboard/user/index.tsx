import {useEffect, useState} from "react";
import style from './user.module.css'
import Popup from "../../../components/popup";
import {useDispatch, useSelector} from "react-redux";
import {selectUsers, setAllUserData} from "../../../store/dashboard/user-slice";
import Confirm from "../../../components/confirm";
import UserTable from "./user-table";

export default function UserLandingPage() {

    const [popupContent, setPopupContent] = useState({title:"", content:null})
    const [confirmContent, setConfirmContent] = useState({title:"",text:"",fn:()=>{}})
    const userInfo = useSelector(selectUsers)
    const dispatch = useDispatch()

    useEffect(() => {
        fetch('/api/user/get-user')
            .then(async (res) => {
                let data = await res.json()
                dispatch(setAllUserData(data))
            })
    }, [])

    function confirmContentsHandler(opts){
        setConfirmContent(opts)
    }

    function popupContentHandler(opts){
        setPopupContent(opts)
    }

    return (
        <div>
            {Confirm(confirmContent)}
            {Popup(popupContent)}
            <div className={style["user-table"]}>
                <UserTable  confirmContentHandler={confirmContentsHandler} popupContentHandler={popupContentHandler} userInfo={userInfo}/>
            </div>
        </div>
    )
}