import {
    BrandItem,
    selectBrandItems, setStockLevel,
    setStockTakeInfo, updateStockTakes
} from "../../../store/stock-reports-slice";
import {useDispatch, useSelector} from "react-redux";
import ShopStockTakeRow from "./shop-stock-take-row";
import SearchBar, {SearchItem} from "../../../components/search-bar";
import {useEffect, useState} from "react";
import styles from './shop-stock-take.module.css'
import CSVButton from "../../../components/csv-button";
import StockTake = schema.StockTake;

export default function ShopStockTakeTable() {

    const dispatch = useDispatch()
    const brandItems = useSelector(selectBrandItems)
    const [activeItems, setActiveItems] = useState<BrandItem[]>(brandItems)

    useEffect(() => {
        setActiveItems(brandItems)
    }, [brandItems])

    const handler = (arr: SearchItem[]) => setActiveItems(arr as BrandItem[])

    const checkAll = () => {
        let bulkUpdate:StockTake[] = []

        let count = brandItems.reduce((acc,item)=>{
            item.stockTake?.checked ? acc++ : acc--
            return acc
        },0)

        for(let item of brandItems){
            let stockTake = {...item.stockTake}
            stockTake ??= {checked:false, date:null, quantity:0}
            if(!stockTake?.date) stockTake.checked = count <= 0;
            bulkUpdate.push(stockTake)
        }
        dispatch(updateStockTakes(bulkUpdate))
    }

    const commitChecked = () => {
        const linnUpdate:{SKU:string, QTY:number}[] = []
        for (const index in activeItems) {
            if (!activeItems[index].stockTake?.checked || activeItems[index].stockTake?.date) continue;

            if(activeItems[index].stockTake!.quantity || activeItems[index].stockTake!.quantity === 0){
                let change = activeItems[index].stockTake!.quantity! - activeItems[index].stock.total
                linnUpdate.push({SKU:activeItems[index].SKU, QTY:change})
            }

            let stockTakeUpdate = {...activeItems[index].stockTake}
            stockTakeUpdate.date = (new Date).toString()

            dispatch(setStockTakeInfo({index: Number(index), data: stockTakeUpdate}))
        }

        let opts = {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:"Stock Take Update", data:linnUpdate})}

        fetch("/api/linnworks/update-stock-levels", opts).then(async res => {
            let json = await res.json()
            dispatch(setStockLevel(json))
        })
    }

    const csvObject: { SKU: string, TITLE: string, Stock: number, Actual: string }[] = []

    let elements = [
        <div data-testid={"table-top-row"} key={"top-bar"} className={styles["top-bar"]}>
            <SearchBar resultHandler={handler} searchableArray={brandItems} EAN={true}/>
            <div><CSVButton objectArray={csvObject}/></div>
            <div>
                <button onClick={checkAll}>Check All</button>
            </div>
            <div>
                <button onClick={() => commitChecked()}>Commit</button>
            </div>
        </div>,
        <ShopStockTakeRow key={"stock-take"}/>
    ]

    if (!activeItems) return null

    for (const index in activeItems) {
        if (activeItems[index].stockTake?.date) continue;

        csvObject.push({
            SKU: activeItems[index].SKU,
            TITLE: activeItems[index].title,
            Stock: activeItems[index].stock.total,
            Actual: ""
        })
    }

    for (const index in activeItems) {
        elements.push(<ShopStockTakeRow key={activeItems[index].SKU} index={index} item={activeItems[index]}/>)
    }

    return (
        <>{elements}</>
    )
}