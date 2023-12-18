import {useDispatch, useSelector} from "react-redux";
import {
    publishRota, selectHolidays,
    selectTemplate,
    selectWeekData,
    setHolidayData,
    setWeekData,
} from "../../../../store/dashboard/rotas-slice";
import RotaWeek from "../rota";
import PublishSidebar from "./publish-sidebar";
import styles from "../rotas.module.css";
import {useEffect, useState} from "react";
import {getWeek, toDateInputValue} from "../../../../components/rota-utils/time-utils";
import {selectCalendar} from "../../../../store/dashboard/holiday-slice";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import InfoPanel from "../info-panel";

export default function PublishRota() {
    const template = useSelector(selectTemplate)
    const weekData = useSelector(selectWeekData)
    const holidayCalendar = useSelector(selectCalendar)
    const holiday = useSelector(selectHolidays)

    const dispatch = useDispatch()
    const [date, setDate] = useState(weekData?.monday ? new Date(weekData.monday) : new Date())

    useEffect(() => {
        dispatch(setWeekData(getWeek(date)))
    }, [date])

    useEffect(() => {
        if (!weekData){
            dispatch(setHolidayData(null))
            return
        }
        let date = new Date(weekData.monday)
        let holidayData = holidayCalendar?.template[date.getMonth()].days.slice(date.getDate() - 1, date.getDate() + 6)
        if (!holidayData) return
        if (holidayData.length < 7) {
            let daysNextMonth = holidayCalendar?.template[date.getMonth() + 1].days.slice(0, 7 - holidayData.length)
            if(daysNextMonth) holidayData = holidayData.concat(daysNextMonth)
        }
        dispatch(setHolidayData(holidayData))

    }, [weekData])

    if (!template) return null

    return <div>
        <div className={styles["publish-menu"]}>
            <div>
                <button onClick={() => {
                    dispatch(publishRota())
                    dispatchNotification()
                    window.location.reload()
                }}>Publish</button>
            </div>
            <div><input type={"date"} value={toDateInputValue(date)}
                        onChange={(e) => setDate(new Date(e.target.value))}
            /></div>
            {weekData ? <>
                <div>Week starting {new Date(weekData.monday).toLocaleDateString('en-GB')}</div>
                <div>Week Number: {weekData.week}</div>
            </> : null}
        </div>
        <div className={styles["info-panel-rota-sidebar"]}>
            <InfoPanel rota={template}/>
            <RotaWeek rota={template} holiday={holiday} weekData={weekData}/>
            <PublishSidebar rota={template}/>
        </div>
    </div>
}