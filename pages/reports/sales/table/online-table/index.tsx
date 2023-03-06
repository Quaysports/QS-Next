import {useRouter} from "next/router";
import styles from "../../sales-report.module.css";
import {useSelector} from "react-redux";
import {
    selectOnlineLastYearMonthComparison,
    selectOnlineMonthTotals,
} from "../../../../../store/reports/sales-slice";
import {OnlineMonthTotal} from "../../../../../server-modules/reports/reports";
import {toCurrency} from "../../../../../components/utils/utils";
import ComparisonTrendStyle from "../../../../../components/utils/currency-trend";

export default function OnlineYearTable() {

    const monthData = useSelector(selectOnlineMonthTotals)
    const comparisonData = useSelector(selectOnlineLastYearMonthComparison) || undefined

    if (!monthData) return null

    let rows = []
    for (let i in monthData) {
        rows.push(<MonthRow key={i} monthData={monthData[i]} comparisonData={comparisonData?.[i]}/>)
    }

    return <div className={styles["month-table"]}>{rows}</div>
}

const MonthLabels = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

function MonthRow({monthData, comparisonData}: { monthData: OnlineMonthTotal[], comparisonData?: OnlineMonthTotal[] }) {

    const router = useRouter()
    const totals = monthData.find((month: OnlineMonthTotal) => month.year)
    const lastYearTotals = comparisonData?.find((month: OnlineMonthTotal) => month.year)

    if (!totals) return null

    let channelRows = []
    for (let i in monthData) {
        channelRows.push(<ChannelRow key={i} monthData={monthData[i]} comparisonData={comparisonData?.[i] || {
            grandTotal: 0,
            month: 0,
            profit: 0,
            source: "",
            year: 0,
            orders: 0
        }}/>)
    }

    return <div className={styles["online-month-card"]}
                onAnimationEnd={() => {
                    router.push({pathname: router.pathname, query: {...router.query, month: totals.month}})
                }}
                onClick={(e) => {
                    e.currentTarget.className = styles["month-card-selected"]
                }}>
        <div className={styles["month-title"]}>{MonthLabels[totals.month]}</div>
        {channelRows}
        <div className={styles["online-month-channel"]}>
            <div className={styles["month-row-totals-cell"]}>
                <div>Total:</div>
                <div>{toCurrency(totals.grandTotal)}</div>
                <ComparisonTrendStyle amount={totals.grandTotal - (lastYearTotals?.grandTotal || 0)}/>
            </div>
            <div className={styles["month-row-totals-cell"]}>
                <div>Profit:</div>
                <div>{toCurrency(totals.profit)}</div>
                <ComparisonTrendStyle amount={totals.profit - (lastYearTotals?.profit || 0)}/>
            </div>
            <div className={styles["month-row-totals-cell"]}>
                <div>Orders:</div>
                <div>{totals.orders}</div>
                <ComparisonTrendStyle currency={false} amount={totals.orders - (lastYearTotals?.orders || 0)}/>
            </div>
        </div>
    </div>
}

function ChannelRow({monthData, comparisonData}: { monthData: OnlineMonthTotal, comparisonData: OnlineMonthTotal }) {
    if (!monthData.source) return null
    return <div className={styles["online-month-channel"]}>
        <div className={styles["month-row-totals-cell"]}>
            <div>{monthData.source}:</div>
            <div>{toCurrency(monthData.grandTotal)}</div>
            <ComparisonTrendStyle amount={monthData.grandTotal - comparisonData.grandTotal}/>
        </div>
        <div className={styles["month-row-totals-cell"]}>
            <div>Orders:</div>
            <div>{monthData.orders}</div>
            <ComparisonTrendStyle currency={false} amount={monthData.orders - comparisonData.orders}/>
        </div>
    </div>
}