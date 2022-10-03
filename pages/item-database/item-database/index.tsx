import styles from "../item-database.module.css";
import DatabaseSearchBar, {SearchResult} from "../../../components/database-search-bar/database-search";
import SideBar from "./sidebar";
import ItemDetails from "./item-details";
import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItem, setSuppliers} from "../../../store/item-database/item-database-slice";
import {useEffect} from "react";

export default function ItemDatabaseLandingPage() {

    const dispatch = useDispatch()
    const item = useSelector(selectItem)

    useEffect(() => {
        fetch("/api/item-database/get-suppliers")
            .then(res => res.json())
            .then(res => {
                dispatch(setSuppliers(res))
            })

    }, [])

    function searchOptions(options:SearchResult) {
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
            },
            body:JSON.stringify({filter: {SKU:options.SKU}})
        }
        fetch("/api/items/get-item", opts)
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