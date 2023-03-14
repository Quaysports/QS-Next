import Menu from "../../components/menu/menu";
import ItemDatabaseTabs from "./tabs";
import ItemDatabaseLandingPage from "./item-database";
import {useRouter} from "next/router";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import SearchbarSidebarOneColumn from "../../components/layouts/searchbar-sidebar-one-column";
import {appWrapper} from "../../store/store";
import {setItem, setSuppliers, setTags} from "../../store/item-database/item-database-slice";
import {
    getAllSuppliers,
    getAllBrands,
    getItem,
    getLinkedItems,
    getTags
} from "../../server-modules/items/items";
import NewItems from "./new-items";
import {
    setNewItemsBrands,
    setNewItemSuppliers,
    setNewItemAllTags,
    addNewItem
} from "../../store/item-database/new-items-slice";
import NewItemsSideBar from "./new-items/new-items-sidebar";


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
            {router.query.tab === "new-items" ?
                <>
                    <SidebarOneColumn>
                        <Menu><ItemDatabaseTabs/></Menu>
                        <NewItemsSideBar/>
                        <NewItems/>
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
    if(context.query.tab === 'new-items'){
        const suppliers = await getAllSuppliers()
        store.dispatch(setNewItemSuppliers(suppliers))
        let tags = await getTags()
        let sortedTags = tags ? tags: []
        store.dispatch(setNewItemAllTags(sortedTags))
        if(context.query.supplier){
            const brands:string[] = await getAllBrands({})
            store.dispatch(setNewItemsBrands(brands))
            store.dispatch(addNewItem(context.query.supplier as string))
        }
    }

    if(context.query.tab === "item-database" || context.query.tab === undefined){
        let tags = await getTags()
        let sortedTags = tags ? tags: []
        store.dispatch(setTags(sortedTags))
    }

    return {props: {}}
})