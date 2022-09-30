import {selectBrandItems} from "../../../store/stock-reports-slice";
import {useSelector} from "react-redux";
import ShopStockTakeRow from "./shop-stock-take-row";
import SearchBar from "../../../components/search-bar";
import {useEffect, useState} from "react";
import styles from './shop-stock-take.module.css'

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
        let elements = [
            <div className={styles["top-bar"]}>
                <SearchBar arrHandler={handler} searchableArray={brandItems} EAN={true}/>
                <div><button>CSV</button></div>
                <div><button>Commit</button></div>
            </div>,
            <ShopStockTakeRow />
        ]
        if(!activeItems) return null
        for(const item of activeItems) elements.push(<ShopStockTakeRow item={item}/>)
        return elements
    }

    return(
        <>{buildList()}</>
    )
}