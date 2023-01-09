import Menu from "../../components/menu/menu";
import ItemDatabaseTabs from "./tabs";
import ItemDatabaseLandingPage from "./item-database";
import {useRouter} from "next/router";
import RodLocationsLandingPage from "./rod-locations";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import SearchbarSidebarOneColumn from "../../components/layouts/searchbar-sidebar-one-column";
import {appWrapper} from "../../store/store";
import {setItem, setSuppliers, setTags} from "../../store/item-database/item-database-slice";
import {getAllSuppliers, getItem, getItems, getLinkedItems, getTags} from "../../server-modules/items/items";
import {InferGetServerSidePropsType} from "next";

export type rodLocationObject = {
    BRANDLABEL:{loc:string},
    IDBEP:{BRAND:string},
    SKU:string,
    TITLE:string
}

/**
 * Item Database Landing Page
 */
export default function itemDatabaseLandingPage({rodLocations}:InferGetServerSidePropsType<typeof getServerSideProps>) {

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
                        <RodLocationsLandingPage />
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

    let query = {"BRANDLABEL.loc": {$exists: true, $ne: ""}}
    let projection = {SKU: 1, TITLE: 1, "IDBEP.BRAND": 1, "BRANDLABEL.loc": 1}

    let rodLocations = await getItems(query, projection) as rodLocationObject[]
    let sortedData:rodLocationObject[] = rodLocations?.sort((a, b) => {
        if (!a.IDBEP.BRAND) a.IDBEP.BRAND = "Default"
        if (!b.IDBEP.BRAND) b.IDBEP.BRAND = "Default"
        return a.IDBEP.BRAND.localeCompare(b.IDBEP.BRAND)
    })

    return {props: {rodLocations: sortedData}}
})