import styles from "../holiday.module.css";
import {BankHoliday} from "./create-calendar-popup";

export default function BankHolidayTable({bankHolidays}: { bankHolidays: BankHoliday[] }) {
    if (!bankHolidays || bankHolidays.length === 0) return null
    let elements = [<BankHolidayTitleRow key={"title"}/>]
    for (const holiday of bankHolidays) {
        elements.push(<BankHolidayRow key={holiday.date} holiday={holiday}/>)
    }
    return <div className={styles["bank-holiday-table"]}>{elements}</div>
}

function BankHolidayTitleRow() {
    return <div className={styles["bank-holiday-row"]}>
        <div>Title</div>
        <div>Date</div>
        <div>Bunting</div>
    </div>
}

function BankHolidayRow({holiday}: { holiday: BankHoliday }) {
    return <div className={styles["bank-holiday-row"]}>
        <div>{holiday.title}</div>
        <div>{holiday.date}</div>
        <div>{holiday.bunting ? '\u{1F389}' : ""}</div>
    </div>
}