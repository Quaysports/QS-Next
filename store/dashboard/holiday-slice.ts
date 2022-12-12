import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {User} from "../../server-modules/users/user";

export interface holidaysWrapper {
    holidays: holidaysState
}

export interface holidaysState {
    calendar: sbt.holidayCalendar | null
    years: string[]
    users: User[]
    bookedDays: {[key: string]: number }
    colors: { [key: string]: string | undefined }
}

const initialState:holidaysState = {
    calendar: null,
    years: [],
    users: [],
    bookedDays: {},
    colors: {}
}

export const holidaysSlice = createSlice({
        name: "holidays",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return{
                    ...state,
                    ...action.payload.holidays
                }
            },
        },
        reducers:{
            setHolidayCalendar:(state,action:PayloadAction<sbt.holidayCalendar>) => {
                state.calendar = action.payload
                for(const month of state.calendar.template) {
                    for(const day of month.days) {
                        if(day.booked) {
                            for(const [k,v] of Object.entries(day.booked)) {
                                state.bookedDays[k] ??= 0
                                if(v === "half") state.bookedDays[k] += 0.5
                                if(v) state.bookedDays[k]++
                            }
                        }
                    }
                }
            },
            setAvailableCalendarsYears(state,action:PayloadAction<string[]>){
                state.years = action.payload
            },
            setHolidayUsers:(state,action:PayloadAction<User[]>) => {
                state.users = action.payload
                for(const [_,v] of Object.entries(state.users)){
                    state.colors[v.username] = v.colour
                }
            }
        },
    })
;

export const {setHolidayCalendar, setAvailableCalendarsYears, setHolidayUsers} = holidaysSlice.actions

export const selectCalendar = (state:holidaysWrapper) => state.holidays.calendar
export const selectYears = (state:holidaysWrapper) => state.holidays.years
export const selectUsers = (state:holidaysWrapper) => state.holidays.users
export const selectBookedDays = (state:holidaysWrapper) => state.holidays.bookedDays
export const selectUserColors = (state:holidaysWrapper) => state.holidays.colors

export default holidaysSlice.reducer;