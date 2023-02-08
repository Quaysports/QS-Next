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

export interface salesWrapper {
    sales: salesState
}

export interface salesState {
    yearByYearTotals: YearByYearTotals
}

const initialState:salesState = {
    yearByYearTotals:{}
}

export const salesSlice = createSlice({
        name: "sales",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return{
                    ...state,
                    ...action.payload.sales
                }
            },
        },
        reducers:{

        },
    })
;

export const {} = salesSlice.actions

export const selectReport = (state:salesWrapper) => state.sales.yearByYearTotals

export default salesSlice.reducer;