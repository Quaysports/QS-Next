import styles from "./calendar.module.css"
import {useDispatch, useSelector} from "react-redux";
import {selectCalendar, selectUsers, updateHolidayCalendar} from "../../../../store/dashboard/holiday-slice";
import {useState} from "react";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import BookedUserList from "./booked-user-list";

export default function HolidayBookingPopup({dateString}:{dateString:sbt.holidayDay["date"]}) {

    const dispatch = useDispatch()
    const calendar = useSelector(selectCalendar)
    if(!calendar) return null

    const date = dateString ? new Date(dateString) : undefined
    if(date) date.setHours(date.getHours() + 5)

    const [staffMember, setStaffMember] = useState<string | null>(null)
    const [bookedDate, setBookedDate] = useState<string>(date ? date.toISOString().slice(0,10) : "")
    const [numOfDays, setNumOfDays] = useState<number>(1)
    const [halfDay, setHalfDay] = useState<boolean>(false)
    const [bookingType, setBookingType] = useState<{paid:boolean, unpaid:boolean, holiday:boolean}>(
        {paid: false, unpaid: false, holiday: true}
    )


    if(!dateString) return null

    function submit(calendar: sbt.holidayCalendar){

        const newCalendar = structuredClone(calendar)

        if(!staffMember || !bookedDate || !numOfDays) {
            dispatchNotification({type:"alert", title:"Information Missing!", content:"Please fill in all fields"})
            return
        }

        const startDate = new Date(bookedDate)
        let startDay = startDate.getDate() - 1
        let startMonth = startDate.getMonth()
        let dayCount = numOfDays

        for(let i = 0; i <= numOfDays - 1; i++){
            if (startDay + i === newCalendar.template[startMonth].days.length) {
                dayCount -= i
                startDay = 0
                i = 0
                startMonth++
            }
            if (startMonth !== 12) {
                let days = newCalendar.template[startMonth].days
                days[startDay + i].booked ??= {}
                if (halfDay) {
                    newCalendar.booked[staffMember] += 0.5
                    days[startDay + i].booked![staffMember] = {type: "holiday", paid:true, duration: 50}
                } else {
                    newCalendar.booked[staffMember] += 1
                    days[startDay + i].booked![staffMember] = {type: "holiday", paid:true, duration: 100}
                }
            } else {
                dispatchNotification({
                    type:"alert",
                    title:"Booking Alert!",
                    content:"Days after December 31st booked, create new calendar and manually book in remainder!"
                })
                break
            }
        }
        dispatch(updateHolidayCalendar(newCalendar))
        dispatchNotification()
    }

    return <div className={styles["booking-table"]}>
        <div className={styles["booking-split-row"]}>
            <span>Staff member:</span>
            <select onChange={e=>setStaffMember(e.target.value)}>
                {userOptions()}
            </select>
        </div>
        <div className={styles["booking-split-row"]}>
            <span>Start date:</span>
            <input type={"date"}
                   value={bookedDate}
                   onChange={e=>setBookedDate(e.target.value)}/>
        </div>
        <div className={styles["booking-split-row"]}>
            <span>Num. of days</span>
            <input type={"number"}
                   value={numOfDays}
                   onChange={e=>setNumOfDays(Number(e.target.value))}/>
        </div>
        <div>
            <label htmlFor={"paid-sick-radio"}>Paid</label>
            <input id={"paid-sick-radio"}
                   type={"radio"}
                   name={"type-select"}
                   checked={bookingType.paid}
                   onChange={(e)=>setBookingType({holiday: false, unpaid: false, paid:e.target.checked})}/>
            <label htmlFor={"unpaid-sick-radio"}>Unpaid</label>
            <input id={"unpaid-sick-radio"}
                   type={"radio"}
                   name={"type-select"}
                   checked={bookingType.unpaid}
                   onChange={(e)=>setBookingType({holiday: false, unpaid: e.target.checked, paid:false})}/>
            <label htmlFor={"holiday-radio"}>Holiday</label>
            <input id={"holiday-radio"}
                   type={"radio"}
                   name={"type-select"}
                   checked={bookingType.holiday}
                   onChange={(e)=>setBookingType({holiday: e.target.checked, unpaid: false, paid:false})}/>
        </div>
        <div className={styles["booking-split-row"]}>
            <div>
                <button onClick={()=>submit(calendar)}>Submit</button>
            </div>
            <span>Half days:
                <input type={"checkbox"}
                       checked={halfDay}
                       onChange={e=>setHalfDay(e.target.checked)}/>
            </span>
        </div>
        <div className={styles["booking-linebreak"]}></div>
        <BookedUserList  dateString={dateString}/>
    </div>
}

function userOptions(){
    const users = useSelector(selectUsers)
    const calendar = useSelector(selectCalendar)

    if(!calendar) return null

    let options = [<option key={"placeholder"}>Select user...</option>]
    for(const [id, user] of Object.entries(users[calendar.location as "shop" | "online"])){
        options.push(<option key={id} value={user.username}>{user.username}</option>)
    }
    return options
}