import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {User} from "../../server-modules/users/user";

export interface holidaysWrapper {
    holidays: holidaysState
}

export interface holidaysState {
    calendar: sbt.holidayCalendar | null
    years: string[]
    users: LocationUsers
    bookedDays: { [key: string]: number }
    colors: { [key: string]: string | undefined }
}

export interface LocationUsers {
    shop: User[]
    online: User[]
}

const initialState: holidaysState = {
    calendar: null,
    years: [],
    users: {
        "shop": [],
        "online": []
    },
    bookedDays: {},
    colors: {}
}

export const holidaysSlice = createSlice({
    name: "holidays",
    initialState,
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.holidays
            }
        },
    },
    reducers: {
        setHolidayCalendar: (state, action: PayloadAction<sbt.holidayCalendar>) => {
            state.calendar = action.payload
            state.bookedDays = calculateBookedDays(action.payload)
        },
        updateHolidayCalendar: (state, action: PayloadAction<sbt.holidayCalendar>) => {
            state.calendar = action.payload
            state.bookedDays = calculateBookedDays(action.payload)

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
        }
    },
});

function calculateBookedDays(calendar: sbt.holidayCalendar) {
    const bookedDays:{ [key: string]: number } = {}
    for (const month of calendar.template) {
        for (const day of month.days) {
            if (day.booked) {
                for (const [k, v] of Object.entries(day.booked)) {
                    bookedDays[k] ??= 0
                    if (v === "half") {
                        bookedDays[k] += 0.5
                        continue
                    }
                    if (v) bookedDays[k]++
                }
            }
        }
    }
    return bookedDays
}

export const {setHolidayCalendar, updateHolidayCalendar, setAvailableCalendarsYears, setHolidayUsers} = holidaysSlice.actions
export const selectCalendar = (state: holidaysWrapper) => state.holidays.calendar
export const selectYears = (state: holidaysWrapper) => state.holidays.years
export const selectUsers = (state: holidaysWrapper) => state.holidays.users
export const selectBookedDays = (state: holidaysWrapper) => state.holidays.bookedDays
export const selectUserColors = (state: holidaysWrapper) => state.holidays.colors

export default holidaysSlice.reducer;