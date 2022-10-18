import styles from "../item-database.module.css";
import DatabaseSearchBar, {DatabaseSearchItem} from "../../../components/database-search-bar/database-search";
import SideBar from "./sidebar";
import ItemDetails from "./item-details";
import {useSelector} from "react-redux";
import {selectItem} from "../../../store/item-database/item-database-slice";
import {useEffect} from "react";
import {useRouter} from "next/router";

/**
 * Item Database Tab
 */
export default function ItemDatabaseLandingPage() {

    const item = useSelector(selectItem)

    const router = useRouter()

    function searchOptions(options:DatabaseSearchItem) {
        router.push({pathname: router.pathname ,query:{...router.query, sku:options.SKU}})
    }

    return (
        <>
            <div className={styles["search-bar-container"]}><DatabaseSearchBar handler={(x) => searchOptions(x)}/></div>
            {item ? <SideBar/> : null}
            {item ? <ItemDetails/> : null}
        </>
    )
}