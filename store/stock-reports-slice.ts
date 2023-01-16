import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {StockError} from "../server-modules/shop/shop";

/**
 * @property {string} _id
 * @property {string} SKU
 * @property {string} EAN
 * @property {string} TITLE
 * @property {number} STOCKTOTAL
 * @property {StockTake} [stockTake]
 */
export interface BrandItem {
    _id: string
    SKU: string;
    EAN: string;
    title: string;
    stock: schema.Stock;
    stockTake?: schema.StockTake
}

/**
 * @property {{ [key: string]: StockError[] }} incorrectStockReport
 * @property {{ [key: string]: StockError[] }} zeroStockReport
 * @property {string[]} brands
 * @property {BrandItem[]} brandItems
 * @property {boolean} validData
 */
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
    validData: true
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
            setIncorrectStockInitialState: (state, action: PayloadAction<StockError[]>) => {
                const data = action.payload
                let incorrectStock: { [key: string]: StockError[] } = {}
                let zeroStock: { [key: string]: StockError[] } = {}
                for (let i = 0; i < data.length; i++) {
                    if (!data[i].BRAND) continue;
                    if (data[i].PRIORITY) {
                        incorrectStock[data[i].BRAND!] ??= []
                        incorrectStock[data[i].BRAND!]!.push(data[i])
                    } else {
                        zeroStock[data[i].BRAND!] ??= []
                        zeroStock[data[i].BRAND!]!.push(data[i])
                    }
                }
                state.incorrectStockReport = incorrectStock
                state.zeroStockReport = zeroStock
            },
            setIncorrectStockChecked: (state, action: PayloadAction<{ brand: string, location: number, payload: boolean }>) => {
                state.incorrectStockReport[action.payload.brand][action.payload.location].CHECKED = action.payload.payload
            },
            setIncorrectStockSplice: (state, action: PayloadAction<{ brand: string, index: number, amount: number }>) => {
                state.incorrectStockReport[action.payload.brand].splice(action.payload.index, action.payload.amount)
            },
            setIncorrectStockQty: (state, action: PayloadAction<{ brand: string, location: number, payload: number }>) => {
                state.incorrectStockReport[action.payload.brand][action.payload.location].QTY = action.payload.payload
            },

            setZeroStockInitialState: (state, action: PayloadAction<{ [key: string]: StockError[] }>) => {
                state.zeroStockReport = action.payload
            },
            setZeroStockChecked: (state, action: PayloadAction<{ brand: string, location: number, payload: boolean }>) => {
                state.incorrectStockReport[action.payload.brand][action.payload.location].CHECKED = action.payload.payload
            },
            setZeroStockSplice: (state, action: PayloadAction<{ brand: string, index: number, amount: number }>) => {
                state.zeroStockReport[action.payload.brand].splice(action.payload.index, action.payload.amount)
            },
            setZeroStockQty: (state, action: PayloadAction<{ brand: string, location: number, payload: number }>) => {
                state.zeroStockReport[action.payload.brand][action.payload.location].QTY = action.payload.payload
            },

            setValidData: (state, action: PayloadAction<boolean>) => {
                state.validData = action.payload;
            },

            setBrands: (state, action: PayloadAction<string[]>) => {
                state.brands = action.payload
            },

            setBrandItems: (state, action: PayloadAction<BrandItem[]>) => {
                state.brandItems = action.payload
            },

            updateStockTakes: (state, action: PayloadAction<schema.StockTake[]>) => {
                for (const i in state.brandItems) {
                    state.brandItems[i].stockTake = {...state.brandItems[i].stockTake, ...action.payload[i]}
                }
                let opts = {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(state.brandItems)
                }
                fetch("/api/items/bulk-update-items", opts)
            },

            setStockTakeInfo: (state, action: PayloadAction<{ index: number, data: schema.StockTake }>) => {
                state.brandItems[action.payload.index].stockTake = action.payload.data
                let opts = {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(state.brandItems[action.payload.index])
                }
                fetch("/api/items/update-item", opts)
            },

            unFlagCommit: (state, action: PayloadAction<number>) => {
                state.brandItems[action.payload].stockTake = {...state.brandItems[action.payload].stockTake, ...{date: null}}
            },

            setStockLevel: (state, action: PayloadAction<linn.ItemStock[]>) => {
                let updateArr = []
                for (const item of action.payload) {
                    for (const brandItem of state.brandItems) {
                        if (brandItem.SKU !== item.SKU) continue;
                        brandItem.stock.total = item.StockLevel
                        updateArr.push(brandItem)
                    }
                }
                let opts = {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(updateArr)
                }
                fetch("/api/items/bulk-update-items", opts)

            }
        },
    })
;

export const {
    setIncorrectStockInitialState, setIncorrectStockChecked, setIncorrectStockSplice, setIncorrectStockQty,
    setZeroStockInitialState, setZeroStockChecked, setZeroStockSplice, setZeroStockQty, setValidData, setBrandItems,
    updateStockTakes, setBrands, setStockTakeInfo, unFlagCommit, setStockLevel
} = stockReportsSlice.actions;


export const selectIncorrectStockState = (state: StockReportWrapper) => state.stockReports.incorrectStockReport
export const selectZeroStockState = (state: StockReportWrapper) => state.stockReports.zeroStockReport
export const selectValidData = (state: StockReportWrapper) => state.stockReports.validData
export const selectBrandItems = (state: StockReportWrapper) => state.stockReports.brandItems
export const selectBrands = (state: StockReportWrapper) => state.stockReports.brands

export default stockReportsSlice.reducer;