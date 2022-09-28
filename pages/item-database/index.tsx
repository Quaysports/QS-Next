import Menu from "../../components/menu/menu";
import ItemDatabaseTabs from "./tabs";
import ItemDatabaseLandingPage from "./item-database";
import {useRouter} from "next/router";
import RodLocationsLandingPage from "./rod-locations";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import SearchbarSidebarOneColumn from "../../components/layouts/searchbar-sidebar-one-column";

export default function itemDatabaseLandingPage() {

    const router = useRouter()

    return (
        <>

            {router.query.tab === undefined || router.query.tab ===  "item-database" ?
                <>
                    <SearchbarSidebarOneColumn>
                    <Menu tabs={<ItemDatabaseTabs/>}/>
                    <ItemDatabaseLandingPage/>
                    </SearchbarSidebarOneColumn>
                </> : null}
            {router.query.tab === "rod-locations" ?
                <>
                    <SidebarOneColumn>
                        <Menu tabs={<ItemDatabaseTabs/>}/>
                        <RodLocationsLandingPage/>
                    </SidebarOneColumn>
                </> : null}
        </>
    )
}
