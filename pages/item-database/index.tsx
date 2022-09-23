import Menu from "../../components/menu/menu";
import ItemDatabaseTabs from "./tabs";
import ItemDatabaseLandingPage from "./item-database";
import {useRouter} from "next/router";
import RodLocationsLandingPage from "./rod-locations";
import styles from "./item-database.module.css"

export default function itemDatabaseLandingPage(){

    const router = useRouter()

    return(
        <div className={styles["item-database-parent"]}>
            <Menu tabs={<ItemDatabaseTabs/>}/>
            {router.query.tab === "item-database" ? <ItemDatabaseLandingPage/> : null}
            {router.query.tab === "rod-locations" ? <RodLocationsLandingPage/> : null}
        </div>
    )
}
