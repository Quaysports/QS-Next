import styles from "../sales-report.module.css"
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {
    selectLastYear,
    selectLastYearComparison,
    selectYearTotals
} from "../../../../store/reports/sales-slice";
import {toCurrency} from "../../../../components/utils/utils";
import Image from "next/image";
import {YearTotals} from "../../../../server-modules/reports/reports";
import ComparisonTrendStyle from "../../../../components/utils/currency-trend";

export default function YearSummaries() {

    const router = useRouter()
    const lastYear = useSelector(selectLastYear)
    const selectedYear = Number(router.query.year) || new Date(lastYear).getFullYear()
    const yearTotals = useSelector(selectYearTotals)
    const lastYearComparison = useSelector(selectLastYearComparison) || undefined

    const yearData = yearTotals.find((year: YearTotals) => year.year === selectedYear)

    return <div className={styles["year-summary-container"]}>
        {yearData ? <YearSummary yearData={yearData}/> : null}
        {lastYearComparison ? <YearSummary yearData={lastYearComparison}/> : null}
        {yearData && lastYearComparison ? <YearComparison yearData={yearData} comparison={lastYearComparison}/> : null}
    </div>
}


function YearSummary({yearData}: { yearData: YearTotals }) {

    return <div className={styles["year-summary"]}>
        <div className={styles["year-summary-title"]}>{yearData.year}</div>
        <div className={styles["year-summary-content"]}>
            <div className={styles["year-summary-row"]}>
                <div>Total</div>
                <div>{toCurrency(yearData.grandTotal)}</div>
            </div>
            <div className={styles["year-summary-row"]}>
                <div>Gross Profit</div>
                <div>{toCurrency(yearData.profit)}</div>
            </div>
            <div className={styles["year-summary-row"]}>
                <div>Profit lost to discounts</div>
                <div>{toCurrency(yearData.profit - yearData.profitWithLoss)}</div>
            </div>
            <div className={styles["year-summary-row"]}>
                <div>Net Profit</div>
                <div>{toCurrency(yearData.profitWithLoss)}</div>
            </div>
        </div>
    </div>
}

function YearComparison({yearData, comparison}: { yearData: YearTotals, comparison?: YearTotals }) {
    if (!comparison) return null

    const totalComparison = (yearData.grandTotal - comparison.grandTotal)
    const grossProfitComparison = (yearData.profit - comparison.profit)
    const lossComparison = (yearData.profit - yearData.profitWithLoss) - (comparison.profit - comparison.profitWithLoss)
    const netProfitComparison = (yearData.profitWithLoss - comparison.profitWithLoss)

    return <div className={styles["year-summary"]}>
        <div className={styles["year-summary-vs"]}>
            <div>{yearData.year}</div>
            <Image alt={""} src={"/vs.svg"} width={25} height={25}/>
            <div>{comparison.year}</div>
        </div>
        <div className={styles["year-summary-content"]}>
            <div className={styles["year-summary-row"]}>
                <div>Total</div>
                <div><ComparisonTrendStyle amount={totalComparison}/></div>
            </div>
            <div className={styles["year-summary-row"]}>
                <div>Gross Profit</div>
                <div><ComparisonTrendStyle amount={grossProfitComparison}/></div>
            </div>
            <div className={styles["year-summary-row"]}>
                <div>Loss</div>
                <div>
                    <ComparisonTrendStyle amount={lossComparison} inverse={true}/>
                </div>
            </div>
            <div className={styles["year-summary-row"]}>
                <div>Net Profit</div>
                <div>
                    <ComparisonTrendStyle amount={netProfitComparison}/>
                </div>
            </div>
        </div>
    </div>
}