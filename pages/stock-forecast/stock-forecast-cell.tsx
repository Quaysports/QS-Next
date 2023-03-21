import styles from "./stock-forecast.module.css";
import {StockForecastItem} from "./index";
import {CellFlags} from "./stock-forecast-row";

export default function StockForecastCell({item, cellFlags, stockLevel}:{item:StockForecastItem, cellFlags:CellFlags, stockLevel:number}) {

    if(!item) return null

    let currentDate = new Date()
    let background = stockLevel > 0 ? {background:cellFlags.band} : {background: "transparent"}
    let firstMonthBackground
    let restockBackground
    let oneMonthBackground
    let fourMonthBackground

    if (cellFlags.date.getFullYear() === currentDate.getFullYear() && cellFlags.date.getMonth() === currentDate.getMonth()){
        firstMonthBackground = generateFirstMonthStyle(currentDate, stockLevel <= 0)
        if(cellFlags.historicOrder) restockBackground = {background:`linear-gradient(to right, #005ce6 3px, transparent 3px)`}
    }

    if(stockLevel > 0) {
        if (cellFlags.historicOOSDate) {
            background = generateTransitionStyle(cellFlags.band, cellFlags.historicOOSDate)
        }
    }

    if (cellFlags.oneMonthOOSDate) {
        oneMonthBackground = generateTransitionStyle("white", cellFlags.oneMonthOOSDate, true)
    }
    if (cellFlags.fourMonthOOSDate) {
        fourMonthBackground = generateTransitionStyle("lightgray", cellFlags.fourMonthOOSDate, true)
    }

    if(cellFlags.oneMonthOOSTriggered){
        oneMonthBackground = {background:"white"}
    }
    if(cellFlags.fourMonthOOSTriggered){
        fourMonthBackground = {background:"lightgray"}
    }

    for(let order of cellFlags.orders){
        if(cellFlags.date.getMonth === order.getMonth && cellFlags.date.getFullYear === order.getFullYear){
            const endOfMonth = new Date(order.getFullYear(), order.getMonth()+1, 0).getDate()
            const day = order.getDate()
            const percentage = day/endOfMonth
            restockBackground = {background:`linear-gradient(to right, transparent ${percentage*100}%, #005ce6 ${(percentage*100)}%, #005ce6 ${(percentage*100)+6}%, transparent ${percentage*100+6}%)`}
        }
    }

    function generateFirstMonthStyle(currentDate:Date, zeroStock:boolean = false){
        const endOfMonth = new Date(cellFlags.date.getFullYear(), cellFlags.date.getMonth()+1, 0).getDate()
        const day = currentDate.getDate()
        const percentage = day/endOfMonth
        return {background:`linear-gradient(to right, var(--primary-background) ${percentage*100}%, ${zeroStock ? "transparent"  : cellFlags.band} ${percentage*100}%)`}
    }

    function generateTransitionStyle(color:string, date:Date, reverse:boolean = false){
        const endOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate()
        const day = date.getDate()
        const percentage = day/endOfMonth
        return reverse
            ? {background:`linear-gradient(to right, transparent ${percentage*100}%, ${color} ${percentage*100}%)`}
            : {background:`linear-gradient(to right, ${color} ${percentage*100}%, transparent ${percentage*100}%)`}
    }

    return(
        <div className={styles["month-cell"]} style={background}>
            <div>{stockLevel}</div>
            {firstMonthBackground ? <div style={firstMonthBackground} className={styles["first-month"]}></div> : null}
            {restockBackground ? <div style={restockBackground} className={styles["on-order"]}></div> : null}
            {fourMonthBackground ? <div style={fourMonthBackground} className={styles["four-month"]}></div> : null}
            {oneMonthBackground ? <div style={oneMonthBackground} className={styles["one-month"]}></div> : null}
        </div>
    )
}