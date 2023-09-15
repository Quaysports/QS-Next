import {useDispatch, useSelector} from "react-redux";
import {
    publishRota, selectHolidays,
    selectTemplate,
    selectWeekData,
    setHolidayData,
    setWeekData
} from "../../../../store/dashboard/rotas-slice";
import RotaWeek from "../rota";
import PublishSidebar from "./publish-sidebar";
import styles from "../rotas.module.css";
import {useEffect, useState} from "react";
import {getWeek, toDateInputValue} from "../../../../components/rota-utils/time-utils";
import {selectCalendar} from "../../../../store/dashboard/holiday-slice";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import InfoPanel from "../info-panel";
import { schema } from "../../../../types";

export default function PublishRota() {
    const template = useSelector(selectTemplate)
    console.log(template);
    
    const weekData = useSelector(selectWeekData)
    const holidayCalendar = useSelector(selectCalendar)
    console.log("holidayCalendar: ", holidayCalendar)
    const holiday = useSelector(selectHolidays)

    const dispatch = useDispatch()
    const [date, setDate] = useState(weekData?.monday ? new Date(weekData.monday) : new Date())

    useEffect(() => {
        console.log(date)
        dispatch(setWeekData(getWeek(date)))
    }, [date])

    const [mergedCalendar, setMergedCalendar] = useState<schema.HolidayCalendar>({} as schema.HolidayCalendar);
    console.log("mergedCalendar", mergedCalendar)

    useEffect(() => {    
      // Assuming calendar[0] is the "shop" data and calendar[1] is the "online" data
      if (Array.isArray(holidayCalendar) && holidayCalendar.length > 0) {
          const shopTemplates = holidayCalendar[0].template;
          const onlineTemplates = holidayCalendar[1].template;
      
          // Merge the 'booked' days within each month's 'days' array
          const mergedTemplate = shopTemplates.map((shopMonth: schema.HolidayMonth, index: number) => ({
            ...shopMonth,
            days: shopMonth.days.map((shopDay, dayIndex) => ({
              ...shopDay,
              booked: {
                ...shopDay.booked,
                ...onlineTemplates[index].days[dayIndex].booked,
              },
            })),
          }));
      
          // Create a merged calendar object
          const mergedCalendarData: schema.HolidayCalendar = {
            ...holidayCalendar[0], // You can choose which shop or online data to keep here
            template: mergedTemplate,
          };
          console.log("mergedCalendarData", mergedCalendarData)
          setMergedCalendar(mergedCalendarData);
      }
    }, [holidayCalendar]);

    // useEffect(() => {
    //     let currentYear = new Date().getFullYear().toString()
    //     if (!weekData || !weekData.monday.includes(currentYear)){
    //         dispatch(setHolidayData(null))
    //         return
    //     }
    //     let date = new Date(weekData.monday)
    //     let holidayData = Array.isArray(holidayCalendar) ? mergedCalendar.template[date.getMonth()].days.slice(date.getDate() - 1, date.getDate() + 6) : holidayCalendar?.template[date.getMonth()].days.slice(date.getDate() - 1, date.getDate() + 6)
    //     if (!holidayData) return
    //     if (holidayData.length < 7) {
    //         let daysNextMonth = Array.isArray(holidayCalendar) ? mergedCalendar?.template[date.getMonth() + 1].days.slice(0, 7 - holidayData.length) : holidayCalendar?.template[date.getMonth() + 1].days.slice(0, 7 - holidayData.length)
    //         if(daysNextMonth) holidayData = holidayData.concat(daysNextMonth)
    //     }
    //     dispatch(setHolidayData(holidayData))
    //     console.log("holidayData", holidayData)
    // }, [weekData])

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