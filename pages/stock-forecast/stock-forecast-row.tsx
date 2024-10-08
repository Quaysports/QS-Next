import StockForecastCell from "./stock-forecast-cell";
import styles from "./stock-forecast.module.css";
import OnOrderCell from "./on-order-cell";
import StockTotalCell from "./stock-total-cell";
import SkuCell from "./sku-cell";
import {itemCheckboxChange, selectMaxThreshold, selectSearchItems,} from "../../store/stock-forecast-slice";
import {useDispatch, useSelector} from "react-redux";
import {StockForecastItem} from "./index";

export default function StockForecastTable() {

    const items = useSelector(selectSearchItems)

    const threshold = useSelector(selectMaxThreshold)
    if (!items || items.length == 0) return null

    let elementArray = [<TitleRow key={"title-row"}/>]

    for (let i in items) {
        if(Number(i) <= threshold) elementArray.push(<ItemRow key={items[i].SKU} item={items[i]}/>)
    }

    return <div>{elementArray}</div>
}


function TitleRow() {

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const currentMonth = new Date().getMonth()
    let currentYear = new Date().getFullYear()

    let monthsEle = []
    for (let m = currentMonth; m < currentMonth + 24; m++) {
        let month = m % 12
        if (month === 0) currentYear++
        monthsEle.push(<div style={{borderLeft: month === 0 ? "4px solid var(--primary-background)" : ""}} key={currentYear + "-" + month} className={styles["month-cell"]}>{months[month]}</div>)
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

export interface CellFlags {
    band: string
    date:Date
    orders: Date[],
    historicOOSDate: Date | undefined,
    oneMonthOOSDate: Date | undefined,
    oneMonthOOSTriggered: boolean,
    fourMonthOOSDate: Date | undefined,
    fourMonthOOSTriggered: boolean,
    historicOrder: boolean,
    outOfStockGap: boolean
}

function ItemRow({item}: { item: StockForecastItem }) {

    const dispatch = useDispatch()

    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()

    const handleCheckChange = (type: "hide" | "list", item: StockForecastItem, value: boolean) => {
        let newItem = structuredClone(item)
        newItem.checkboxStatus.stockForecast[type] = value
        dispatch(itemCheckboxChange(newItem))
    }

    const {hide, list} = item.checkboxStatus.stockForecast
    let monthStockLevels = []
    let stock = item.stock.total
    const historicOOSDate = new Date(item.stockConsumption.historicOutOfStock)
    const oneMonthOOSDate = new Date(item.stockConsumption.oneMonthOutOfStock)
    const fourMonthOOSDate = new Date(item.stockConsumption.fourMonthOutOfStock)
    let historicOrder = false
    let oneMonthOOSTriggered = false
    let fourMonthOOSTriggered = false
    let outOfStockGap = false

    let year = new Date().getFullYear()
    
    // handles historic orders i.e. overdue orders yet to arrive
    for(let order of item.onOrder){
        const orderDueDate = new Date(order.due)
        const currentDate = new Date()
        if(orderDueDate < currentDate && (orderDueDate.getFullYear() === year - 1 && orderDueDate.getMonth() > currentDate.getMonth() || orderDueDate.getFullYear() === year && orderDueDate.getMonth() < currentDate.getMonth())) {
            stock += order.quantity
            historicOrder = true
        }
    }

    for (let m = currentMonth; m < currentMonth + 24; m++) {
        if(m % 12 === 0 && m !== 0) year++
        let band = m < currentMonth + 6
            ? "#BB1E10"
            : m < currentMonth + 9
                ? "#F7B500"
                : "#32A431"

        let date = new Date(year, m, 1)
        let cellFlags:CellFlags = {
            band: band,
            date: date,
            orders:[],
            historicOOSDate: undefined,
            oneMonthOOSDate: undefined,
            oneMonthOOSTriggered: false,
            fourMonthOOSDate:undefined,
            fourMonthOOSTriggered: false,
            historicOrder: historicOrder,
            outOfStockGap: outOfStockGap
        }

        // handles orders due to arrrive 
        for(let order of item.onOrder){
            let orderDueDate = new Date(order.due)
            const isDueThisYear = orderDueDate.getMonth() === m && orderDueDate.getFullYear() === year
            const isDueNextYear = orderDueDate.getMonth() + 12 === m && orderDueDate.getFullYear() === year
            const isDueInTwoYears = orderDueDate.getMonth() + 24 === m && orderDueDate.getFullYear() === year 
            if(isDueThisYear || isDueNextYear || isDueInTwoYears){
                if(stock <= 0) {
                    outOfStockGap = true
                    cellFlags.outOfStockGap = true
                }
                stock += order.quantity
                cellFlags.orders.push(orderDueDate)
            } 
        }

        if(oneMonthOOSTriggered) cellFlags.oneMonthOOSTriggered = true
        if(fourMonthOOSTriggered) cellFlags.fourMonthOOSTriggered = true

        if(historicOOSDate.getMonth() === m && historicOOSDate.getFullYear() === year){
            cellFlags.historicOOSDate = historicOOSDate
        }
        if(oneMonthOOSDate.getMonth() === m && oneMonthOOSDate.getFullYear() === year){
            cellFlags.oneMonthOOSDate = oneMonthOOSDate
            oneMonthOOSTriggered = true
        }
        if(fourMonthOOSDate.getMonth() === m && fourMonthOOSDate.getFullYear() === year){
            cellFlags.fourMonthOOSDate = fourMonthOOSDate
            fourMonthOOSTriggered = true
        }

        monthStockLevels.push(<StockForecastCell key={m} item={item} cellFlags={cellFlags} stockLevel={stock}/>)
        stock -= item.stockConsumption.historicConsumption[m % 12]
    }

    return <div key={item?.SKU + "-" + Date.now()} className={styles["row"]}>
        <div className={styles.details}>
            <div><input
                type={"checkbox"}
                defaultChecked={hide}
                onChange={e => handleCheckChange("hide", item, e.target.checked)}/></div>
            <div><input
                type={"checkbox"}
                defaultChecked={list}
                onChange={e => handleCheckChange("list", item, e.target.checked)}/></div>
            <SkuCell item={item}/>
            <StockTotalCell item={item}/>
            <OnOrderCell item={item}/>
        </div>
        <div className={styles.months}>
            {monthStockLevels}
        </div>
    </div>
}