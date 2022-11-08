import {StockForecastChecks, StockForecastItem, timeSpan} from "../../server-modules/stock-forecast/process-data";
import StockForecastCell from "./stock-forecast-cell";
import styles from "./stock-forecast.module.css";
import OnOrderCell from "./on-order-cell";
import StockTotalCell from "./stock-total-cell";
import SkuCell from "./sku-cell";
import {itemCheckboxChange, selectRenderedItems} from "../../store/stock-forecast-slice";
import {useDispatch, useSelector} from "react-redux";
import {ChangeEvent} from "react";

export function TitleRow() {
    const titleMonths = timeSpan()
    let monthsEle = []
    for (let v of titleMonths) {
        monthsEle.push(<div key={v.year + "-" + v.monthText} className={styles["month-cell"]}>{v.monthText}</div>)
    }
    return (
        <div className={`${styles.row} ${styles["title-row"]}`}>
            <div className={styles.details}>
                <div>H</div>
                <div>L</div>
                <div>SKU</div>
                <div>Stock</div>
                <div>On Order</div>
            </div>
            <div className={styles.months}>
                {monthsEle}
            </div>
        </div>
    )
}

export default function ItemRow() {

    const dispatch = useDispatch()
    const items = useSelector(selectRenderedItems)
    if (!items || items.length == 0) return null

    const handleCheckChange = (e: ChangeEvent<HTMLInputElement>, item: StockForecastItem, type: keyof StockForecastChecks) => {
        dispatch(itemCheckboxChange({type:type, index:item.rowId, check:e.target.checked}))
    }

    let elementArray = [<TitleRow key={"title-row"}/>]

    for (let i in items) {
        let item = items[i]
        let monthStockLevels = []
        for (let index in item?.months) {
            monthStockLevels.push(<StockForecastCell key={index} item={items[i]} index={Number(index)}/>)
        }

        elementArray.push(
            <div id={item?.rowId.toString()} key={item?.SKU+"-"+Date.now()} className={styles["row"]}>
                <div className={styles.details}>
                    <div><input
                        type={"checkbox"}
                        checked={item?.CHECK?.SF?.HIDE}
                        onChange={e => handleCheckChange(e, item, "HIDE")}/></div>
                    <div><input
                        type={"checkbox"}
                        checked={item.CHECK?.SF?.LIST}
                        onChange={e => handleCheckChange(e, item, 'LIST')}/></div>
                    <SkuCell item={item}/>
                    <StockTotalCell item={item}/>
                    <OnOrderCell item={item}/>
                </div>
                <div className={styles.months}>
                    {monthStockLevels}
                </div>
            </div>
        )
    }
    return <>{elementArray}</>
}