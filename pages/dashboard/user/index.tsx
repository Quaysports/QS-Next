import {useEffect} from "react";
import style from './user.module.css'
import {useDispatch, useSelector} from "react-redux";
import {selectUsers, setAllUserData} from "../../../store/dashboard/user-slice";
import UserTable from "./user-table";

export default function UserLandingPage() {

    const userInfo = useSelector(selectUsers)
    const dispatch = useDispatch()

    useEffect(() => {
        fetch('/api/user/get-user')
            .then(async (res) => {
                let data = await res.json()
                dispatch(setAllUserData(data))
            })
    }, [])

    return (
        <>
            <div className={style["user-table"]}>
                <UserTable userInfo={userInfo}/>
            </div>
        </>
    )
}