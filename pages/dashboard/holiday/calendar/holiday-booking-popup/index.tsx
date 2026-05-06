import styles from "../calendar.module.css"
import {useSelector} from "react-redux";
import {selectCalendar, selectUsers} from "../../../../../store/dashboard/holiday-slice";
import {useState} from "react";
import UserList from "./user-list";
import BookingTab from "./booking-tab";
import {useRouter} from "next/router";
import {schema} from "../../../../../types";

export default function HolidayBookingPopup({dateString}: { dateString: schema.HolidayDay["date"] }) {


    const router = useRouter()
    const type = router.query.type as "sick" | "holiday" | "toil" | "all" 
    const [selectedTab, setSelectedTab] = useState<"holiday" | "toil" | "sick">(type === "all" ? "holiday" : type)

    const toggleTab = (tab: "holiday" | "toil" | "sick") => setSelectedTab(tab)

    if (!dateString) return null

    return <div className={styles["booking-table"]}>
        <div>
            <div className={styles["tabs-container"]}>
                {type === "all" || type === "holiday"
                    ? <div className={`${styles["booking-tab"]} ${styles.holiday}`}
                           onClick={() => toggleTab("holiday")}>Holiday</div>
                    : null}
                {type === "all" || type === "toil"
                    ? <div className={`${styles["booking-tab"]} ${styles.toil}`}
                           onClick={() => toggleTab("toil")}>TOIL</div>
                    : null}    
                {type === "all" || type === "sick"
                    ? <div className={`${styles["booking-tab"]} ${styles.sick}`}
                           onClick={() => toggleTab("sick")}>Sick</div>
                    : null}                
            </div>
            {selectedTab === "holiday" ? <BookingTab dateString={dateString} type={"holiday"}/> : null}
            {selectedTab === "toil" ? <BookingTab dateString={dateString} type={"toil"}/> : null}
            {selectedTab === "sick" ? <BookingTab dateString={dateString} type={"sick"}/> : null}
        </div>
        <UserList dateString={dateString}/>
    </div>
}

export function UserOptions() {
    const users = useSelector(selectUsers)
    const calendar = useSelector(selectCalendar)
    if (!calendar) return null

    let options = [<option key={"placeholder"}>Select user...</option>]
    for (const [id, user] of Object.entries(users[calendar.location as "shop" | "online"])) {
        options.push(<option key={id} value={user.username}>{user.username}</option>)
    }
    return <>{options}</>
}