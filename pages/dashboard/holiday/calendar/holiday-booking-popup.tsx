import styles from "./calendar.module.css"
import {useSelector} from "react-redux";
import {selectUsers} from "../../../../store/dashboard/holiday-slice";
import UserDot from "./UserDot";
export default function HolidayBookingPopup({day}:{day:sbt.holidayDay}) {

    const date = new Date(day.date)

    return <div className={styles["booking-table"]}>
        <div className={styles["booking-split-row"]}>
            <span>Staff member:</span>
            <UserSelect/>
        </div>
        <div className={styles["booking-split-row"]}>
            <span>Start date:</span>
            <input type={"date"} defaultValue={`${date.toISOString().slice(0,10)}`}/>
        </div>
        <div className={styles["booking-split-row"]}>
            <span>Num. of days</span>
            <input type={"number"}/>
        </div>
        <div className={styles["booking-split-row"]}>
            <div><button>Submit</button></div>
            <span>Half days:<input type={"checkbox"}/></span>
        </div>
        <div className={styles["booking-linebreak"]}></div>
        <BookUserList day={day}/>
    </div>
}

function UserSelect(){
    const users = useSelector(selectUsers)
    let options = []
    for(const [id, user] of Object.entries(users)){
        options.push(<option key={id} value={user.username}>{user.username}</option>)
    }
    return <select>{options}</select>
}

function BookUserList({day}:{day:sbt.holidayDay}){
    const {booked} = day
    if(!booked) return null
    let elements = []
    for(const [user, value] of Object.entries(booked)){
        elements.push(<div key={user}
                           className={styles["booked-user-row"]}>
            <UserDot booked={value} user={user}/>
            <div>{user}</div>
            <div>
                <button>Delete</button>
            </div>
        </div>)
    }
    return <div className={styles["booked-user-list"]}>{elements}</div>
}