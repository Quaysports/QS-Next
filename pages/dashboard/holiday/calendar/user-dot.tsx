import styles from "./calendar.module.css";
import {useSelector} from "react-redux";
import {selectUserColors} from "../../../../store/dashboard/holiday-slice";
import {sbt} from "../../../../types";

export default function UserDot({user, booked}: { user: string, booked: sbt.HolidayOrSickBooking }) {
    const userColors = useSelector(selectUserColors)

    if (!booked || !user) return null

    let classString = `${styles["booked-dot-"+booked.duration]}`
    if(booked.type === "sick" && booked.paid) classString += ` ${styles["sick-paid-border"]}`
    if(booked.type === "sick" && !booked.paid) classString += ` ${styles["sick-unpaid-border"]}`

    return <div
        id={user + booked.duration}
        className={classString}
        style={{backgroundColor: userColors[user] || "var(--primary-inactive-text)"}}/>

}