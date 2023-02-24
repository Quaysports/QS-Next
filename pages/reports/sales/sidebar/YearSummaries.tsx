import styles from "../sales-report.module.css"
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {
    selectLastYear,
    selectLastYearComparison,
    selectYearTotals
} from "../../../../store/reports/sales-slice";
import {toCurrency} from "../../../../components/margin-calculator-utils/utils";
import Image from "next/image";
import {YearTotals} from "../../../../server-modules/reports/reports";

export default function YearSummaries() {

    const router = useRouter()
    const lastYear = useSelector(selectLastYear)
    const selectedYear = Number(router.query.year) || new Date(lastYear).getFullYear()
    const yearTotals = useSelector(selectYearTotals)
    const lastYearComparison = useSelector(selectLastYearComparison) || undefined

    const yearData = yearTotals.find((year: YearTotals) => year.year === selectedYear)
    console.log(yearData)

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
                <div>Profit</div>
                <div>{toCurrency(yearData.profit)}</div>
            </div>
            <div className={styles["year-summary-row"]}>
                <div>Profit lost to discounts</div>
                <div>{toCurrency(yearData.profit - yearData.profitWithLoss)}</div>
            </div>
        </div>
    </div>
}

function YearComparison({yearData, comparison}: { yearData: YearTotals, comparison?: YearTotals }) {
    if (!comparison) return null

    return <div className={styles["year-summary"]}>
        <div className={styles["year-summary-vs"]}>
            <div>{yearData.year}</div>
            <Image alt={""} src={"/vs.svg"} width={25} height={25}/>
            <div>{comparison.year}</div>
        </div>
        <div className={styles["year-summary-content"]}>
            <div className={styles["year-summary-row"]}>
                <div>Total</div>
                <div>{ComparisonTrendStyle(yearData.grandTotal - comparison.grandTotal)}</div>
            </div>
            <div className={styles["year-summary-row"]}>
                <div>Profit</div>
                <div>{ComparisonTrendStyle(yearData.profit - comparison.profit)}</div>
            </div>
            <div className={styles["year-summary-row"]}>
                <div>Loss</div>
                <div>{ComparisonTrendStyle(
                    (yearData.profit - yearData.profitWithLoss) - (comparison.profit - comparison.profitWithLoss),
                    true
                )}</div>
            </div>
        </div>
    </div>
}

function ComparisonTrendStyle(amount:number, inverse:boolean = false){

    `/trend-down-${inverse ? "green" : "red"}.svg`

    if(amount >= 0){

        const upArrow = `/trend-up-${inverse ? "red" : "green"}.svg`
        const color = `var(--traffic-light-${inverse ? "red" : "green"})`

        return <div className={styles["year-summary-row-trend"]}>
            <Image alt={""} src={upArrow} width={20} height={20}/>
            <div style={{color: color}}>{toCurrency(amount)}</div>
        </div>
    }

    const downArrow = `/trend-down-${inverse ? "green" : "red"}.svg`
    const color = `var(--traffic-light-${inverse ? "green" : "red"})`

    return <div className={styles["year-summary-row-trend"]}>
        <Image alt={""} src={downArrow} width={20} height={20}/>
        <div style={{color:color}}>{toCurrency(amount)}</div>
    </div>
}