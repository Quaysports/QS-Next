import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectUsers, setAllUserData} from "../../../store/dashboard/user-slice";
import UserTable from "./user-table";
import ColumnLayout from "../../../components/layouts/column-layout";

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
        <ColumnLayout scroll={true} maxWidth={"fit-content"}>
                <UserTable userInfo={userInfo}/>
        </ColumnLayout>
    )
}