import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {StockError} from "../server-modules/shop/shop";

/**
 * @property {string} _id - MongoDB id.
 * @property {string} SKU - SKU.
 * @property {string} EAN - EAN.
 * @property {string} TITLE - Title.
 * @property {number} STOCKTOTAL - Linnworks Stock Level.
 * @property {StockTake} stockTake - Stock take object for update.
 */
export interface BrandItem {
    _id: string
    SKU: string;
    EAN: string;
    TITLE: string;
    STOCKTOTAL: number;
    stockTake?: StockTake
}

/**
 * @property {boolean} checked - Checked toggle filter for committing to Linnworks.
 * @property {Date} date - Date timestamp set on commit.
 * @property {number} quantity - Checked quantity for update.
 */
export interface StockTake {
    checked?: boolean;
    date?: string | null;
    quantity?: number;
}

export interface StockReportState {
    incorrectStockReport: { [key: string]: StockError[] };
    zeroStockReport: { [key: string]: StockError[] };
    brands: string[];
    brandItems: BrandItem[];
    validData: boolean;
}

export interface StockReportWrapper {
    [key: string]: StockReportState
}

const initialState: StockReportState = {
    incorrectStockReport: {},
    zeroStockReport: {},
    brands: [],
    brandItems: [],
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
            setIncorrectStockInitialState: (state, action:PayloadAction<{[key:string]:StockError[]}>) => {
                state.incorrectStockReport = action.payload
            },
            setIncorrectStockChecked: (state, action:PayloadAction<{brand:string,location:number,payload:boolean}>) => {
                state.incorrectStockReport[action.payload.brand][action.payload.location].CHECKED = action.payload.payload
            },
            setIncorrectStockSplice: (state, action:PayloadAction<{brand:string,index:number,amount:number}>) => {
                state.incorrectStockReport[action.payload.brand].splice(action.payload.index, action.payload.amount)
            },
            setIncorrectStockQty: (state, action:PayloadAction<{brand:string,location:number,payload:number}>) => {
                state.incorrectStockReport[action.payload.brand][action.payload.location].QTY = action.payload.payload
            },

            setZeroStockInitialState: (state, action:PayloadAction<{[key:string]:StockError[]}>) => {
                state.zeroStockReport = action.payload
            },
            setZeroStockChecked: (state, action:PayloadAction<{brand:string,location:number,payload:boolean}>) => {
                state.incorrectStockReport[action.payload.brand][action.payload.location].CHECKED = action.payload.payload
            },
            setZeroStockSplice: (state, action:PayloadAction<{brand:string,index:number,amount:number}>) => {
                state.zeroStockReport[action.payload.brand].splice(action.payload.index, action.payload.amount)
            },
            setZeroStockQty: (state, action:PayloadAction<{brand:string,location:number,payload:number}>) => {
                state.zeroStockReport[action.payload.brand][action.payload.location].QTY = action.payload.payload
            },

            setValidData: (state, action:PayloadAction<boolean>) => {
                state.validData = action.payload;
            },

            setBrands: (state, action:PayloadAction<string[]>) => {
                state.brands = action.payload
            },

            setBrandItems: (state, action:PayloadAction<BrandItem[]>) => {
                state.brandItems = action.payload
            },

            setStockTakeInfo: (state, action:PayloadAction<{index:number,data:StockTake}>) => {
                state.brandItems[action.payload.index].stockTake = action.payload.data
                let opts = {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(state.brandItems[action.payload.index])}
                fetch("/api/items/update-item",opts).then(res=>console.log(res.statusText))
            }
        },
    })
;

export const {
    setIncorrectStockInitialState, setIncorrectStockChecked, setIncorrectStockSplice, setIncorrectStockQty,
    setZeroStockInitialState, setZeroStockChecked, setZeroStockSplice, setZeroStockQty, setValidData, setBrandItems,
    setBrands, setStockTakeInfo
} = stockReportsSlice.actions;


export const selectIncorrectStockState = (state: StockReportWrapper) => state.stockReports.incorrectStockReport
export const selectZeroStockState = (state: StockReportWrapper) => state.stockReports.zeroStockReport
export const selectValidData = (state: StockReportWrapper) => state.stockReports.validData
export const selectBrandItems = (state: StockReportWrapper) => state.stockReports.brandItems
export const selectBrands = (state:StockReportWrapper) => state.stockReports.brands

export default stockReportsSlice.reducer;