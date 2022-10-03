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
import {getItem, getItems} from "../../server-modules/items/items";
import {InferGetServerSidePropsType} from "next";

export interface rodLocationObject {
    BRANDLABEL:{loc:string},
    IDBEP:{BRAND:string},
    SKU:string,
    TITLE:string
}

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
                        <RodLocationsLandingPage rodLocations={rodLocations}/>
                    </SidebarOneColumn>
                </> : null}
        </>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async (context) => {

    let sku = context.query.sku
    let item = await getItem({SKU: sku})
    store.dispatch(setItem(item))
    let suppliers = await getSuppliers()
    store.dispatch(setSuppliers(suppliers))

    let query = {"BRANDLABEL.loc": {$exists: true, $ne: ""}}
    let projection = {SKU: 1, TITLE: 1, "IDBEP.BRAND": 1, "BRANDLABEL.loc": 1}

    let rodLocations = await getItems({query}, {projection}) as rodLocationObject[]
    let sortedData = rodLocations.sort((a, b) => {
        if (!a.IDBEP.BRAND) a.IDBEP.BRAND = "Default"
        if (!b.IDBEP.BRAND) b.IDBEP.BRAND = "Default"
        return a.IDBEP.BRAND.localeCompare(b.IDBEP.BRAND)
    })

    let tempMap:Map<string,rodLocationObject[]> = new Map()
    sortedData?.map((item) => {
        tempMap.has(item.IDBEP.BRAND) ?
            tempMap.get(item.IDBEP.BRAND)!.push(item) : tempMap.set(item.IDBEP.BRAND, [item])
    })

    return {props: {rodLocations: tempMap}}
})