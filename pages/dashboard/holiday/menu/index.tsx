
import styles from "../holiday.module.css";
import {useDispatch, useSelector} from "react-redux";
import {selectCalendar, selectYears} from "../../../../store/dashboard/holiday-slice";
import {useRouter} from "next/router";
import {selectUser, updateDashboardSetting} from "../../../../store/session-slice";
import {useEffect, useState} from "react";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import InfoPanel from "./info-panel";
import CreateCalendarPopup from "./create-calendar-popup";
import UserDot from "../calendar/user-dot";

export default function HolidayMenu(){

    const calendar = useSelector(selectCalendar)
    const session = useSelector(selectUser)
    const years = useSelector(selectYears)
    const router = useRouter()
    const dispatch = useDispatch()

    const [year, setYear] = useState(calendar?.year)
    useEffect(()=>{setYear(calendar?.year)},[calendar])

    if(!calendar) return null

    let yearOptions = []
    for(const year of years){
        yearOptions.push(<option key={year} value={year}>{year}</option>)
    }

    return <div className={session.permissions.holidaysEdit?.auth ? styles.menu : styles["menu-collapsed"]}>
        <button onClick={()=>{
            dispatchNotification({type:"popup", title:"Booked Days", content:<InfoPanel/>})
        }}>Info Panel</button>
        {session.permissions.holidaysEdit?.auth ? <button onClick={()=>{
                dispatchNotification({type:"popup", title:"Create Calendar", content:<CreateCalendarPopup/>})
        }}>Create Calendar</button> : null}
        <select defaultValue={calendar?.location}
                onChange={async (e)=>{
                    let newDashboardSettings = structuredClone(session.settings.dashboard!)
                    newDashboardSettings.holiday.location = e.target.value as "shop" | "online"
                    dispatch(updateDashboardSetting(newDashboardSettings))

                    await router.push({query:{tab:"holidays", location:e.target.value, type:router.query.type}})
                }}>
            <option value={"shop"}>Shop</option>
            <option value={"online"}>Online</option>
        </select>
        <select value={year} onChange={async (e)=>{
            setYear(Number(e.target.value))
            await router.push({query:{...router.query, ...{year:e.target.value}}})
        }}>{yearOptions}</select>
        <select value={router.query.type}
                onChange={(e)=>router.push({pathname:router.pathname, query:{...router.query, type:e.target.value}})}>
            <option value={"holiday"}>Holiday</option>
            <option value={"sick"}>Sick</option>
        </select>
        <div className={styles["dot-key"]}>
            <div className={styles["dot-key-label"]}>Holiday: <UserDot user={"example"} booked={{duration: 100, paid: true, type:"holiday"}}/></div>
            <div className={styles["dot-key-label"]}>Paid Sick: <UserDot user={"example"} booked={{duration: 100, paid: true, type:"sick"}}/></div>
            <div className={styles["dot-key-label"]}>Un-paid Sick: <UserDot user={"example"} booked={{duration: 100, paid: false, type:"sick"}}/></div>
        </div>
    </div>
}