import {ShopYearTotals} from "../../../../../server-modules/reports/reports";
import styles from "../../sales-report.module.css";
import Image from "next/image";
import ComparisonTrendStyle from "../../../../../components/utils/currency-trend";
import {useSelector} from "react-redux";
import {selectShopLastYearComparison, selectShopYearTotals} from "../../../../../store/reports/sales-slice";
import {useRouter} from "next/router";

export default function ShopYearComparison() {

    const router = useRouter()
    const selectedYear = Number(router.query.year) || new Date().getFullYear()

    const yearTotals = useSelector(selectShopYearTotals)
    const comparison = useSelector(selectShopLastYearComparison)

    if(!comparison || !yearTotals) return null

    let data = yearTotals.find((year: ShopYearTotals) => year.year === selectedYear)

    if (!data) return null

    const totalComparison = (data.grandTotal - comparison.grandTotal)
    const grossProfitComparison = (data.profit - comparison.profit)
    const lossComparison = (data.profit - data.profitWithLoss ?? 0) - (comparison.profit - comparison.profitWithLoss ?? 0)
    const netProfitComparison = (data.profitWithLoss ?? 0 - comparison.profitWithLoss ?? 0)

    return <div className={styles["year-summary"]}>
        <div className={styles["year-summary-vs"]}>
            <div>{data.year}</div>
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