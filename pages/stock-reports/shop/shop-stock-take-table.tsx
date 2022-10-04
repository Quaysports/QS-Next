import {BrandItem, selectBrandItems, setStockTakeInfo} from "../../../store/stock-reports-slice";
import {useDispatch, useSelector} from "react-redux";
import ShopStockTakeRow from "./shop-stock-take-row";
import SearchBar, {SearchItem} from "../../../components/search-bar";
import {useEffect, useState} from "react";
import styles from './shop-stock-take.module.css'
import CSVButton from "../../../components/csv-button";

export default function ShopStockTakeTable(){

    const dispatch = useDispatch()
    const brandItems = useSelector(selectBrandItems)
    const [activeItems, setActiveItems] = useState<BrandItem[]>(brandItems)

    useEffect(()=>{
        setActiveItems(brandItems)
        console.log(brandItems)
    },[brandItems])
2
    const handler = (arr:SearchItem[])=>{
        setActiveItems(arr as BrandItem[])
    }



    function buildList(){

        const commitChecked = () =>{
            for(const index in activeItems){
                if(activeItems[index].stockTake?.checked){
                    let stockTakeUpdate = {...activeItems[index].stockTake}
                    stockTakeUpdate.date = (new Date).toString()
                    dispatch(setStockTakeInfo({index:Number(index),data:stockTakeUpdate}))
                }
            }
        }

        const csvObject:{SKU:string, TITLE:string,Stock:number,Actual:string}[] = []

        let elements = [
            <div key={"top-bar"} className={styles["top-bar"]}>
                <SearchBar resultHandler={handler} searchableArray={brandItems} EAN={true}/>
                <div><CSVButton objectArray={csvObject}/></div>
                <div><button onClick={()=>commitChecked()}>Commit</button></div>
            </div>,
            <ShopStockTakeRow key={"stock-take"}/>
        ]
        if(!activeItems) return null
        for(const index in activeItems) {
            if(!activeItems[index].stockTake?.date) csvObject.push({
                SKU:activeItems[index].SKU,
                TITLE:activeItems[index].TITLE,
                Stock:activeItems[index].STOCKTOTAL,
                Actual:""
            })
        }
        for(const index in activeItems){
            elements.push(<ShopStockTakeRow key={activeItems[index].SKU} index={index} item={activeItems[index]}/>)
        }
        return elements
    }

    return(
        <>{buildList()}</>
    )
}