import {useSelector} from "react-redux";
import {selectBookedDays, selectCalendar, selectUsers} from "../../../../store/dashboard/holiday-slice";
import {User} from "../../../../server-modules/users/user";
import styles from "../holiday.module.css"
import calendarStyles from "../calendar/calendar.module.css"

export default function InfoPanel(){

    const bookedDays = useSelector(selectBookedDays)
    const calendar = useSelector(selectCalendar)
    const users = useSelector(selectUsers)

    if(!calendar) return null

    let elements = [<TitleRow key={"title-row"}/>]
    for(const user of users[calendar.location as "shop" | "online"]){
        elements.push(<UserRow key={user.username} user={user} bookedDays={bookedDays}/>)
    }

    return <div className={styles["info-table"]}>{elements}</div>
}

function TitleRow(){
    return <div className={styles["info-row"]}>
        <div style={{opacity:0}}
             className={calendarStyles["booked-dot"]}></div>
        <div>Name</div>
        <div className={styles["info-cell"]}>Allowance</div>
        <div className={styles["info-cell"]}>Booked</div>
        <div className={styles["info-cell"]}>Remaining</div>
    </div>
}

function UserRow({user, bookedDays}:{user:User, bookedDays:{[_:string]:number}}){

    let bookedDaysCount = bookedDays[user.username] || 0
    const cy = new Date().getFullYear()
    const holiday = user.holiday?.find(userHoliday => userHoliday.year === cy) || {year:cy, days:0}

    return <div className={styles["info-row"]}>
        <div style={{background:user.colour}}
             className={calendarStyles["booked-dot"]}></div>
        <div>{user.username}</div>
        <div className={styles["info-cell"]}>{holiday.days}</div>
        <div className={styles["info-cell"]}>{bookedDaysCount}</div>
        <div className={styles["info-cell"]}>{holiday.days - bookedDaysCount}</div>
    </div>
}