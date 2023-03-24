import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {StockError} from "../../server-modules/shop/shop";
import {linn, schema} from "../../types";
import {RootState} from "../store";

export const hydrate = createAction<RootState>(HYDRATE);

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
        extraReducers: (builder) => {
            builder
                .addCase(hydrate, (state, action) => {
                    return {
                        ...state,
                        ...action.payload.stockReports
                    };
                })
                .addDefaultCase(() => {
                })
        },
        reducers: {
            setIncorrectStockInitialState: (state, action: PayloadAction<StockError[]>) => {
                const data = action.payload
                let incorrectStock: { [key: string]: StockError[] } = {}
                let zeroStock: { [key: string]: StockError[] } = {}
                for (let i = 0; i < data.length; i++) {
                    if (!data[i].brand) continue;
                    if (data[i].priority) {
                        incorrectStock[data[i].brand!] ??= []
                        incorrectStock[data[i].brand!]!.push(data[i])
                    } else {
                        zeroStock[data[i].brand!] ??= []
                        zeroStock[data[i].brand!]!.push(data[i])
                    }
                }
                state.incorrectStockReport = incorrectStock
                state.zeroStockReport = zeroStock
            },
            setIncorrectStockChecked: (state, action: PayloadAction<{ brand: string, location: number, payload: boolean }>) => {
                const {brand, location,payload} = action.payload
                state.incorrectStockReport[brand][location].checked = payload
            },
            setIncorrectStockSplice: (state, action: PayloadAction<{ brand: string, index: number, amount: number }>) => {
                const {brand, index,amount} = action.payload
                state.incorrectStockReport[brand].splice(index, amount)
            },
            setIncorrectStockQty: (state, action: PayloadAction<{ brand: string, location: number, payload: number }>) => {
                const {brand, location,payload} = action.payload
                state.incorrectStockReport[brand][location].quantity = payload
            },

            setZeroStockInitialState: (state, action: PayloadAction<{ [key: string]: StockError[] }>) => {
                state.zeroStockReport = action.payload
            },
            setZeroStockChecked: (state, action: PayloadAction<{ brand: string, location: number, payload: boolean }>) => {
                const {brand, location,payload} = action.payload
                state.incorrectStockReport[brand][location].checked = payload
            },
            setZeroStockSplice: (state, action: PayloadAction<{ brand: string, index: number, amount: number }>) => {
                const {brand, index,amount} = action.payload
                state.zeroStockReport[brand].splice(index, amount)
            },
            setZeroStockQty: (state, action: PayloadAction<{ brand: string, location: number, payload: number }>) => {
                const {brand, location,payload} = action.payload
                state.zeroStockReport[brand][location].quantity = payload
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

            setStockTakeInfo: (state, action: PayloadAction<{ sku: string, data: schema.StockTake }>) => {
                let pos = state.brandItems.findIndex((item) => item.SKU === action.payload.sku)
                if(pos === -1) return;
                state.brandItems[pos].stockTake = action.payload.data
                let opts = {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(state.brandItems[pos])
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
    setZeroStockChecked, setZeroStockSplice, setZeroStockQty, setValidData, setBrandItems,
    updateStockTakes, setBrands, setStockTakeInfo, unFlagCommit, setStockLevel
} = stockReportsSlice.actions;


export const selectIncorrectStockState = (state: StockReportWrapper) => state.stockReports.incorrectStockReport
export const selectZeroStockState = (state: StockReportWrapper) => state.stockReports.zeroStockReport
export const selectValidData = (state: StockReportWrapper) => state.stockReports.validData
export const selectBrandItems = (state: StockReportWrapper) => state.stockReports.brandItems
export const selectBrands = (state: StockReportWrapper) => state.stockReports.brands

export default stockReportsSlice.reducer;