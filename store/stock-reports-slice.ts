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
    incorrectStockReport: { [key: string]: IncorrectStockItem[] };
    zeroStockReport: { [key: string]: IncorrectStockItem[] };
    brands: string[];
    brandItems:{
        _id:string;
        SKU:string;
        EAN:string;
        TITLE:string;
        STOCKTOTAL:number;
    }[];
    validData: boolean;
}

export interface StockReportWrapper {
    [key: string]: StockReportState
}

const initialState: StockReportState = {
    incorrectStockReport: {},
    zeroStockReport: {},
    brands: [],
    brandItems:[],
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
        reducers: {
            setIncorrectStockInitialState: (state, action) => {
                state.incorrectStockReport = action.payload
            },
            setIncorrectStockChecked: (state, action) => {
                state.incorrectStockReport[action.payload.brand][action.payload.location].CHECKED = action.payload.payload
            },
            setIncorrectStockSplice: (state, action) => {
                state.incorrectStockReport[action.payload.brand].splice(action.payload.index, action.payload.amount)
            },
            setIncorrectStockQty: (state, action) => {
                state.incorrectStockReport[action.payload.brand][action.payload.location].QTY = action.payload.payload
            },

            setZeroStockInitialState: (state, action) => {
                state.zeroStockReport = action.payload
            },
            setZeroStockChecked: (state, action) => {
                state.incorrectStockReport[action.payload.brand][action.payload.location].CHECKED = action.payload.payload
            },
            setZeroStockSplice: (state, action) => {
                state.zeroStockReport[action.payload.brand].splice(action.payload.index, action.payload.amount)
            },
            setZeroStockQty: (state, action) => {
                state.zeroStockReport[action.payload.brand][action.payload.location].QTY = action.payload.payload
            },

            setValidData: (state, action) => {
                state.validData = action.payload;
            },

            setBrandItems: (state, action) => {
                state.brandItems = action.payload
            }
        },
    })
;

export const {
    setIncorrectStockInitialState, setIncorrectStockChecked, setIncorrectStockSplice, setIncorrectStockQty,
    setZeroStockInitialState, setZeroStockChecked, setZeroStockSplice, setZeroStockQty, setValidData, setBrandItems
} = stockReportsSlice.actions;


export const selectIncorrectStockState = (state: StockReportWrapper) => state.stockReports.incorrectStockReport
export const selectZeroStockState = (state: StockReportWrapper) => state.stockReports.zeroStockReport
export const selectValidData = (state: StockReportWrapper) => state.stockReports.validData
export const selectBrandItems = (state: StockReportWrapper) => state.stockReports.brandItems

export default stockReportsSlice.reducer;