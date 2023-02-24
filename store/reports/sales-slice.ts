import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {RootState} from "../store";
import {MonthTotals, YearTotals} from "../../server-modules/reports/reports";

export const hydrate = createAction<RootState>(HYDRATE);

export interface salesWrapper {
    sales: salesState
}

export interface salesState {
    yearTotals: YearTotals[]
    monthTotals: MonthTotals[]
    lastYearComparison: YearTotals | null

    lastYearMonthComparison: MonthTotals[] | null
    firstYear: string,
    lastYear: string,
}

const initialState: salesState = {
    yearTotals: [],
    monthTotals: [],
    lastYearComparison: null,
    lastYearMonthComparison: null,
    firstYear: "",
    lastYear: "",
}

export const salesSlice = createSlice({
        name: "sales",
        initialState,
        extraReducers: (builder) => {
            builder
                .addCase(hydrate, (state, action) => {
                    return {
                        ...state,
                        ...action.payload.sales
                    };
                })
                .addDefaultCase(() => {
                })
        },
        reducers: {
            setFirstYearAndLastYear: (state, action: PayloadAction<{ firstYear: string, lastYear: string }>) => {
                state.firstYear = action.payload.firstYear
                state.lastYear = action.payload.lastYear
            },
            setYearTotals: (state, action: PayloadAction<YearTotals[]>) => {
                state.yearTotals = action.payload
            },
            setLastYearComparison: (state, action: PayloadAction<YearTotals>) => {
                state.lastYearComparison = action.payload
            },
            setMonthTotals: (state, action: PayloadAction<MonthTotals[]>) => {
                state.monthTotals = action.payload
            },
            setLastYearMonthComparison: (state, action: PayloadAction<MonthTotals[]>) => {
                state.lastYearMonthComparison = action.payload
            }
        },
    })
;

export const {setFirstYearAndLastYear, setYearTotals, setLastYearComparison, setMonthTotals, setLastYearMonthComparison} = salesSlice.actions

export const selectYearTotals = (state: salesWrapper) => state.sales.yearTotals
export const selectLastYearComparison = (state: salesWrapper) => state.sales.lastYearComparison
export const selectFirstYear = (state: salesWrapper) => state.sales.firstYear
export const selectLastYear = (state: salesWrapper) => state.sales.lastYear

export default salesSlice.reducer;