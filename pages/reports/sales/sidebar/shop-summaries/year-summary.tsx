import {ShopYearTotals} from "../../../../../server-modules/reports/reports";
import styles from "../../sales-report.module.css";
import {toCurrency} from "../../../../../components/utils/utils";
import {useSelector} from "react-redux";
import {selectShopLastYearComparison, selectShopYearTotals} from "../../../../../store/reports/sales-slice";
import {useRouter} from "next/router";

export default function ShopYearSummary({previousYear}: { previousYear?: boolean }) {

    const router = useRouter()
    const selectedYear = Number(router.query.year) || new Date().getFullYear()

    const yearTotals = useSelector(selectShopYearTotals)
    const lastYearComparison = useSelector(selectShopLastYearComparison) || undefined

    if(!yearTotals) return null

    let yearData = previousYear
        ? lastYearComparison
        : yearTotals.find((year: ShopYearTotals) => year.year === selectedYear)

    if(!yearData) return null

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