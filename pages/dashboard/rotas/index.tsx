import SidebarOneColumn from "../../../components/layouts/sidebar-one-column";
import ColumnLayout from "../../../components/layouts/column-layout";
import Sidebar from "./sidebar";
import PublishedRotaList from "./published-rota-list";

export default function RotasTab() {
    return (
        <SidebarOneColumn>
            <Sidebar/>
            <ColumnLayout background={false} scroll={true}>
                <PublishedRotaList/>
            </ColumnLayout>
        </SidebarOneColumn>
    )
}