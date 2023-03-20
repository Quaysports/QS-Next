import UserTable from "./user-table";
import ColumnLayout from "../../../components/layouts/column-layout";
/**
 * Dashboard User tab.
 */
export default function UserTab() {

    return (
        <ColumnLayout background={false} scroll={true} maxWidth={"fit-content"}>
                <UserTable/>
        </ColumnLayout>
    )
}