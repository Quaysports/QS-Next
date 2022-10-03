import styles from "../item-database.module.css";
import DatabaseSearchBar, {searchResult} from "../../../components/database-search-bar/DatabaseSearch";
import SideBar from "./sidebar";
import ItemDetails from "./item-details";
import {useSelector} from "react-redux";
import {selectItem} from "../../../store/item-database/item-database-slice";
import {useEffect} from "react";
import {useRouter} from "next/router";

export default function ItemDatabaseLandingPage() {

    const item = useSelector(selectItem)
    useEffect(()=>{
        console.log(item)
    },[item])

    const router = useRouter()

    function searchOptions(options:searchResult) {
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