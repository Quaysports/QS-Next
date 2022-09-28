import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

export interface IncorrectStockItem {
    BRAND: string
    TITLE: string
    SKU: string
    CHECKED: boolean
    QTY: number
    PRIORITY: boolean
}

export interface StockReportState {
    incorrectStockReport: {[key:string]:IncorrectStockItem[]};
    zeroStockReport: {[key:string]:IncorrectStockItem[]};
    brands: string[]
    validData: boolean;
}

export interface StockReportWrapper {
    [key: string]: StockReportState
}

const initialState: StockReportState = {
    incorrectStockReport: {},
    zeroStockReport: {},
    brands: [],
    validData: true,
};

export const stockReportsSlice = createSlice({
        name: "stockReports",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.stockReports,
                };
            },
        },
        reducers:{
            setIncorrectStockInitialState: (state, action) => {state.incorrectStockReport = action.payload},
            setIncorrectStockChecked: (state, action) => {state.incorrectStockReport[action.payload.brand][action.payload.location].CHECKED = action.payload.payload},
            setIncorrectStockSplice: (state, action) => {state.incorrectStockReport[action.payload.brand].splice(action.payload.index, action.payload.amount)},
            setIncorrectStockQty:(state, action) => {state.incorrectStockReport[action.payload.brand][action.payload.location].QTY = action.payload.payload},

            setZeroStockInitialState: (state, action) => {state.zeroStockReport = action.payload},
            setZeroStockChecked: (state, action) => {state.incorrectStockReport[action.payload.brand][action.payload.location].CHECKED = action.payload.payload},
            setZeroStockSplice: (state, action) => {state.zeroStockReport[action.payload.brand].splice(action.payload.index, action.payload.amount)},
            setZeroStockQty:(state, action) => {state.zeroStockReport[action.payload.brand][action.payload.location].QTY = action.payload.payload},

            setValidData: (state, action) => {state.validData = action.payload;},

        },
    })
;

export const {setIncorrectStockInitialState} = stockReportsSlice.actions;
export const {setZeroStockInitialState} = stockReportsSlice.actions
export const {setIncorrectStockQty} = stockReportsSlice.actions;
export const {setZeroStockQty} = stockReportsSlice.actions;
export const {setValidData} = stockReportsSlice.actions;
export const {setIncorrectStockChecked} = stockReportsSlice.actions
export const {setZeroStockChecked} = stockReportsSlice.actions
export const {setZeroStockSplice} = stockReportsSlice.actions
export const {setIncorrectStockSplice} = stockReportsSlice.actions

export const selectIncorrectStockState = (state:StockReportWrapper) => state.stockReports.incorrectStockReport
export const selectZeroStockState = (state: StockReportWrapper) => state.stockReports.zeroStockReport
export const selectValidData = (state: StockReportWrapper) => state.stockReports.validData

export default stockReportsSlice.reducer;