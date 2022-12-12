
import styles from "../holiday.module.css";
import {useDispatch, useSelector} from "react-redux";
import {selectCalendar, selectYears} from "../../../../store/dashboard/holiday-slice";
import {useRouter} from "next/router";
import {selectUser, updateDashboardSetting} from "../../../../store/session-slice";
import {useEffect, useState} from "react";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import InfoPanel from "./info-panel";

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

    return <div className={styles.menu}>
        <button onClick={()=>{
            dispatchNotification({type:"popup", title:"Booked Days", content:<InfoPanel/>})
        }}>Info Panel</button>
        <button>Create Calendar</button>
        <select defaultValue={calendar?.location}
                onChange={async (e)=>{
                    let newDashboardSettings = structuredClone(session.settings.dashboard!)
                    newDashboardSettings.holiday.location = e.target.value as "shop" | "online"
                    dispatch(updateDashboardSetting(newDashboardSettings))

                    await router.push({query:{tab:"holidays", location:e.target.value}})
                }}>
            <option value={"shop"}>Shop</option>
            <option value={"online"}>Online</option>
        </select>
        <select value={year} onChange={async (e)=>{
            setYear(Number(e.target.value))
            await router.push({query:{...router.query, ...{year:e.target.value}}})
        }}>{yearOptions}</select>
    </div>
}