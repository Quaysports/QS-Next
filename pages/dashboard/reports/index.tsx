import {useRouter} from "next/router";
import OnlineReports from "./online-reports/online-reports";
import ShopReports from "./shop-reports/shop-reports";
import SidebarOneColumn from "../../../components/layouts/sidebar-one-column";
import ColumnLayout from "../../../components/layouts/column-layout";
import Sidebar from "./sidebar";

export default function ReportsTab() {

    const router = useRouter()

    return (
        <>
            <SidebarOneColumn>
                <Sidebar/>
                <ColumnLayout background={false} scroll={true}>
                    {router.query.location === undefined || router.query.location === "shop" ? <ShopReports/> : null}
                    {router.query.location === "online" ? <OnlineReports/> : null}
                </ColumnLayout>
            </SidebarOneColumn>
        </>
    )
}