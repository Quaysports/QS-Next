import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
export interface YearByYearTotals {
    [key:number]: YearTotals[]
}
export interface YearTotals {
        _id:string,
        total:number,
        totalProfit:number
}

export interface reportsWrapper {
    reports: reportsState
}

export interface reportsState {
    yearByYearTotals: YearByYearTotals
}

const initialState:reportsState = {
    yearByYearTotals:{}
}

export const reportsSlice = createSlice({
        name: "reports",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return{
                    ...state,
                    ...action.payload.reports
                }
            },
        },
        reducers:{

        },
    })
;

export const {} = reportsSlice.actions

export const selectUsers = (state:reportsWrapper) => state.reports.yearByYearTotals

export default reportsSlice.reducer;