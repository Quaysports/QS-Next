import {Rota, UserHours, WeekData} from "../../../server-modules/rotas/rotas";
import styles from "./print-rota-rows.module.css";
import {getTinyDate} from "../../../components/rota-utils/time-utils";
import {schema} from "../../../types";

export default function PrintRotaRows(){

    if(!global.window) return null

    let rotaString = global.window.localStorage.getItem("rota")
    if(!rotaString) return null


    const rotas = JSON.parse(rotaString)

    let printRotas = []
    for(let rota of rotas) {
        printRotas.push(<RotaWeek holiday={rota.holiday} rota={rota} weekData={rota.weekData}/>)
    }

    return (
        <div className={styles["local-body"]}>
            <style>
                {`@page {
                    size: A4 landscape;
                    margin: 0;
                    padding: 0;
                }`}
            </style>
            {printRotas}
        </div>
    )
}

function RotaWeek({rota, weekData, holiday}: { rota: Rota, weekData:WeekData, holiday:schema.HolidayDay[] | null }) {

    let days = []
    for (let i in rota.rota) {
        days.push(<RotaDay key={i} dayOfWeek={Number(i)} userHours={rota.rota[i]} holiday={holiday} weekData={weekData}/>)
    }

    return <div className={styles.week}>
        <div className={styles.info}>
            <div>Week Start: {new Date(weekData.monday).toDateString()}</div>
            <div>Week Number: {weekData.week}</div>
        </div>
        {days}
    </div>
}

function RotaDay({dayOfWeek, userHours, weekData, holiday}: { dayOfWeek: number, userHours: UserHours[], weekData:WeekData, holiday:schema.HolidayDay[] | null }) {

    let userRows = []

    for (let i in userHours) {
        userRows.push(<UserRow key={i} userHours={userHours[i]} dayOfWeek={dayOfWeek} holiday={holiday}/>)
    }

    return (
        <div>
            <DayTitle dayOfWeek={dayOfWeek} weekData={weekData}/>
            {userRows}
        </div>
    )
}

function DayTitle({dayOfWeek, weekData}: { dayOfWeek: number, weekData:WeekData }) {

    const hours = ["6am", "7", "8", "9", "10", "11", "12pm", "1", "2", "3", "4", "5", "6"]

    let hourCells = []
    for (let hour of hours) {
        hourCells.push(<div key={hour} className={styles["day-title-cell"]}>{hour}</div>)
    }

    return (
        <div className={styles["day-title-row"]}>
            <div className={styles["day-title-cell"]}>
                {getTinyDate(new Date(weekData.days[dayOfWeek]))}
            </div>
            {hourCells}
        </div>
    )
}

function UserRow({userHours, dayOfWeek, holiday}: {userHours: UserHours, dayOfWeek: number, holiday:schema.HolidayDay[] | null }) {

    let hourCells: JSX.Element[] = []
    Object.entries(userHours.hours).forEach(([k, v]) => {

        let onHoliday = !!holiday?.[dayOfWeek]?.booked?.[userHours.username]
        let style: { background?: string } = {}
        if(onHoliday) style.background = userHours.colour + "50"
        if (v) style.background = userHours.colour

        hourCells.push(<div key={k} className={styles["day-cell"]} style={style}>{onHoliday ? "Hol" : ""}</div>)
    })

    return (
        <div className={styles["day-row"]}>
            <div className={styles["day-cell"]}>
                <div className={styles["day-cell-user"]}>
                    <div>{userHours.username}</div>
                    <div>{userHours.total}</div>
                </div>
            </div>
            {hourCells}
        </div>
    )
}