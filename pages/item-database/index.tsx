import Menu from "../../components/menu/menu";
import ItemDatabaseTabs from "./tabs";
import ItemDatabaseLandingPage from "./item-database";
import {useRouter} from "next/router";
import RodLocationsLandingPage from "./rod-locations";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import SearchbarSidebarOneColumn from "../../components/layouts/searchbar-sidebar-one-column";
import {appWrapper} from "../../store/store";
import {getSuppliers} from "../../server-modules/shop/shop-order-tool";
import {setItem, setSuppliers} from "../../store/item-database/item-database-slice";
import {getItem} from "../../server-modules/items/items";

export default function itemDatabaseLandingPage() {

    const router = useRouter()

    return (
        <>
            {router.query.tab === undefined || router.query.tab ===  "item-database" ?
                <>
                    <SearchbarSidebarOneColumn>
                    <Menu><ItemDatabaseTabs/></Menu>
                    <ItemDatabaseLandingPage/>
                    </SearchbarSidebarOneColumn>
                </> : null}
            {router.query.tab === "rod-locations" ?
                <>
                    <SidebarOneColumn>
                        <Menu><ItemDatabaseTabs/></Menu>
                        <RodLocationsLandingPage/>
                    </SidebarOneColumn>
                </> : null}
        </>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store=>async(context)=>{
    let sku = context.query.sku
    let item = await getItem({SKU:sku})
    store.dispatch(setItem(item))
    let suppliers = await getSuppliers()
    store.dispatch(setSuppliers(suppliers))
    return {props:{}}
})