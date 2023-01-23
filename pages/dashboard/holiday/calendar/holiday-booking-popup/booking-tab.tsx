import styles from "../calendar.module.css";
import {useEffect, useRef} from "react";
import {UserOptions} from "./index";
import {useDispatch, useSelector} from "react-redux";
import {selectNewBooking, setNewBooking, submitNewBooking} from "../../../../../store/dashboard/holiday-slice";
import {toDateInputValue} from "../../../../../components/rota-utils/time-utils";

interface Props {
    dateString: sbt.holidayDay["date"]
    type: "sick" | "holiday"
}

export default function BookingTab({dateString, type}: Props) {

    const dispatch = useDispatch()
    const newBooking = useSelector(selectNewBooking)

    const numOfDays = useRef<HTMLInputElement>(null)
    const date = dateString ? new Date(dateString) : new Date()
    if (date) date.setHours(date.getHours() + 5)

    useEffect(() => {
        dispatch(setNewBooking({
            ...newBooking,
            days: 1,
            date: toDateInputValue(date),
            booking: {...newBooking.booking, type: type, paid: true}
        }))
    }, [])

    useEffect(() => {
        if (!numOfDays.current) return
        numOfDays.current.value = newBooking.days === 1 && newBooking.booking.duration !== 100 ? String(newBooking.booking.duration / 100) : String(newBooking.days)
    }, [newBooking])

    function roundToQuarter(num: number): { days: number, duration: 25 | 50 | 75 | 100 } {
        if (num < 1) {
            return {days: 1, duration: (Math.round((num) * 4) / 4) * 100 as 25 | 50 | 75 | 100}
        } else {
            return {days: Math.floor(num), duration: 100}
        }
    }

    return (<div className={`${styles["tab-content"]} ${styles[type]}`}>
            <div className={styles["booking-split-row"]}>
                <span>Staff member:</span>
                <select value={newBooking.user}
                        onChange={e => {
                            const updatedBooking = {...newBooking, user: e.target.value}
                            dispatch(setNewBooking(updatedBooking))
                        }}>
                    <UserOptions/>
                </select>
            </div>
            <div className={styles["booking-split-row"]}>
                <span>Start date:</span>
                <input type={"date"}
                       value={newBooking.date}
                       onChange={e => {
                           const updatedBooking = {...newBooking, date: e.target.value}
                           dispatch(setNewBooking(updatedBooking))
                       }}/>
            </div>
            <div className={styles["booking-split-row"]}>
                <span>Num. of days</span>
                <input ref={numOfDays}
                       type={"number"}
                       step={0.25}
                       defaultValue={newBooking.days}
                       onBlur={e => {
                           const round = roundToQuarter(Number(e.target.value))
                           let updateBooking = {
                               ...newBooking,
                               days: round.days,
                               booking: {...newBooking.booking, duration: round.duration}
                           }
                           dispatch(setNewBooking(updateBooking))
                       }}/>
            </div>
            <div className={styles["booking-split-row"]}>
                <div>
                    <button onClick={() => {
                        dispatch(submitNewBooking())
                    }}>Submit
                    </button>
                </div>
                {type === 'sick' ? <span>
                    Paid:
                    <input type={"checkbox"}
                           defaultChecked={true}
                           onChange={e => {
                               let updateBooking = {
                                   ...newBooking,
                                   booking: {...newBooking.booking, paid: e.target.checked}
                               }
                               dispatch(setNewBooking(updateBooking))
                           }}/>
                </span> : null}
            </div>
        </div>
    )
}