import Menu from "../../components/menu/menu";
import ShopTabs from "./tabs";
import {useRouter} from "next/router";
import QuickLinks from "./quick-links";
import {getPickList, getQuickLinks} from "../../server-modules/shop/shop";
import {updateQuickLinks} from "../../store/shop-tills/quicklinks-slice";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import {appWrapper} from "../../store/store";
import ColumnLayout from "../../components/layouts/column-layout";
import OneColumn from "../../components/layouts/one-column";
import PickList from "./pick-list";
import {updatePickList} from "../../store/shop-tills/pick-list-slice";

/**
 * Shop Tills landing page and routing
 */
export default function ShopTills() {
    const router = useRouter()

    return (
        <>
            {router.query.tab === undefined || router.query.tab === "pick-list" ?
                <OneColumn><Menu><ShopTabs/></Menu><ColumnLayout scroll={true} height={50}><PickList/></ColumnLayout></OneColumn> : null}
            {router.query.tab === "quick-links" ? <SidebarOneColumn><Menu><ShopTabs/></Menu><QuickLinks/></SidebarOneColumn> : null}
        </>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async(context)=>{
    if(context.query.tab === "quick-links"){
        const data = await getQuickLinks()
        if(data) await store.dispatch(updateQuickLinks(data))
    }

    if(
        (context.query.tab === undefined || context.query.tab === "pick-list")
        && context.query.date !== undefined
    ){
        const data = await getPickList(Number(context.query.date as string))
        if(data) await store.dispatch(updatePickList(data))
    }

    return {props:{}}
})