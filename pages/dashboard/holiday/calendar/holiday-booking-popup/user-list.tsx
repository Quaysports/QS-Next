import styles from "../calendar.module.css";
import UserDot from "../user-dot";
import {useDispatch, useSelector} from "react-redux";
import {selectCalendar, updateHolidayCalendar} from "../../../../../store/dashboard/holiday-slice";
import {useRouter} from "next/router";
import {schema} from "../../../../../types";

export default function UserList({dateString}:{dateString:schema.HolidayDay["date"]}){

    const dispatch = useDispatch()
    const calendar = useSelector(selectCalendar)
    const type = useRouter().query.type

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
        if(type === booked[user].type || type === "both") {
            elements.push(<div key={user}
                               className={styles["booked-user-row"]}>
                <UserDot booked={booked[user]} user={user}/>
                <div>{user}</div>
                <button onClick={() => deleteBooking(user)}>Delete</button>
            </div>)
        }
    }
    return <div className={styles["booked-user-list"]}>{elements}</div>
}