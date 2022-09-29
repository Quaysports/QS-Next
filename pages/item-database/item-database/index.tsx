import styles from "../item-database.module.css";
import DatabaseSearchBar, {searchResult} from "../../../components/database-search-bar/DatabaseSearch";
import SideBar from "./sidebar";
import ItemDetails from "./item-details";
import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItem} from "../../../store/item-database/item-database-slice";

export default function ItemDatabaseLandingPage() {

    const dispatch = useDispatch()
    const item = useSelector(selectItem)

    function searchOptions(options:searchResult) {
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
            },
            body:JSON.stringify({SKU: options.SKU})
        }
        fetch("/api/item-database/get-item-details", opts)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                dispatch(setItem(res))

            })
    }

    return (
        <>
            <div className={styles["search-bar-container"]}><DatabaseSearchBar handler={(x) => searchOptions(x)}/></div>
            {item ? <SideBar/> : null}
            {item ? <ItemDetails/> : null}
        </>
    )
}