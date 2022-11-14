import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

export interface MarginItem {
    SKU: string
    TITLE: string
    POSTID: string,
    POSTMODID: string | number,
    STOCKVAL: number,
    STOCKTOTAL: number,
    MARGINNOTE: string,
    MD: sbt.marginData,
    LINNID: string,
    HIDE: boolean,
    PACKGROUP: string,
    PURCHASEPRICE: number,
    RETAILPRICE: number,
    CP: sbt.channelPrice,
    CD: sbt.channelData,
    EBAYPRICEINCVAT: string,
    AMZPRICEINCVAT: string,
    QSPRICEINCVAT: string,
    SHOPPRICEINCVAT: string,
    AMZPRIME: boolean,
    IDBEP: sbt.itemDatabaseExtendedProperties,
    IDBFILTER: string,
    MCOVERRIDES: { [key: string]: boolean }
}

export interface marginCalculatorWrapper {
    marginCalculator: marginCalculatorState
}

export interface marginCalculatorState {
    marginData: MarginItem[]
    fees: Fees | null
    postage: { [key: string]: PostalData } | null
    packaging: { [key: string]: PackagingData } | null
    totalStockVal: number
    amazonMarginTest: number | null
    ebayMarginTest: number | null
    tables: MarginTables
    searchItems: MarginItem[]
    renderedItems: MarginItem[]
    threshold: number
    maxThreshold: number
    currentSort: string
}

export interface MarginTables {
    [key: string]: boolean
}

export interface Fees {
    _id?: { $oid: string };
    LISTING: Listing;
    FLAT: Flat
    VATAPP: VatApplicable
    VAT: number;
    LASTUPDATE: string;
    SUBSCRIPTION: Subscription
}

interface Listing {
    SHOP: string;
    QS: string;
    EBAY: string;
    AMAZ: string
}

interface Flat {
    SHOP: string;
    QS: string;
    EBAY: string;
    AMAZ: string
}

interface Subscription {
    SHOP: string;
    QS: string;
    EBAY: string;
    AMAZ: string
}

interface VatApplicable {
    SHOP: boolean;
    QS: boolean;
    EBAY: boolean;
    AMAZ: boolean
}

interface PostalData {
    _id?: { $oid: string };
    POSTALFORMAT: string;
    POSTID: string;
    VENDOR: string;
    POSTCOSTEXVAT: number;
    SFORMAT: string;
    LINNSHIPPING: string;
    LASTUPDATE: string;
}

interface PackagingData {
    _id?: { $oid: string };
    ID: string;
    LINKEDSKU: string[];
    NAME: string;
    TYPE: string;
    PRICE?: number;
}

const initialState: marginCalculatorState = {
    marginData: [],
    fees: null,
    postage: null,
    packaging: null,
    totalStockVal: 0,
    amazonMarginTest: null,
    ebayMarginTest: null,
    tables: {
        InfoTable: true,
        CostsTable: true,
        EbayTable: true,
        AmazonTable: true,
        MagentoTable: true,
        ShopTable: true,
        MiscTable: true,
    },
    searchItems: [],
    renderedItems: [],
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
                for (const item of state.marginData) state.totalStockVal += item.STOCKVAL
                state.renderedItems = state.marginData.slice(0, state.maxThreshold)
            },
            setFees: (state, action: PayloadAction<Fees>) => {
                state.fees = action.payload
            },
            setPostage: (state, action: PayloadAction<PostalData[]>) => {
                if (!action.payload) return
                let idMappedObj: { [key: string]: PostalData } = {}
                for (let value of action.payload) idMappedObj[value.POSTID] = value
                state.postage = idMappedObj
            },
            setPackaging: (state, action: PayloadAction<PackagingData[]>) => {
                if (!action.payload) return
                let idMappedObj: { [key: string]: PackagingData } = {}
                for (let value of action.payload) idMappedObj[value.ID] = value
                state.packaging = idMappedObj
            },
            setSearchItems: (state, action: PayloadAction<MarginItem[]>) => {
                state.searchItems = action.payload
                state.maxThreshold = 50
                state.renderedItems = state.searchItems.slice(0, state.maxThreshold)
            },
            sortMarginData: (state, action: PayloadAction<{ key: keyof MarginItem["MD"], ascending?: boolean }>) => {
                const key = action.payload.key
                state.currentSort = key
                const asc = action.payload.ascending === undefined ? true : action.payload.ascending
                state.searchItems.sort((a, b) => {
                    if (a.MD[key]! > b.MD[key]!) return asc ? 1 : -1
                    if (b.MD[key]! > a.MD[key]!) return asc ? -1 : 1
                    return 0
                })
                state.renderedItems = state.searchItems.slice(0, state.maxThreshold)
            },
            updateMarginData: (state, action: PayloadAction<MarginItem>) => {
                console.dir(action.payload)
                if (state.searchItems.length > 0) {
                    for (let index in state.searchItems) {
                        if (state.searchItems[index].SKU === action.payload.SKU) state.searchItems[index] = action.payload
                    }
                    state.renderedItems = state.searchItems.slice(0, state.maxThreshold)
                }
                for (let index in state.marginData) {
                    if (state.marginData[index].SKU === action.payload.SKU) state.marginData[index] = action.payload
                    state.renderedItems = state.marginData.slice(0, state.maxThreshold)
                }
            },
            incrementThreshold: (state) => {
                state.maxThreshold += state.threshold
                state.searchItems.length > 0
                    ? state.renderedItems = state.searchItems.slice(0, state.maxThreshold)
                    : state.renderedItems = state.marginData.slice(0, state.maxThreshold)
            },
            toggleTable: (state, action: PayloadAction<keyof MarginTables>) => {
                state.tables[action.payload] = !state.tables[action.payload]
            },
            setMarginTest: (state, action: PayloadAction<{ type: string, value: number }>) => {
                switch(action.payload.type){
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
    setFees,
    setPostage,
    setPackaging,
    updateMarginData,
    sortMarginData,
    toggleTable,
    incrementThreshold,
    setSearchItems,
    setMarginTest
} = marginCalculatorSlice.actions

export const selectMarginData = (state: marginCalculatorWrapper) => state.marginCalculator.marginData
export const selectFees = (state: marginCalculatorWrapper) => state.marginCalculator.fees
export const selectPostage = (state: marginCalculatorWrapper) => state.marginCalculator.postage
export const selectPackaging = (state: marginCalculatorWrapper) => state.marginCalculator.packaging
export const selectTotalStockValData = (state: marginCalculatorWrapper) => state.marginCalculator.totalStockVal
export const selectTableToggles = (state: marginCalculatorWrapper) => state.marginCalculator.tables
export const selectRenderedItems = (state: marginCalculatorWrapper) => state.marginCalculator.renderedItems
export const selectThreshold = (state: marginCalculatorWrapper) => state.marginCalculator.threshold
export const selectMaxThreshold = (state: marginCalculatorWrapper) => state.marginCalculator.maxThreshold
export const selectCurrentSort = (state: marginCalculatorWrapper) => state.marginCalculator.currentSort
export const selectAmazonMarginTest = (state:marginCalculatorWrapper) => state.marginCalculator.amazonMarginTest
export const selectEbayMarginTest = (state:marginCalculatorWrapper) => state.marginCalculator.ebayMarginTest

export default marginCalculatorSlice.reducer;