import {createSlice, PayloadAction} from "@reduxjs/toolkit";
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
    firstYear: string,
    lastYear: string,
}

const initialState:salesState = {
    yearByYearTotals:{},
    firstYear: "1624360419835",
    lastYear: "1675695034931",
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
            setFirstYearAndLastYear: (state, action:PayloadAction<{firstYear:string,lastYear:string}>) => {
                state.firstYear = action.payload.firstYear
                state.lastYear = action.payload.lastYear
            }
        },
    })
;

export const {setFirstYearAndLastYear} = salesSlice.actions

export const selectReport = (state:salesWrapper) => state.sales.yearByYearTotals
export const selectFirstYear = (state:salesWrapper) => state.sales.firstYear
export const selectLastYear = (state:salesWrapper) => state.sales.lastYear

export default salesSlice.reducer;