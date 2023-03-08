import {OnlineYearTotals} from "../../../../../server-modules/reports/reports";
import styles from "../../sales-report.module.css";
import {toCurrency} from "../../../../../components/utils/utils";
import {useSelector} from "react-redux";
import {
    selectOnlineLastYearComparison, selectOnlineYearTotals,
} from "../../../../../store/reports/sales-slice";
import {useRouter} from "next/router";

export default function OnlineYearSummary({previousYear}: { previousYear?: boolean }) {

    const router = useRouter()
    const selectedYear = Number(router.query.year) || new Date().getFullYear()

    const yearTotals = useSelector(selectOnlineYearTotals)
    const lastYearComparison = useSelector(selectOnlineLastYearComparison)
    let yearData = previousYear
        ? lastYearComparison
        : yearTotals.find(channels => channels.find(data => data.year === selectedYear))

    console.log(yearData)
    if(!yearData || yearData.length === 0) return null

    let totalElements = []
    let year = undefined
    let orders

    for (let data of yearData as OnlineYearTotals) {
        if (data.year) {
            year = data.year
            orders = data.orders
        }
        totalElements.push(<div key={"source-"+data.source} className={styles["online-summary"]}>
            <div>{data.source || "Overall"}</div>
            <div className={styles["online-summary-row"]}>
                <div>{toCurrency(data.grandTotal)}</div>
                    <div>{toCurrency(data.profit)}</div>
            </div>
        </div>)
    }

    return <div className={styles["year-summary"]}>
        <div className={styles["year-summary-title"]}>{year}</div>
        <div className={styles["year-summary-content"]}>
            <div className={styles["online-summary"]}>
                <div className={styles["online-summary-row"]}>
                    <div>Total</div>
                    <div>Profit</div>
                </div>
            </div>
            {totalElements}
            <div key={"orders-total"} className={styles["online-summary"]}>
                <div className={styles["online-summary-row"]}>
                    <div>Orders:</div>
                    <div>{orders}</div>
                </div>
            </div>
        </div>
    </div>

}