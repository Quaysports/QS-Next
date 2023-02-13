import Menu from "../../components/menu/menu";
import ItemDatabaseTabs from "./tabs";
import ItemDatabaseLandingPage from "./item-database";
import {useRouter} from "next/router";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import SearchbarSidebarOneColumn from "../../components/layouts/searchbar-sidebar-one-column";
import {appWrapper} from "../../store/store";
import {setItem, setSuppliers, setTags} from "../../store/item-database/item-database-slice";
import {getAllSuppliers, getItem, getLinkedItems, getTags} from "../../server-modules/items/items";


export type rodLocationObject = {
    BRANDLABEL:{loc:string},
    IDBEP:{BRAND:string},
    SKU:string,
    TITLE:string
}

/**
 * Item Database Landing Page
 */
export default function ItemDatabase() {

    const router = useRouter()
    return (
        <>
            {router.query.tab === undefined || router.query.tab === "item-database" ?
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
                        <div></div>
                    </SidebarOneColumn>
                </> : null}
        </>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async (context) => {

    if(context.query.sku) {
        let sku = context.query.sku
        let item = await getItem({SKU: sku})
        if(item) item.linkedSKUS = await getLinkedItems(sku as string)

        store.dispatch(setItem(item))
        let suppliers = await getAllSuppliers()
        store.dispatch(setSuppliers(suppliers))
    }

    if(context.query.tab === "new-items" || context.query.tab === "item-database" || context.query.tab === undefined){
        let tags = await getTags()
        let sortedTags = tags ? tags: []
        store.dispatch(setTags(sortedTags))
    }

    return {props: {}}
})