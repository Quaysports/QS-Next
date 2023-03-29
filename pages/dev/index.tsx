import OneColumn from "../../components/layouts/one-column";
import Menu from "../../components/menu/menu";
import ColumnLayout from "../../components/layouts/column-layout";
import {useSelector} from "react-redux";
import {selectUser} from "../../store/session-slice";
import Geoff from "./geoff";
import Richard from "./richard";
import Joshua from "./joshua";
import Craig from "./craig";

export default function DevPage() {
    const user = useSelector(selectUser)

    return (
        <OneColumn>
            <Menu><></></Menu>
            <ColumnLayout>
                {user?.username === "Geoff" ? <Geoff/> : <></>}
                {user?.username === "Richard" ? <Richard/> : <></>}
                {user?.username === "Craig" ? <Craig/> : <></>}
                {user?.username === "Joshua" ? <Joshua/> : <></>}
            </ColumnLayout>
        </OneColumn>
    )
}