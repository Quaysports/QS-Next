import styles from "../sales-report.module.css"
import {useRouter} from "next/router";
import OnlineYearComparison from "./online-summaries/year-comparison";
import OnlineYearSummary from "./online-summaries/year-summary";
import ShopYearComparison from "./shop-summaries/year-comparison";
import ShopYearSummary from "./shop-summaries/year-summary";

export default function YearSummaries() {

    const router = useRouter()
    const location = router.query.location ?? "shop"

    if(location === "shop") {

        return <div className={styles["year-summary-container"]}>
            <ShopYearComparison/>
            <ShopYearSummary/>
            <ShopYearSummary previousYear={true}/>
        </div>
    }
    if(location === "online"){

        return <div className={styles["year-summary-container"]}>
                <OnlineYearComparison/>
                <OnlineYearSummary/>
                <OnlineYearSummary previousYear={true}/>
        </div>
    }

    return null
}