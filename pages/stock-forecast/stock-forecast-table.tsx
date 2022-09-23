import styles from './stock-forecast.module.css'
import {timeSpan} from "./process-data";
import StockForecastCell from "./stock-forecast-cell";

export default function StockForecastTable({items}){

    const listItems = buildList(items)
    const titleMonths = timeSpan()
    let monthsEle = []
    for(let v of titleMonths.months){
        monthsEle.push(<div>{v.monthText}</div>)
    }

    return (
        <>
            <div className={styles["forecast-table"]}>
                <div key="title-row" className={styles["forecast-row"]}>
                    <div>H</div>
                    <div>L</div>
                    <div>SKU</div>
                    <div>Stock</div>
                    <div>On Order</div>
                    {monthsEle}
                </div>
                {listItems}
            </div>
        </>
    )
}

function buildList(items){
    let elementArray = []
    for(let item of items) {
        let monthStockLevels = []
        for(let i in item.months){
            monthStockLevels.push(<StockForecastCell style={item.months[i].style} />)
        }
        elementArray.push(
            <div key={item.SKU} className={styles["forecast-row"]}>
                <div><input type={"checkbox"}/></div>
                <div><input type={"checkbox"}/></div>
                <div>{item.SKU}</div>
                <div>{item.stock}</div>
                <div>{item.onOrder?.total}</div>
                {monthStockLevels}
            </div>
        )
    }
    console.log(items)
    return elementArray
}


