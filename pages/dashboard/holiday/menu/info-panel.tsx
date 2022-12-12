import {useSelector} from "react-redux";
import {selectBookedDays, selectUsers} from "../../../../store/dashboard/holiday-slice";
import {User} from "../../../../server-modules/users/user";
import styles from "../holiday.module.css"
import calendarStyles from "../calendar/calendar.module.css"

export default function InfoPanel(){

    const bookedDays = useSelector(selectBookedDays)
    const holidayUsers = useSelector(selectUsers)

    let elements = [<TitleRow key={"title-row"}/>]
    for(const user of holidayUsers){
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
    return <div className={styles["info-row"]}>
        <div style={{background:user.colour}}
             className={calendarStyles["booked-dot"]}></div>
        <div>{user.username}</div>
        <div className={styles["info-cell"]}>{user.holiday}</div>
        <div className={styles["info-cell"]}>{bookedDays[user.username]}</div>
        <div className={styles["info-cell"]}>{user.holiday? Number(user.holiday) - bookedDays[user.username] : user.holiday}</div>
    </div>
}