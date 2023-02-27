import {useSelector} from "react-redux";
import {selectDayTotals} from "../../../../store/reports/sales-slice";
import styles from "../sales-report.module.css";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import {DayTotal} from "../../../../server-modules/reports/reports";
import {toCurrency} from "../../../../components/utils/utils";
import DayPopup from "./day-popup";

export default function Day({month, date}: { month: number, date: Date }) {
    const dayTotals = useSelector(selectDayTotals)
    if (!dayTotals || !date) return null

    let data = dayTotals.find((day) => day.date === date.toISOString().split("T")[0])

    let style = `${styles.day} ${date.getMonth() !== month ? styles["inactive-day"] : ""}`
    let title = date.toLocaleDateString("en-GB")
    return <div className={style}
                onClick={() => {
                    if (!data) return null
                    dispatchNotification({type: "popup", title: title, content: <DayPopup data={data}/>})
                }}>
        <div className={styles["day-title"]}>{title}</div>
        <DayContent data={data}/>
    </div>
}

function DayContent({data}: { data: DayTotal | undefined }) {
    console.log(data)
    if (!data) return null

    return <div className={styles["day-container"]}>
        <div className={styles["day-row"]}>
            <div>Cash:</div>
            <div>{toCurrency(data.totalCash)}</div>
        </div>
        <div className={styles["day-row"]}>
            <div>Card:</div>
            <div>{toCurrency(data.totalCard)}</div>
        </div>
        <div className={styles["day-row"]}>
            <div>Total:</div>
            <div>{toCurrency(data.totalGrandTotal)}</div>
        </div>
        <div className={styles["day-row"]}>
            <div>Net Profit:</div>
            <div>{toCurrency(data.totalProfitWithLoss)}</div>
        </div>
    </div>
}