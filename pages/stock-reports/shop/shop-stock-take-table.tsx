import {selectBrandItems} from "../../../store/stock-reports-slice";
import {useSelector} from "react-redux";
import ShopStockTakeRow from "./shop-stock-take-row";
import SearchBar from "../../../components/search-bar";
import {useEffect, useState} from "react";
import styles from './shop-stock-take.module.css'
import CSVButton from "../../../components/csv-button";

export default function ShopStockTakeTable(){
    const brandItems = useSelector(selectBrandItems)
    const [activeItems, setActiveItems] = useState(brandItems)

    useEffect(()=>{
        setActiveItems(brandItems)
    },[brandItems])

    const handler = (arr)=>{
        setActiveItems(arr)
    }

    function buildList(){

        const csvObject = []

        let elements = [
            <div key={"top-bar"} className={styles["top-bar"]}>
                <SearchBar arrHandler={handler} searchableArray={brandItems} EAN={true}/>
                <div><CSVButton objectArray={csvObject}/></div>
                <div><button>Commit</button></div>
            </div>,
            <ShopStockTakeRow key={"stock-take"}/>
        ]
        if(!activeItems) return null
        for(const item of activeItems) {csvObject.push({SKU:item.SKU, TITLE:item.TITLE, Stock:item.STOCKTOTAL, Actual:""})}
        for(const item of activeItems) elements.push(<ShopStockTakeRow key={item.SKU} item={item}/>)
        return elements
    }

    return(
        <>{buildList()}</>
    )
}