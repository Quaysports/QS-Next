import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {RootState} from "./store";
import {StockForecastItem} from "../pages/stock-forecast";
import {dispatchToast} from "../components/toast/dispatch-toast";

export const hydrate = createAction<RootState>(HYDRATE);

export interface forecastWrapper {
    forecast: forecastState
}

export interface forecastState {
    items: StockForecastItem[]
    searchItems: StockForecastItem[]
    suppliers: string[]
    threshold: number
    maxThreshold: number
}

const initialState: forecastState = {
    items: [],
    searchItems: [],
    suppliers: [],
    threshold: 50,
    maxThreshold: 50
}

export const forecastSlice = createSlice({
        name: "forecast",
        initialState,
        extraReducers: (builder) => {
            builder
                .addCase(hydrate, (state, action) => {
                    return {
                        ...state,
                        ...action.payload.forecast
                    };
                })
        },
        reducers: {
            setItems: (state, action: PayloadAction<StockForecastItem[]>) => {
                state.items = action.payload
                state.searchItems = action.payload
                state.maxThreshold = state.threshold
            },
            setSearchItems: (state, action: PayloadAction<StockForecastItem[]>) => {
                state.searchItems = action.payload
                state.maxThreshold = state.threshold
            },
            setSuppliers: (state, action: PayloadAction<string[]>) => {
                state.suppliers = action.payload
            },
            incrementThreshold: (state) => {
                state.maxThreshold += state.threshold
            },
            resetThreshold: (state) => {
                state.maxThreshold = state.threshold
            },
            itemCheckboxChange: (state, action: PayloadAction<StockForecastItem>) => {

                let initialItemPos = state.items.findIndex(item => item.SKU === action.payload.SKU)
                let sku = action.payload.SKU
                if(initialItemPos !== -1) state.items[initialItemPos] = action.payload

                let opts = {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({SKU:action.payload.SKU, checkboxStatus:action.payload.checkboxStatus})
                }
                fetch("/api/items/update-item", opts).then(()=>dispatchToast({content:`${sku} updated`}))
            },
        }
    })
;

export const {
    incrementThreshold,
    setItems,
    setSearchItems,
    setSuppliers,
    itemCheckboxChange
} = forecastSlice.actions

export const selectItems = (state: forecastWrapper) => state.forecast.items
export const selectSearchItems = (state: forecastWrapper) => state.forecast.searchItems
export const selectMaxThreshold = (state: forecastWrapper) => state.forecast.maxThreshold
export const selectSuppliers = (state: forecastWrapper) => state.forecast.suppliers

export default forecastSlice.reducer;