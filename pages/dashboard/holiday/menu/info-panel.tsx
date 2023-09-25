import {useSelector} from "react-redux";
import {
    selectBookedTotals,
    selectCalendar,
    selectUsers
} from "../../../../store/dashboard/holiday-slice";
import {User} from "../../../../server-modules/users/user";
import styles from "../holiday.module.css"
import calendarStyles from "../calendar/calendar.module.css"

export default function InfoPanel(){

    const calendar = useSelector(selectCalendar)
    const users = useSelector(selectUsers)

    if(!calendar) return null

    let elements = [<TitleRow key={"title-row"}/>]
    // for(const user of users[calendar.location as "shop" | "online"]){
    //     elements.push(<UserRow key={user.username} user={user}/>)
    // }

      // Check if calendar.location is "both" and if so, include all users
  if (calendar.location === "both") {
    for (const user of users.shop.concat(users.online)) {
      elements.push(<UserRow key={user.username} user={user} />);
    }
  } else {
    // Otherwise, filter users based on the location
    const locationUsers = users[calendar.location as "shop" | "online"];
    for (const user of locationUsers) {
      elements.push(<UserRow key={user.username} user={user} />);
    }
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
        <div className={styles["info-cell"]}>Paid Sick</div>
        <div className={styles["info-cell"]}>Un-paid Sick</div>
    </div>
}

function UserRow({user}:{user:User}){

    const {bookedDays, paidSickDays, unpaidSickDays} = useSelector(selectBookedTotals)

    let bookedDaysCount = bookedDays[user.username] || 0
    let paidSickDaysCount = paidSickDays[user.username] || 0
    let unpaidSickDaysCount = unpaidSickDays[user.username] || 0
    const cy = new Date().getFullYear()
    const holiday = user.holiday?.find(userHoliday => userHoliday.year === cy) || {year:cy, days:0}

    return <div className={styles["info-row"]}>
        <div style={{background:user.colour}}
             className={calendarStyles["booked-dot-100"]}></div>
        <div>{user.username}</div>
        <div className={styles["info-cell"]}>{holiday.days}</div>
        <div className={styles["info-cell"]}>{bookedDaysCount}</div>
        <div className={styles["info-cell"]}>{holiday.days - bookedDaysCount}</div>
        <div className={styles["info-cell"]}>{paidSickDaysCount}</div>
        <div className={styles["info-cell"]}>{unpaidSickDaysCount}</div>
    </div>
}