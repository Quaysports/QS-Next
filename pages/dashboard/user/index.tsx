import {useSelector} from "react-redux";
import {selectUsers} from "../../../store/dashboard/user-slice";
import UserTable from "./user-table";
import ColumnLayout from "../../../components/layouts/column-layout";

/**
 * Dashboard User tab.
 */
export default function UserTab() {

    const userInfo = useSelector(selectUsers)

    return (
        <ColumnLayout scroll={true} maxWidth={"fit-content"}>
                <UserTable userInfo={userInfo}/>
        </ColumnLayout>
    )
}