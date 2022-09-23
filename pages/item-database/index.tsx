import Menu from "../../components/menu/menu";
import ItemDatabaseTabs from "./tabs";
import ItemDatabaseLandingPage from "./item-database";
import {useRouter} from "next/router";
import RodLocationsLandingPage from "./rod-locations";
import PostageLandingPage from "./postage";
import BrandedLabelsLandingPage from "./branded-labels";

export default function itemDatabaseLandingPage(){

    const router = useRouter()

    return(
        <div>
            <Menu tabs={<ItemDatabaseTabs/>}/>
            {router.query.tab === "item-database" ? <ItemDatabaseLandingPage/> : null}
            {router.query.tab === "rod-locations" ? <RodLocationsLandingPage/> : null}
            {router.query.tab === "postage" ? <PostageLandingPage/> : null}
            {router.query.tab === "branded-labels" ? <BrandedLabelsLandingPage/> : null}
        </div>
    )
}
