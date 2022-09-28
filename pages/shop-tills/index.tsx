import Menu from "../../components/menu/menu";
import ShopTabs from "./tabs";
import {useRouter} from "next/router";
import QuickLinks from "./quick-links";
import {getQuickLinks} from "../../server-modules/shop/shop";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {updateQuickLinks} from "../../store/shop-tills/quicklinks-slice";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";

export default function ShopTills({links}) {
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        console.log(links)
        dispatch(updateQuickLinks(links))
    }, [links])

    return (
        <>
            {router.query.tab === "quick-links" ?
                <SidebarOneColumn><Menu tabs={<ShopTabs/>}/><QuickLinks links={links}/></SidebarOneColumn> : <SidebarOneColumn><Menu tabs={<ShopTabs/>}/></SidebarOneColumn>}
        </>
    )
}

export async function getServerSideProps() {
    const links = JSON.parse(JSON.stringify(await getQuickLinks()))
    return {props: {links: links}}
}