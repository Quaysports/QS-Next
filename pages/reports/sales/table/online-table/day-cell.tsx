import {useSelector} from "react-redux";
import {selectOnlineDayTotals} from "../../../../../store/reports/sales-slice";
import styles from "../../sales-report.module.css";
import {OnlineDayTotal} from "../../../../../server-modules/reports/reports";
import {toCurrency} from "../../../../../components/utils/utils";

export default function OnlineDay({month, date}: { month: number, date: Date }) {
    const dayTotals = useSelector(selectOnlineDayTotals)
    if (!dayTotals || !date) return null

    let data = dayTotals.find((day) => day.date === date.toISOString().split("T")[0])

    let style = `${styles.day} ${date.getMonth() !== month ? styles["inactive-day"] : ""}`
    let title = date.toLocaleDateString("en-GB")
    return <div className={style}
                onClick={() => {
                    if (!data) return null
                }}>
        <div className={styles["day-title"]}>{title}</div>
        <DayContent data={data}/>
    </div>
}

function DayContent({data}: { data: OnlineDayTotal | undefined }) {
    if (!data) return null

    const {amazon, ebay, magento} = data
    const total = (amazon?.grandTotal || 0) + (ebay?.grandTotal || 0) + (magento?.grandTotal || 0)
    const profit = (amazon?.profit || 0) + (ebay?.profit || 0) + (magento?.profit || 0)

    return <div className={styles["day-container"]}>
        <div className={styles["day-row"]}>
            <div>Amazon:</div>
            <div>{toCurrency(amazon?.grandTotal)}</div>
        </div>
        <div className={styles["day-row"]}>
            <div>Ebay:</div>
            <div>{toCurrency(ebay?.grandTotal)}</div>
        </div>
        <div className={styles["day-row"]}>
            <div>Magento:</div>
            <div>{toCurrency(magento?.grandTotal)}</div>
        </div>
        <div className={styles["day-row"]}>
            <div>Total:</div>
            <div>{toCurrency(total)}</div>
        </div>
        <div className={styles["day-row"]}>
            <div>Profit:</div>
            <div>{toCurrency(profit)}</div>
        </div>
    </div>

}