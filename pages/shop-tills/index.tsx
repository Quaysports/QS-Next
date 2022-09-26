import Menu from "../../components/menu/menu";
import ShopTabs from "./tabs";
import {useRouter} from "next/router";
import QuickLinks from "./quick-links";
import {getQuickLinks} from "../../server-modules/shop/shop";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {updateQuickLinks} from "../../store/shop-tills/quicklinks";
import {getItems} from "../../server-modules/items/items";

export default function ShopTills({links, search}){
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(()=>{
        console.log(links)
        dispatch(updateQuickLinks(links))
    },[links])

    return (
        <div className={"fullscreen-layout"}>
            <Menu tabs={<ShopTabs />}/>
            {router.query.tab === "quick-links" ? <QuickLinks links={links} search={search}/> : null}
        </div>
    )
}

export async function getServerSideProps(){
    const links = JSON.parse(JSON.stringify(await getQuickLinks()))
    const search = JSON.parse(JSON.stringify(await getItems({},{SKU:1,TITLE:1},{SKU:1})))
    return {props:{links:links, search:search}}
}