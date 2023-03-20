import {useDispatch, useSelector} from "react-redux";
import {selectUsers, updateHolidayCalendar} from "../../../../store/dashboard/holiday-slice";
import {BankHoliday} from "./create-calendar-popup";
import styles from "../holiday.module.css"
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import {schema} from "../../../../types";

interface Props {
    location:"shop" | "online";
    year:string | undefined;
    bankHolidays:BankHoliday[];
}

export default function CreateCalendarSubmitButton({location, year, bankHolidays}:Props){

    const currentYear = new Date().getFullYear()
    const users = useSelector(selectUsers)
    const dispatch = useDispatch()

    async function submit() {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        let holidayCalendar: schema.HolidayCalendar = {
            booked: {},
            location: location || "",
            maxDays: 0,
            template: [],
            year: Number(year || currentYear)
        }

        function generateHolidayMonth(index: number, calendar: schema.HolidayCalendar): schema.HolidayMonth {

            let month: schema.HolidayMonth = {
                text: months[index],
                days: [],
                offset: (new Date(calendar.year, index, 1)).getDay()
            }

            let daysInMonth = new Date(calendar.year, index + 1, 0).getDate()

            for (let i = 0; i < daysInMonth; i++) {
                month.days.push({
                    date: (new Date(calendar.year, index, i + 1)).toDateString()
                } as schema.HolidayDay)
            }

            if ((month.days.length + month.offset) > calendar.maxDays) calendar.maxDays = month.days.length + month.offset

            return month
        }

        for (const index in months) {
            holidayCalendar.template.push(generateHolidayMonth(Number(index), holidayCalendar))
        }

        function bookBankHolidays(calendar: schema.HolidayCalendar) {
            for (let holiday of bankHolidays) {
                let date = new Date(holiday.date)
                calendar.template[date.getMonth()].days[date.getDate() - 1].bankHol = true
                for (let v of users.online) {
                    calendar.template[date.getMonth()].days[date.getDate() - 1].booked ??= {}
                    calendar.template[date.getMonth()].days[date.getDate() - 1].booked![v.username] = {type: "holiday", paid: true, duration: 100}
                }
            }

            for (let v of users.online) {
                calendar.booked[v.username] = bankHolidays.length
            }
        }

        if(holidayCalendar.location === "online") bookBankHolidays(holidayCalendar)

        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({year: holidayCalendar.year, location: holidayCalendar.location})
        }

        let response = await fetch("/api/holiday-calendar/existing-check", options)
        if(await response.json()){
            dispatchNotification({
                type:"confirm",
                content:"Calendar already exists, replace existing?",
                fn:()=>updateSliceAndDatabase(holidayCalendar)}
            )
        } else {
            updateSliceAndDatabase(holidayCalendar)
        }
    }

    const updateSliceAndDatabase = (holidayCalendar:schema.HolidayCalendar) => dispatch(updateHolidayCalendar(holidayCalendar))

    return <button className={styles["create-calendar-submit-button"]} onClick={()=>submit()}>Create Calendar</button>

}