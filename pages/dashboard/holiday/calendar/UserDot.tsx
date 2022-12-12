import styles from "./calendar.module.css";
import {useSelector} from "react-redux";
import {selectUserColors} from "../../../../store/dashboard/holiday-slice";

export default function UserDot({user, booked}:{user: string, booked: boolean | "half"}){
    const userColors = useSelector(selectUserColors)
    switch(true){
        case booked === "half": return <div className={styles["half-booked-dot"]}
                                            style={{backgroundColor: userColors[user]}}/>
        case booked: return <div className={styles["booked-dot"]}
                                 style={{backgroundColor: userColors[user]}}/>
        default: return null
    }
}