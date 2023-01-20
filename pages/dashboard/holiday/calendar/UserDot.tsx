import styles from "./calendar.module.css";
import {useSelector} from "react-redux";
import {selectUserColors} from "../../../../store/dashboard/holiday-slice";

export default function UserDot({user, booked}: { user: string, booked: sbt.HolidayOrSickBooking }) {
    const userColors = useSelector(selectUserColors)

    if(!booked || !user) return null

    if (booked.type !== "holiday") return null

    switch (booked.duration) {
        case 50:
            return <div className={styles["half-booked-dot"]}
                        style={{backgroundColor: userColors[user]}}/>
        case 100:
            return <div className={styles["booked-dot"]}
                        style={{backgroundColor: userColors[user]}}/>
        default:
            return null
    }
}