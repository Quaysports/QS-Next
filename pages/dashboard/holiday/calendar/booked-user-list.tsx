import styles from "./calendar.module.css";
import UserDot from "./UserDot";
import {useDispatch, useSelector} from "react-redux";
import {selectCalendar, updateHolidayCalendar} from "../../../../store/dashboard/holiday-slice";

export default function BookedUserList({dateString}:{dateString:sbt.holidayDay["date"]}){

    const dispatch = useDispatch()
    const calendar = useSelector(selectCalendar)

    const date = dateString ? new Date(dateString) : undefined

    if(!date || !calendar) return null

    date.setHours(date.getHours() + 5)
    const day = date.getDate() -1
    const month = date.getMonth()
    const booked = calendar.template[month].days[day].booked

    function deleteBooking(user:string){
        if(!calendar || !day) return

        const newCalendar = structuredClone(calendar)

        delete newCalendar.template[month].days[day].booked![user]
        dispatch(updateHolidayCalendar(newCalendar))
    }

    let elements = []
    for(const user in booked){
        elements.push(<div key={user}
                           className={styles["booked-user-row"]}>
            <UserDot booked={booked[user]} user={user}/>
            <div>{user}</div>
            <div>
                <button onClick={()=>deleteBooking(user)}>Delete</button>
            </div>
        </div>)
    }
    return <div className={styles["booked-user-list"]}>{elements}</div>
}