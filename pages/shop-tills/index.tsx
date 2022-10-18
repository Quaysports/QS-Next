import Menu from "../../components/menu/menu";
import ShopTabs from "./tabs";
import {useRouter} from "next/router";
import QuickLinks from "./quick-links";
import {getQuickLinks} from "../../server-modules/shop/shop";
import {updateQuickLinks} from "../../store/shop-tills/quicklinks-slice";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import {appWrapper} from "../../store/store";

/**
 * Shop Tills landing page and routing
 */
export default function ShopTills() {
    const router = useRouter()

    return (
        <>
            {router.query.tab === undefined ? <SidebarOneColumn><Menu><ShopTabs/></Menu></SidebarOneColumn> : null}
            {router.query.tab === "quick-links" ? <SidebarOneColumn><Menu><ShopTabs/></Menu><QuickLinks/></SidebarOneColumn> : null}
        </>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async(context)=>{
    if(context.query.tab === "quick-links"){
        const data = await getQuickLinks()
        if(data) await store.dispatch(updateQuickLinks(data))
    }
    return {props:{}}
})