import {createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {processData, StockForecastChecks, StockForecastItem} from "../server-modules/stock-forecast/process-data";
import {structuredClone} from "next/dist/compiled/@edge-runtime/primitives/structured-clone";

export interface forecastWrapper {
    forecast: forecastState
}

export interface forecastState {
    initialItems: StockForecastItem[]
    searchItems: StockForecastItem[]
    renderedItems: StockForecastItem[]
    suppliers: string[]
    threshold: number
    maxThreshold: number
}

const initialState: forecastState = {
    initialItems: [],
    searchItems: [],
    renderedItems: [],
    suppliers: [],
    threshold: 50,
    maxThreshold: 50
}

export const forecastSlice = createSlice({
        name: "forecast",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.forecast
                }
            },
        },
        reducers: {
            setInitialItems: (state, action: PayloadAction<StockForecastItem[]>) => {
                state.initialItems = action.payload
                state.maxThreshold = state.threshold
                state.renderedItems = processItemsToRender(state.maxThreshold, action.payload)
            },
            setSearchItems: (state, action: PayloadAction<StockForecastItem[]>) => {
                state.searchItems = action.payload
                state.maxThreshold = state.threshold
                state.renderedItems = processItemsToRender(state.maxThreshold, action.payload)
            },
            setSuppliers: (state, action: PayloadAction<string[]>) => {
                state.suppliers = action.payload
            },
            incrementThreshold: (state) => {
                console.log("increment!")
                state.maxThreshold += state.threshold
                state.searchItems.length > 0
                    ? state.renderedItems = processItemsToRender(state.maxThreshold, current(state.searchItems))
                    : state.renderedItems = processItemsToRender(state.maxThreshold, current(state.initialItems))
            },
            itemCheckboxChange: (state, action: PayloadAction<{ type: keyof StockForecastChecks, index: number, check: boolean }>) => {
                let newCheckedState = {
                    ...state.initialItems[action.payload.index].checkboxStatus.stockForecast,
                    ...{[action.payload.type]: action.payload.check}
                }
                state.initialItems[action.payload.index].checkboxStatus.stockForecast = newCheckedState
                state.renderedItems[action.payload.index].checkboxStatus.stockForecast = newCheckedState
                let opts = {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        SKU: state.initialItems[action.payload.index].SKU,
                        CHECK: {
                            SF: newCheckedState
                        }
                    })
                }
                fetch("/api/items/update-item", opts)
            },
        }
    })
;

function processItemsToRender(threshold: number, items: StockForecastItem[]) {
    const processedData: StockForecastItem[] = []
    for (let i = 0; i <= threshold; i++) {
        if (!items[Number(i)]) continue;
        let clone = structuredClone<StockForecastItem>(items[Number(i)])
        processedData.push(processData(clone, i))
    }
    return processedData
}

export const {
    incrementThreshold,
    setInitialItems,
    setSearchItems,
    setSuppliers,
    itemCheckboxChange
} = forecastSlice.actions

export const selectInitialItems = (state: forecastWrapper) => state.forecast.initialItems
export const selectSuppliers = (state: forecastWrapper) => state.forecast.suppliers
export const selectRenderedItems = (state: forecastWrapper) => state.forecast.renderedItems

export default forecastSlice.reducer;