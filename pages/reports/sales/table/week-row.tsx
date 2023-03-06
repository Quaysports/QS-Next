import {useRouter} from "next/router";
import styles from "../sales-report.module.css";
import ShopDay from "./shop-table/day-cell";
import OnlineDay from "./online-table/day-cell";

export default function Week({weekNumber, dayOffset}: { weekNumber: number, dayOffset: number }) {
    let days = []
    const router = useRouter()
    const location = router.query.location ?? "shop"
    const month = Number(router.query.month)
    const year = Number(router.query.year)

    if (isNaN(month) || isNaN(year)) return null

    const date = new Date(year, month, 1 + (weekNumber * 7) - dayOffset + 1, 2)
    for (let day = 1; day <= 7; day++) {
        let dayElement = location === "shop"
            ? <ShopDay key={day} date={new Date(date)} month={month}/>
            : <OnlineDay key={day} date={new Date(date)} month={month}/>
        days.push(dayElement)
        date.setDate(date.getDate() + 1)
    }
    return <div className={styles.week}>{days}</div>
}