import styles from "./calendar.module.css";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import HolidayBookingPopup from "./holiday-booking-popup";
import UserDot from "./UserDot";
import {useSelector} from "react-redux";
import {selectUser} from "../../../../store/session-slice";

interface Props {
    month: sbt.holidayMonth;
    maxDays: number;
    dayCellWidth:string;
}

export default function MonthRow({ month, maxDays, dayCellWidth }: Props) {

    if(!month) return null

    let elements = [<div key={month.text} className={styles.month}>{month.text}</div>]

    for(let i = 0; i < maxDays; i++){
        elements.push(<MonthCell key={i} index={i} month={month}/>)
    }

    return <div style={{gridTemplateColumns:`repeat(${maxDays + 1}, ${dayCellWidth})`}} className={styles.row}>{elements}</div>
}

function MonthCell({ index, month }: { index: number, month:sbt.holidayMonth }) {

    const session = useSelector(selectUser)

    const {offset, days} = month
    const loop = Math.floor(index / 7)
    const day = index - (loop * 7)

    function cellText(){
        switch(true){
            case index >= offset && index < offset + (days.length):
                return index + (1 - offset)
            default: return ""
        }
    }

    function cellClass(){
        if(month.days[index - offset]?.bankHol) return styles["bank-holiday-cell"]
        switch(true){
            case day === 0 || day === 6: return styles["weekend-cell"]
            default: return styles["day-cell"]
        }
    }

    function createBookedDots(){
        let dots = []
        let booked = month.days[index - offset]?.booked
        if(booked){
            for(const [user, value] of Object.entries(booked)){
                dots.push(<UserDot key={user} booked={value} user={user}/>)
            }
        }
        return <>{dots}</>
    }

    return <div className={cellClass()}
                onClick={()=>{
                    if(!month.days[index - offset] || !session.permissions.holidaysEdit?.auth) return
                    dispatchNotification(
                        {
                            type:"popup",
                            title:"Holiday Booking",
                            content:<HolidayBookingPopup  dateString={month.days[index - offset].date}/>
                        })
                }}>
        <div className={styles["month-cell-text"]}>{cellText()}</div>
        <div className={styles["month-cell-dots"]}>{createBookedDots()}</div>
    </div>;
}