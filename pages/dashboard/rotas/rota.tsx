import styles from "./rotas.module.css"
import {useEffect, useState} from "react";
import {Rota, UserHours, WeekData} from "../../../server-modules/rotas/rotas";
import {useDispatch} from "react-redux";
import {updateTemplate} from "../../../store/dashboard/rotas-slice";
import {getTinyDate} from "../../../components/rota-utils/time-utils";
import {sbt} from "../../../types";

export default function RotaWeek({rota, weekData, holiday, edit=true}: { rota: Rota, weekData:WeekData | null, holiday:sbt.holidayDay[] | null, edit?: boolean }) {

    if(!rota) return null

    let days = []
    for (let i in rota.rota) {
        days.push(<RotaDay key={i} dayOfWeek={Number(i)} userHours={rota.rota[i]} holiday={holiday} weekData={weekData} edit={edit}/>)
    }

    return <div className={styles["week"]}>{days}</div>
}

function RotaDay({dayOfWeek, userHours, weekData, holiday, edit}: { dayOfWeek: number, userHours: UserHours[], weekData:WeekData | null, holiday:sbt.holidayDay[] | null, edit:boolean }) {

    if(!userHours) return null

    let userRows = []

    for (let i in userHours) {
        userRows.push(<UserRow key={i} userIndex={Number(i)} userHours={userHours[i]} dayOfWeek={dayOfWeek} holiday={holiday} edit={edit}/>)
    }

    return (
        <div role={"rota-day"} className={styles["day"]}>
            <DayTitle dayOfWeek={dayOfWeek} weekData={weekData}/>
            {userRows}
        </div>
    )
}

function DayTitle({dayOfWeek, weekData}: { dayOfWeek: number, weekData:WeekData | null }) {

    const days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
    const hours = ["6am", "7", "8", "9", "10", "11", "12pm", "1", "2", "3", "4", "5", "6"]

    let hourCells = []
    for (let hour of hours) {
        hourCells.push(<div key={hour} className={styles["day-title-cell"]}>{hour}</div>)
    }

    return (
        <div className={styles["day-title-row"]}>
            <div className={styles["day-title-cell"]}>
                {weekData ? getTinyDate(new Date(weekData.days[dayOfWeek])) : days[dayOfWeek]}
            </div>
            {hourCells}
        </div>
    )
}

function UserRow({userIndex, userHours, dayOfWeek, holiday, edit}: { userIndex: number, userHours: UserHours, dayOfWeek: number, holiday:sbt.holidayDay[] | null, edit:boolean }) {

    if(!userHours) return null

    const dispatch = useDispatch()
    const [tracking, setTracking] = useState(false)
    const [toggleState, setToggleState] = useState(false)
    const [hours, setHours] = useState(userHours.hours)
    const [totalHours, setTotalHours] = useState(userHours.total)

    useEffect(() => {
        setTotalHours(Object.values(hours).reduce((a, b) => b ? a + 0.5 : a, 0))
    }, [hours])

    let hourCells: JSX.Element[] = []
    Object.entries(hours).forEach(([k, v]) => {
        let onHoliday = !!holiday?.[dayOfWeek]?.booked?.[userHours.username]
        let style: { background?: string } = {}
        if(onHoliday) style.background = userHours.colour + "50"
        if (v) style.background = userHours.colour
        hourCells.push(
            <div key={k}
                 className={`${styles["day-cell"]} ${styles["pickable"]}`}
                 onClick={() => {
                     if(!edit) return
                     if (tracking) {
                         let newUserHours = {...userHours}
                         newUserHours.hours = hours
                         newUserHours.total = totalHours
                         dispatch(updateTemplate({index: userIndex, day: dayOfWeek, userHours: newUserHours}))
                     }
                     setTracking(!tracking)
                     setToggleState(!v)
                 }}
                 onMouseMove={() => {
                     if (tracking && hours[k as keyof UserHours["hours"]] !== toggleState)
                         setHours({...hours, [k]: toggleState})
                 }}
                 onMouseOver={() => {
                     if (tracking && hours[k as keyof UserHours["hours"]] !== toggleState)
                         setHours({...hours, [k]: toggleState})
                 }}
                 style={style}>{holiday?.[dayOfWeek].booked?.[userHours.username] ? "Hol" : ""}</div>
        )
    })

    const borderHighlight = `1px solid ${userHours.colour}`

    return (
        <div className={styles["day-row"]}
             style={tracking ? {borderBottom: borderHighlight, borderTop: borderHighlight} : {}}>
            <div className={styles["day-cell"]}>
                <div className={styles["day-cell-user"]}>
                    <div>{userHours.username}</div>
                    <div>{totalHours}</div>
                </div>
            </div>
            {hourCells}
        </div>
    )
}