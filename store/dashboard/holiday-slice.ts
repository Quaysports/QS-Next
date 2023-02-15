import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../../server-modules/users/user";
import {dispatchNotification} from "../../components/notification/dispatch-notification";
import {sbt} from "../../types";
import {HYDRATE} from "next-redux-wrapper";
import {RootState} from "../store";

export const hydrate = createAction<RootState>(HYDRATE);

export interface holidaysWrapper {
    holidays: holidaysState
}

export interface holidaysState {
    calendar: sbt.holidayCalendar | null
    years: string[]
    users: LocationUsers
    bookedDays: { [key: string]: number }
    paidSickDays: { [key: string]: number }
    unpaidSickDays: { [key: string]: number }
    colors: { [key: string]: string | undefined }
    newBooking: NewBooking
}

export interface LocationUsers {
    shop: User[]
    online: User[]
}

export interface NewBooking {
    user: string
    date: string
    days: number
    booking: sbt.HolidayOrSickBooking
}

const initialState: holidaysState = {
    calendar: null,
    years: [],
    users: {
        "shop": [],
        "online": []
    },
    bookedDays: {},
    paidSickDays: {},
    unpaidSickDays: {},
    colors: {},
    newBooking: {
        user: "",
        date: "",
        days: 1,
        booking: {
            duration: 100,
            paid: true,
            type: "holiday"
        }
    }
}

export const holidaysSlice = createSlice({
    name: "holidays",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(hydrate, (state, action) => {
                return {
                    ...state,
                    ...action.payload.holidays
                };
            })
            .addDefaultCase(() => {})
    },
    reducers: {
        setHolidayCalendar: (state, action: PayloadAction<sbt.holidayCalendar>) => {
            state.calendar = action.payload
            const {bookedDays, paidSickDays, unpaidSickDays} = calculateBookedDays(action.payload)

            state.bookedDays = bookedDays
            state.paidSickDays = paidSickDays
            state.unpaidSickDays = unpaidSickDays
        },
        updateHolidayCalendar: (state, action: PayloadAction<sbt.holidayCalendar>) => {

            state.calendar = action.payload
            const {bookedDays, paidSickDays, unpaidSickDays} = calculateBookedDays(action.payload)

            state.bookedDays = bookedDays
            state.paidSickDays = paidSickDays
            state.unpaidSickDays = unpaidSickDays

            let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(action.payload)
            }

            fetch("/api/holiday-calendar/update-calendar", options)

        },
        setAvailableCalendarsYears(state, action: PayloadAction<string[]>) {
            state.years = action.payload
        },
        setHolidayUsers: (state, action: PayloadAction<User[]>) => {
            state.users.shop = action.payload.filter(user => user.rota === "shop")
            state.users.online = action.payload.filter(user => user.rota === "online")
            for (const [_, v] of Object.entries(action.payload)) {
                state.colors[v.username] = v.colour ? v.colour : '#ffffff'
            }
        },
        setNewBooking: (state, action: PayloadAction<NewBooking>) => {
            state.newBooking = action.payload
        },
        submitNewBooking: (state) => {

            if (!state.calendar) return
            const newCalendar = {...state.calendar}

            const {user, date, days, booking} = state.newBooking

            if (user === "" || date === "" || days === 0) {
                dispatchNotification({
                    type: "alert",
                    title: "Information Missing!",
                    content: "Please fill in all fields"
                })
                return
            }

            const startDate = new Date(date)
            let startDay = startDate.getDate() - 1
            let startMonth = startDate.getMonth()
            let dayCount = days

            for (let i = 0; i <= days - 1; i++) {
                if (startDay + i === newCalendar.template[startMonth].days.length) {
                    dayCount -= i
                    startDay = 0
                    i = 0
                    startMonth++
                }
                if (startMonth !== 12) {
                    let days = newCalendar.template[startMonth].days
                    days[startDay + i].booked ??= {}
                    days[startDay + i].booked![user] = booking
                } else {
                    dispatchNotification({
                        type: "alert",
                        title: "Booking Alert!",
                        content: "Days after December 31st booked, create new calendar and manually book in remainder!"
                    })
                    break
                }


            }

            state.calendar = newCalendar

            const {bookedDays, paidSickDays, unpaidSickDays} = calculateBookedDays(newCalendar)

            state.bookedDays = bookedDays
            state.paidSickDays = paidSickDays
            state.unpaidSickDays = unpaidSickDays

            let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newCalendar)
            }

            fetch("/api/holiday-calendar/update-calendar", options)
        }
    },
});

function calculateBookedDays(calendar: sbt.holidayCalendar) {
    const totals: {
        bookedDays: { [key: string]: number },
        paidSickDays: { [key: string]: number },
        unpaidSickDays: { [key: string]: number }
    } = {bookedDays: {}, paidSickDays: {}, unpaidSickDays: {}}

    for (const month of calendar.template) {
        for (const day of month.days) {
            if (!day.booked) continue
            for (const [k, v] of Object.entries(day.booked)) {
                totals.bookedDays[k] ??= 0
                totals.paidSickDays[k] ??= 0
                totals.unpaidSickDays[k] ??= 0
                if (v.type === "holiday" && v.duration) totals.bookedDays[k] += v.duration / 100
                if (v.type === "sick" && v.paid) totals.paidSickDays[k] += v.duration / 100
                if (v.type === "sick" && !v.paid) totals.unpaidSickDays[k] += v.duration / 100
            }
        }
    }
    return totals
}

export const {
    setHolidayCalendar, updateHolidayCalendar, setAvailableCalendarsYears,
    setHolidayUsers, setNewBooking, submitNewBooking
} = holidaysSlice.actions
export const selectCalendar = (state: holidaysWrapper) => state.holidays.calendar
export const selectYears = (state: holidaysWrapper) => state.holidays.years
export const selectUsers = (state: holidaysWrapper) => state.holidays.users
export const selectBookedTotals = (state: holidaysWrapper) => ({
    bookedDays: state.holidays.bookedDays,
    paidSickDays: state.holidays.paidSickDays,
    unpaidSickDays: state.holidays.unpaidSickDays
})
export const selectUserColors = (state: holidaysWrapper) => state.holidays.colors
export const selectNewBooking = (state: holidaysWrapper) => state.holidays.newBooking

export default holidaysSlice.reducer;