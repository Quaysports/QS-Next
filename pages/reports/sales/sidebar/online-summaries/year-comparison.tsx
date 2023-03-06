import {OnlineTotal, OnlineYearTotals} from "../../../../../server-modules/reports/reports";
import {useRouter} from "next/router";
import styles from "../../sales-report.module.css";
import Image from "next/image";
import ComparisonTrendStyle from "../../../../../components/utils/currency-trend";
import {useSelector} from "react-redux";
import {
    selectOnlineLastYearComparison,
    selectOnlineYearTotals,
} from "../../../../../store/reports/sales-slice";

export default function OnlineYearComparison() {

    const router = useRouter()
    const year = Number(router.query.year) || new Date().getFullYear()

    const yearTotals = useSelector(selectOnlineYearTotals)
    const comparisonData = useSelector(selectOnlineLastYearComparison)

    if(!yearTotals || !comparisonData) return null

    const yearData = yearTotals.find(channels => channels.find(data => data.year === year))

    if (!yearData) return null

    const comparisonElements = [<div className={styles["online-summary"]}>
        <div className={styles["online-summary-row"]}>
            <div>Total</div>
            <div>Profit</div>
        </div>
    </div>]

    const template: OnlineTotal = {
        grandTotal: 0, profit: 0, source: "", year: 0, orders:0
    }

    let totalOrders = 0
    let comparisonOrders = 0

    for (let data of yearData as OnlineYearTotals) {
        let comparison
        if (data.year) comparison = comparisonData.find((y) => y.year !== undefined)
        if (data.source) comparison = comparisonData.find((y) => y.source === data.source)
        if(data.year) totalOrders = data.orders
        if(comparison && comparison.year) comparisonOrders = comparison.orders
        comparisonElements.push(<OnlineComparisonRow key={data.profit} data={data} comparison={comparison || template}/>)
    }

    return <div className={styles["year-summary"]}>
        <div className={styles["year-summary-vs"]}>
            <div>{year}</div>
            <Image alt={""} src={"/vs.svg"} width={25} height={25}/>
            <div>{Number(year) - 1}</div>
        </div>
        <div className={styles["year-summary-content"]}>
            {comparisonElements}
            <div key={"orders-total"} className={styles["online-summary"]}>
                <div className={styles["online-summary-row"]}>
                    <div>Orders:</div>
                    <div><ComparisonTrendStyle currency={false} amount={totalOrders - comparisonOrders} size={16}/></div>
                </div>
            </div>
        </div>
    </div>

}

function OnlineComparisonRow({data, comparison}: { data: OnlineTotal, comparison: OnlineTotal }) {

    const totalComparison = (data.grandTotal - comparison.grandTotal)
    const grossProfitComparison = (data.profit - comparison.profit)

    return <div key={"source-"+data.source} className={styles["online-summary"]}>
        <div>{data.source || "Overall"}</div>
        <div className={styles["online-summary-row"]}>
            <div><ComparisonTrendStyle amount={totalComparison} size={16}/></div>
            <div><ComparisonTrendStyle amount={grossProfitComparison} size={16}/></div>
        </div>
    </div>
}