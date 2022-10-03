import Menu from "../../components/menu/menu";
import ShopTabs from "./tabs";
import {useRouter} from "next/router";
import QuickLinksSetup from "./quick-links";
import {getQuickLinks} from "../../server-modules/shop/shop";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {updateQuickLinks} from "../../store/shop-tills/quicklinks-slice";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import {InferGetServerSidePropsType} from "next";

export default function ShopTills({links}:InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        console.log(links)
        dispatch(updateQuickLinks(links))
    }, [links])

    return (
        <>
            {router.query.tab === undefined ? <SidebarOneColumn><Menu><ShopTabs/></Menu></SidebarOneColumn> : null}
            {router.query.tab === "quick-links" ? <SidebarOneColumn><Menu><ShopTabs/></Menu><QuickLinksSetup links={links}/></SidebarOneColumn> : null}
        </>
    )
}

export async function getServerSideProps<GetServerSideProps>() {
    const links = await getQuickLinks()
    return {props: {links: links}}
}