import {useEffect, useState} from "react";
import styles from "../holiday.module.css"
import CreateCalendarSubmitButton from "./create-calendar-submit-button";
import BankHolidayTable from "./create-calendar-bankholiday-table";

export interface BankHoliday {
    bunting: boolean;
    date: string;
    notes: string;
    title: string;
}

export default function CreateCalendarPopup() {

    const currentYear = new Date().getFullYear()
    const [bankHolidays, setBankHolidays] = useState<BankHoliday[]>([])
    const [location, setLocation] = useState<"shop" | "online">("shop")
    const [year, setYear] = useState<string>(currentYear.toString())

    useEffect(() => {
        fetch("https://www.gov.uk/bank-holidays.json").then(result => {
            return result.json()
        }).then(data => {
            setBankHolidays(
                data["england-and-wales"].events.filter((holiday: BankHoliday) => holiday.date.slice(0,4) === year)
            )
        })
    }, [year])

    const endYear = currentYear + 3
    const yearSpread = []
    for (let i = currentYear - 1; i < endYear; i++) {
        yearSpread.push(<option key={i} value={i}>{i}</option>)
    }

    return <div>
        <div className={styles["create-calendar-options"]}>
            <div>Location:</div>
            <select value={location}
                    onChange={e => setLocation(e.target.value as "shop" | "online")}>
                <option value={"shop"}>Shop</option>
                <option value={"online"}>Online</option>
            </select>
            <div>Year:</div>
            <select value={year}
                    onChange={e => setYear(e.target.value)}>{yearSpread}</select>
            <div>
                <CreateCalendarSubmitButton  location={location}
                                             year={year}
                                             bankHolidays={bankHolidays}/>
            </div>
        </div>
        <BankHolidayTable bankHolidays={bankHolidays}/>
    </div>
}