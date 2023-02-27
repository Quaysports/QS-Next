import {useRouter} from "next/router";
import styles from "../sales-report.module.css";
import Week from "./week-row";

export default function MonthTable() {
    const router = useRouter()
    const month = Number(router.query.month)
    const year = Number(router.query.year)

    if (isNaN(month) || isNaN(year)) return null

    let firstDayOffset = new Date(year, month, 1).getDay()
    if (firstDayOffset === 0) firstDayOffset = 7

    let endOfMonth = new Date(year, month, 0).getDate()
    let weeks = Math.ceil((endOfMonth + firstDayOffset - 1) / 7)

    let weekElements = []
    for (let week = 0; week < weeks; week++) {
        weekElements.push(<Week dayOffset={firstDayOffset} weekNumber={week}/>)
    }
    return <>
        <Menu/>
        <div className={styles.month}>
            {weekElements}
        </div>
    </>
}

function Menu() {
    const router = useRouter()
    return <div>Weeks Table <button onClick={() => router.back()}>Back</button></div>
}