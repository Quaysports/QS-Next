import {useRouter} from "next/router";
import styles from "../sales-report.module.css";
import Day from "./day-cell";

export default function Week({weekNumber, dayOffset}: { weekNumber: number, dayOffset: number }) {
    let days = []
    const router = useRouter()
    const month = Number(router.query.month)
    const year = Number(router.query.year)

    if (isNaN(month) || isNaN(year)) return null

    const date = new Date(year, month, 1 + (weekNumber * 7) - dayOffset + 1, 2)
    for (let day = 1; day <= 7; day++) {
        days.push(<Day date={new Date(date)} month={month}/>)
        date.setDate(date.getDate() + 1)
    }
    return <div className={styles.week}>{days}</div>
}