import {createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {Fees} from "../server-modules/fees/fees";
import {Postage} from "../server-modules/postage/postage";
import {Packaging} from "../server-modules/packaging/packaging";
import ChannelMarginData = schema.ChannelMarginData;
import {schema} from "../types";

export type MarginItem = Pick<schema.Item,
    "SKU" |
    "title" |
    "postage" |
    "stock" |
    "marginNote" |
    "marginData" |
    "linnId" |
    "checkboxStatus" |
    "packaging" |
    "prices" |
    "channelPrices" |
    "channelData" |
    "discounts" |
    "mappedExtendedProperties" |
    "tags"
>

export interface marginCalculatorWrapper {
    marginCalculator: marginCalculatorState
}

export interface marginCalculatorState {
    marginData: MarginItem[]
    suppliers: string[]
    totalStockValue: number
    fees: Fees | null
    postage: { [key: string]: Postage } | null
    packaging: { [key: string]: Packaging } | null
    marginUpdateRequired: boolean,
    amazonMarginTest: number | null
    ebayMarginTest: number | null
    tables: MarginTables
    searchItems: MarginItem[]
    renderedItems: MarginItem[]
    activeIndex: string | null
    uploadedIndexes: string[]
    displayTitles: boolean
    threshold: number
    maxThreshold: number
    currentSort: string
}

export interface MarginTables {
    [key: string]: boolean
}

const initialState: marginCalculatorState = {
    marginData: [],
    suppliers: [],
    totalStockValue: 0,
    fees: null,
    postage: null,
    packaging: null,
    marginUpdateRequired: false,
    amazonMarginTest: null,
    ebayMarginTest: null,
    tables: {
        InfoTable: true,
        PricesTable: true,
        StatsTable: true,
        CostsTable: true,
        EbayTable: true,
        AmazonTable: true,
        MagentoTable: true,
        ShopTable: true,
        MiscTable: true,
    },
    searchItems: [],
    renderedItems: [],
    activeIndex: null,
    uploadedIndexes: [],
    displayTitles: false,
    threshold: 50,
    maxThreshold: 50,
    currentSort: ""
}

export const marginCalculatorSlice = createSlice({
        name: "marginCalculator",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.marginCalculator
                }
            },
        },
        reducers: {
            setMarginData: (state, action: PayloadAction<MarginItem[]>) => {
                state.marginData = action.payload
                state.searchItems = action.payload
                state.activeIndex = null
                state.renderedItems = state.marginData.slice(0, state.maxThreshold)
            },
            setSuppliers: (state, action: PayloadAction<string[]>) => {
                state.suppliers = action.payload
            },
            setTotalStockValue: (state, action: PayloadAction<number>) => {
                state.totalStockValue = action.payload
            },
            setFees: (state, action: PayloadAction<Fees>) => {
                state.fees = action.payload
            },
            updateFees: (state, action: PayloadAction<Fees>) => {
                const opts = {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(action.payload)
                }
                fetch("/api/fees/update", opts).then(res => {
                    console.log(res)
                })
            },
            setPostage: (state, action: PayloadAction<Postage[]>) => {
                if (!action.payload) return
                let idMappedObj: { [key: string]: Postage } = {}
                for (let value of action.payload) idMappedObj[value.id] = value
                state.postage = idMappedObj
            },
            updatePostage: (state, action: PayloadAction<Postage>) => {
                const opts = {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(action.payload)
                }
                fetch("/api/postage/update", opts).then(res => {
                    console.log(res)
                })
            },
            setPackaging: (state, action: PayloadAction<Packaging[]>) => {
                if (!action.payload) return
                let idMappedObj: { [key: string]: Packaging } = {}
                for (let value of action.payload) idMappedObj[value.id] = value
                state.packaging = idMappedObj
            },
            updatePackaging: (state, action: PayloadAction<Packaging>) => {
                const opts = {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(action.payload)
                }
                fetch("/api/packaging/update", opts).then(res => {
                    console.log(res)
                })
            },
            setSearchItems: (state, action: PayloadAction<MarginItem[]>) => {
                state.searchItems = action.payload
                state.maxThreshold = 50
                state.activeIndex = null
                state.renderedItems = state.searchItems.slice(0, state.maxThreshold)
            },
            sortMarginData: (state, action: PayloadAction<{ channel:"amazon" | "ebay" | "magento" | "shop", key: keyof ChannelMarginData, ascending?: boolean }>) => {
                const {channel, key} = action.payload
                state.currentSort = `${channel}-${key}`
                const asc = action.payload.ascending === undefined ? true : action.payload.ascending
                state.searchItems.sort((a, b) => {
                    if (a.marginData[channel][key]! > b.marginData[channel][key]!) return asc ? 1 : -1
                    if (b.marginData[channel][key]! > a.marginData[channel][key]!) return asc ? -1 : 1
                    return 0
                })
                state.renderedItems = state.searchItems.slice(0, state.maxThreshold)
            },
            updateMarginData: (state, action: PayloadAction<MarginItem>) => {
                if (state.searchItems.length > 0) {
                    for (let index in state.searchItems) {
                        if (state.searchItems[index].SKU === action.payload.SKU) {
                            state.searchItems[index] = action.payload
                        }
                    }
                }
                for (let index in state.marginData) {
                    if (state.marginData[index].SKU === action.payload.SKU) {
                        state.marginData[index] = action.payload
                    }
                }
                state.searchItems.length > 0
                    ? state.renderedItems = state.searchItems.slice(0, state.maxThreshold)
                    : state.renderedItems = state.marginData.slice(0, state.maxThreshold)
            },
            updateMCOverrides: (state, action: PayloadAction<{ item: MarginItem, key: keyof MarginItem["checkboxStatus"]["marginCalculator"], value: boolean }>) => {
                if (state.searchItems.length > 0) {
                    for (let index in state.searchItems) {
                        if (state.searchItems[index].SKU === action.payload.item.SKU) {
                            state.searchItems[index].checkboxStatus.marginCalculator[action.payload.key] = action.payload.value
                        }
                    }
                }
                for (let index in state.marginData) {
                    if (state.marginData[index].SKU === action.payload.item.SKU) {
                        state.marginData[index].checkboxStatus.marginCalculator[action.payload.key] = action.payload.value
                        const opt = {
                            method: 'POST',
                            headers: {"Content-Type": "application/json",},
                            body: JSON.stringify(current(state.marginData[index]))
                        }
                        fetch('/api/items/update-item', opt).then(res => console.log(res))
                    }
                }
                state.renderedItems = state.searchItems.length > 0
                    ? state.searchItems.slice(0, state.maxThreshold)
                    : state.marginData.slice(0, state.maxThreshold)
            },
            incrementThreshold: (state) => {
                state.maxThreshold += state.threshold
                state.searchItems.length > 0
                    ? state.renderedItems = state.searchItems.slice(0, state.maxThreshold)
                    : state.renderedItems = state.marginData.slice(0, state.maxThreshold)
            },
            setActiveIndex: (state, action: PayloadAction<string | null>) => {
                action.payload !== state.activeIndex ? state.activeIndex = action.payload : state.activeIndex = null
            },
            updateUploadedIndexes: (state, action: PayloadAction<string>) => {
                if(!state.uploadedIndexes.includes(action.payload)) state.uploadedIndexes.push(action.payload)
            },
            setMarginTest: (state, action: PayloadAction<{ type: string, value: number }>) => {
                switch (action.payload.type) {
                    case "Amazon": {
                        state.amazonMarginTest = action.payload.value;
                        break;
                    }
                    case "Ebay": {
                        state.ebayMarginTest = action.payload.value;
                        break;
                    }
                }
            }
        },
    })
;

export const {
    setMarginData,
    setSuppliers,
    setTotalStockValue,
    setFees,
    updateFees,
    setPostage,
    updatePostage,
    setPackaging,
    updatePackaging,
    updateMarginData,
    updateMCOverrides,
    sortMarginData,
    setActiveIndex,
    updateUploadedIndexes,
    incrementThreshold,
    setSearchItems,
    setMarginTest
} = marginCalculatorSlice.actions

export const selectMarginData = (state: marginCalculatorWrapper) => state.marginCalculator.marginData
export const selectSearchData = (state: marginCalculatorWrapper) => state.marginCalculator.searchItems
export const selectSuppliers = (state: marginCalculatorWrapper) => state.marginCalculator.suppliers
export const selectTotalStockValue = (state: marginCalculatorWrapper) => state.marginCalculator.totalStockValue
export const selectFees = (state: marginCalculatorWrapper) => state.marginCalculator.fees
export const selectPostage = (state: marginCalculatorWrapper) => state.marginCalculator.postage
export const selectPackaging = (state: marginCalculatorWrapper) => state.marginCalculator.packaging
export const selectActiveIndex = (state: marginCalculatorWrapper) => state.marginCalculator.activeIndex
export const selectUploadedIndexes = (state: marginCalculatorWrapper) => state.marginCalculator.uploadedIndexes
export const selectDisplayTitles = (state: marginCalculatorWrapper) => state.marginCalculator.displayTitles
export const selectRenderedItems = (state: marginCalculatorWrapper) => state.marginCalculator.renderedItems
export const selectCurrentSort = (state: marginCalculatorWrapper) => state.marginCalculator.currentSort
export const selectAmazonMarginTest = (state: marginCalculatorWrapper) => state.marginCalculator.amazonMarginTest
export const selectEbayMarginTest = (state: marginCalculatorWrapper) => state.marginCalculator.ebayMarginTest

export default marginCalculatorSlice.reducer;