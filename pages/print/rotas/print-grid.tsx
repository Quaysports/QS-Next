import {Rota, UserHours, WeekData} from "../../../server-modules/rotas/rotas";
import styles from "./print-rota-grid.module.css";
import {getTinyDate} from "../../../components/rota-utils/time-utils";
import {sbt} from "../../../types";

export default function PrintRotaGrid() {

    if(!global.window) return null

    let rotaString = global.window.localStorage.getItem("rota")
    if(!rotaString) return null

    const rotas = JSON.parse(rotaString)

    let printRotas = []
    for(let rota of rotas) {
        printRotas.push(<div className={styles.week}>
            <div className={styles.info}>
                <div>Week Start: {new Date(rota.weekData.monday).toDateString()}</div>
                <div>Week Number: {rota.weekData.week}</div>
            </div>
            <RotaWeek holiday={rota.holidays} rota={rota} weekData={rota.weekData}/>
            <WeekNotes rota={rota}/>
        </div>)
    }

    return (
        <div className={styles["local-body"]}>
            <style>
                {`@page {
                    size: A4 portrait;
                    margin: 0;
                    padding: 0;
                }`}
            </style>
            {printRotas}
        </div>
    )
}

function WeekNotes({rota}: { rota: Rota }) {

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    if (!rota) return null

    let dayNotes = []

    for (let i in rota.rota) {
        let notes = []
        for (let userHours of rota.rota[i]) {
            if (!userHours.notes) continue
            notes.push(<div className={styles["week-note"]}>{userHours.username}: {userHours.notes}</div>)
        }

        if (notes.length > 0) {
            dayNotes.push(<div className={styles["week-note-container"]}>
                <div>{days[Number(i)]}</div>
                <div>{notes}</div>
            </div>)
        }
    }

    return <div className={styles["weeks-notes"]}>
        {dayNotes}
    </div>
}

function RotaWeek({rota, weekData, holiday}: { rota: Rota, weekData: WeekData, holiday: sbt.holidayDay[] | null }) {

    return (
        <div className={styles["week-grid"]}>
            <TitleRow weekData={weekData}/>
            <div className={styles["week-column-wrapper"]}>
                <UserNameColumn rota={rota}/>
                <UserColumns holiday={holiday} rota={rota} weekData={weekData}/>
            </div>
        </div>
    )
}

function TitleRow({weekData}: { weekData: WeekData }) {

    let dayCells = []
    for (let day of weekData.days) {
        dayCells.push(<div key={day + "-title"} className={styles["grid-title-cell"]}>{getTinyDate(new Date(day))}</div>)
    }

    return (
        <div className={styles["week-title-row"]}>
            <div className={styles["grid-title-cell"]}>Users</div>
            {dayCells}
        </div>
    )
}

function UserNameColumn({rota}: { rota: Rota }) {

    let userCells = []
    let data = rota.rota[0]
    for (let user of data) {
        userCells.push(<div key={user.username} className={styles["grid-cell"]}>{user.username}</div>)
    }

    return (
        <div className={styles["week-name-column"]}>
            {userCells}
        </div>
    )
}

function UserColumns({rota, weekData, holiday}: { rota: Rota, weekData: WeekData, holiday: sbt.holidayDay[] | null }) {
    let userColumns = []
    for (let day in weekData.days) {
        let data = rota.rota[day]
        let userCells = []
        for (let user of data) {
            userCells.push(<DayCell key={user.username} dayOfWeek={Number(day)} holiday={holiday} userHours={user}/>)
        }
        userColumns.push(<div key={day} className={styles["week-column"]}>{userCells}</div>)
    }

    return <>{userColumns}</>
}

function DayCell({userHours, dayOfWeek, holiday}:
                     { userHours: UserHours, dayOfWeek: number, holiday: sbt.holidayDay[] | null }) {

    let onHoliday = !!holiday?.[dayOfWeek]?.booked?.[userHours.username]
    let str = ""

    //let style: { background?: string } = {}
    //if (v) style.background = userHours.colour
    let previous = false
    for (let [k, v] of Object.entries(userHours.hours)) {
        if (v !== previous) {
            switch (v) {
                case true:
                    str += k + " - "
                    break;
                case false:
                    str += str.length > 0 ? k + "\n" : k;
                    break;
            }
            previous = v
        }
    }


    return (
        <div className={styles["grid-cell"]}>
            {onHoliday ? <div className={styles["holiday"]}>Holiday</div> : null}
            <div>{str}</div>
        </div>
    )
}