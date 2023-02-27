import {useRouter} from "next/router";
import styles from "../sales-report.module.css";
import {useSelector} from "react-redux";
import {selectLastYearMonthComparison, selectMonthTotals} from "../../../../store/reports/sales-slice";
import {MonthTotals} from "../../../../server-modules/reports/reports";
import {toCurrency} from "../../../../components/utils/utils";
import ComparisonTrendStyle from "../../../../components/utils/currency-trend";

export default function YearTable() {

    const monthData = useSelector(selectMonthTotals)
    const comparisonData = useSelector(selectLastYearMonthComparison) || undefined

    if (!monthData) return null

    let rows = []
    for (let month of monthData) {
        rows.push(<MonthRow monthData={month} comparisonData={comparisonData}/>)
    }

    return <div className={styles["month-table"]}>{rows}</div>
}

const MonthLabels = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

function MonthRow({monthData, comparisonData}: { monthData: MonthTotals, comparisonData?: MonthTotals[] }) {

    const router = useRouter()

    const monthTotalsTemplate: MonthTotals = {grandTotal: 0, month: 0, profit: 0, profitWithLoss: 0, year: 0}
    const comparisonMonth: MonthTotals = comparisonData?.find((month: MonthTotals) => month.month === monthData.month) || monthTotalsTemplate

    const totalComparison = monthData.grandTotal - comparisonMonth.grandTotal
    const grossProfit = monthData.profit - comparisonMonth.profit
    const lossComparison = (monthData.profit - monthData.profitWithLoss) - (comparisonMonth.profit - comparisonMonth.profitWithLoss)
    const netProfit = monthData.profitWithLoss - comparisonMonth.profitWithLoss

    return <div className={styles["month-card"]}
                onAnimationEnd={()=>{
                    router.push({...router, query: {...router.query, month: monthData.month}})
                }}
                onClick={(e)=>{
                    e.currentTarget.className = styles["month-card-selected"]
                }}>
        <div className={styles["month-title"]}>{MonthLabels[monthData.month]}</div>
        <div className={styles["month-row-totals-cell"]}>
            <div>Total:</div>
            <div>{toCurrency(monthData.grandTotal)}</div>
            <ComparisonTrendStyle amount={totalComparison}/>
        </div>
        <div className={styles["month-row-totals-cell"]}>
            <div>Gross Profit:</div>
            <div>{toCurrency(monthData.profit)}</div>
            <ComparisonTrendStyle amount={grossProfit}/>
        </div>
        <div className={styles["month-row-totals-cell"]}>
            <div>Loss:</div>
            <div>{toCurrency(monthData.profit - monthData.profitWithLoss)}</div>
            <ComparisonTrendStyle amount={lossComparison} inverse/>
        </div>
        <div className={styles["month-row-totals-cell"]}>
            <div>Net Profit:</div>
            <div>{toCurrency(monthData.profitWithLoss)}</div>
            <ComparisonTrendStyle amount={netProfit}/>
        </div>
    </div>
}