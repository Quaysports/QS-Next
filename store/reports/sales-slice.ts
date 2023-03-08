import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {RootState} from "../store";
import {
    ShopDayTotal,
    OnlineMonthTotal,
    OnlineYearTotals,
    ShopMonthTotal,
    ShopYearTotals, OnlineDayTotal
} from "../../server-modules/reports/reports";

export const hydrate = createAction<RootState>(HYDRATE);

export interface salesWrapper {
    sales: salesState
}

export interface salesState {
    shopYearTotals: ShopYearTotals[]
    onlineYearTotals: OnlineYearTotals[]
    shopMonthTotals: ShopMonthTotal[]
    onlineMonthTotals: OnlineMonthTotal[][]
    shopDayTotals: ShopDayTotal[]
    onlineDayTotals: OnlineDayTotal[]
    shopLastYearComparison: ShopYearTotals| null
    onlineLastYearComparison: OnlineYearTotals | null
    shopLastYearMonthComparison: ShopMonthTotal[] | null
    onlineLastYearMonthComparison: OnlineMonthTotal[][] | null
    firstYear: string,
    lastYear: string,
}

const initialState: salesState = {
    shopYearTotals: [],
    shopMonthTotals: [],
    shopDayTotals: [],
    shopLastYearComparison: null,
    shopLastYearMonthComparison: null,
    onlineDayTotals: [],
    onlineLastYearComparison: [],
    onlineLastYearMonthComparison: [],
    onlineMonthTotals: [],
    onlineYearTotals: [],
    firstYear: "",
    lastYear: ""
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
            setShopYearTotals: (state, action: PayloadAction<ShopYearTotals[]>) => {
                state.shopYearTotals = action.payload
            },
            setShopLastYearComparison: (state, action: PayloadAction<ShopYearTotals>) => {
                state.shopLastYearComparison = action.payload
            },
            setShopMonthTotals: (state, action: PayloadAction<ShopMonthTotal[]>) => {
                state.shopMonthTotals = action.payload
            },
            setShopLastYearMonthComparison: (state, action: PayloadAction<ShopMonthTotal[]>) => {
                state.shopLastYearMonthComparison = action.payload
            },
            setShopDayTotals: (state, action: PayloadAction<ShopDayTotal[]>) => {
                state.shopDayTotals = action.payload
            },
            setOnlineYearTotals: (state, action: PayloadAction<OnlineYearTotals[]>) => {
                state.onlineYearTotals = action.payload
            },
            setOnlineLastYearComparison: (state, action: PayloadAction<OnlineYearTotals>) => {
                state.onlineLastYearComparison = action.payload
            },
            setOnlineMonthTotals: (state, action: PayloadAction<OnlineMonthTotal[][]>) => {
                state.onlineMonthTotals = action.payload
            },
            setOnlineLastYearMonthComparison: (state, action: PayloadAction<OnlineMonthTotal[][]>) => {
                state.onlineLastYearMonthComparison = action.payload
            },
            setOnlineDayTotals: (state, action: PayloadAction<OnlineDayTotal[]>) => {
                state.onlineDayTotals = action.payload
            }
        },
    })
;

export const {setFirstYearAndLastYear, setShopYearTotals, setShopLastYearComparison, setShopMonthTotals,
    setShopLastYearMonthComparison, setShopDayTotals, setOnlineYearTotals, setOnlineLastYearComparison, setOnlineMonthTotals,
    setOnlineLastYearMonthComparison, setOnlineDayTotals,} = salesSlice.actions

export const selectFirstYear = (state: salesWrapper) => state.sales.firstYear
export const selectLastYear = (state: salesWrapper) => state.sales.lastYear
export const selectShopYearTotals = (state: salesWrapper) => state.sales.shopYearTotals
export const selectShopLastYearComparison = (state: salesWrapper) => state.sales.shopLastYearComparison
export const selectShopMonthTotals = (state: salesWrapper) => state.sales.shopMonthTotals
export const selectShopLastYearMonthComparison = (state: salesWrapper) => state.sales.shopLastYearMonthComparison
export const selectShopDayTotals = (state: salesWrapper) => state.sales.shopDayTotals
export const selectOnlineYearTotals = (state: salesWrapper) => state.sales.onlineYearTotals
export const selectOnlineLastYearComparison = (state: salesWrapper) => state.sales.onlineLastYearComparison
export const selectOnlineMonthTotals = (state: salesWrapper) => state.sales.onlineMonthTotals
export const selectOnlineLastYearMonthComparison = (state: salesWrapper) => state.sales.onlineLastYearMonthComparison
export const selectOnlineDayTotals = (state: salesWrapper) => state.sales.onlineDayTotals

export default salesSlice.reducer;