import {createSlice, current, PayloadAction} from "@reduxjs/toolkit";
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
    MCOVERRIDES: { AMAZON: boolean, EBAY: boolean, MAGENTO: boolean }
}

export interface marginCalculatorWrapper {
    marginCalculator: marginCalculatorState
}

export interface marginCalculatorState {
    marginData: MarginItem[]
    fees:Fees | undefined
    postage: { [key:string]:PostalData } | undefined
    packaging: { [key:string]:PackagingData } | undefined
    totalStockVal: number
    tables:MarginTables
    searchItems: MarginItem[]
    renderedItems: MarginItem[]
    threshold: number
    maxThreshold: number
}

export interface MarginTables {
    [key: string]:boolean
}

interface Fees {
    _id?: { $oid: string };
    LISTING: Listing;
    FLAT: Flat
    VATAPP: VatApplicable
    VAT: number;
    LASTUPDATE: string;
    SUBSCRIPTION: Subscription
}

interface Listing { SHOP: string; QS: string; EBAY: string; AMAZ: string }
interface Flat { SHOP: string; QS: string; EBAY: string; AMAZ: string }
interface Subscription { SHOP: string; QS: string; EBAY: string; AMAZ: string }
interface VatApplicable { SHOP: boolean; QS: boolean; EBAY: boolean; AMAZ: boolean }

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
    fees: undefined,
    postage: undefined,
    packaging: undefined,
    totalStockVal: 0,
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
    maxThreshold: 50
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
                for(const item of state.marginData) state.totalStockVal += item.STOCKVAL
                state.renderedItems = state.marginData.slice(0, state.maxThreshold)
            },
            setFees: (state, action: PayloadAction<Fees | undefined>) => {state.fees = action.payload},
            setPostage: (state, action: PayloadAction<PostalData[] | undefined>) => {
                if(!action.payload) return
                let idMappedObj:{ [key:string]:PostalData } = {}
                for(let value of action.payload) idMappedObj[value.POSTID] = value
                state.postage = idMappedObj
            },
            setPackaging: (state, action: PayloadAction<PackagingData[] | undefined>) => {
                if(!action.payload) return
                let idMappedObj:{ [key:string]:PackagingData } = {}
                for(let value of action.payload) idMappedObj[value.ID] = value
                state.packaging = idMappedObj
            },
            setSearchItems: (state, action: PayloadAction<MarginItem[]>) => {
                state.searchItems = action.payload
                state.maxThreshold = 50
                state.renderedItems = state.searchItems.slice(0, state.maxThreshold)
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
        },
    })
;

export const {setMarginData, setFees, setPostage, setPackaging, toggleTable, incrementThreshold, setSearchItems} = marginCalculatorSlice.actions

export const selectMarginData = (state: marginCalculatorWrapper) => state.marginCalculator.marginData
export const selectFees = (state: marginCalculatorWrapper) => state.marginCalculator.fees
export const selectPostage = (state: marginCalculatorWrapper) => state.marginCalculator.postage
export const selectPackaging = (state: marginCalculatorWrapper) => state.marginCalculator.packaging
export const selectTotalStockValData = (state: marginCalculatorWrapper) => state.marginCalculator.totalStockVal?.toFixed(2)
export const selectTableToggles = (state: marginCalculatorWrapper) => state.marginCalculator.tables
export const selectRenderedItems = (state: marginCalculatorWrapper) => state.marginCalculator.renderedItems
export const selectThreshold = (state: marginCalculatorWrapper) => state.marginCalculator.threshold
export const selectMaxThreshold = (state: marginCalculatorWrapper) => state.marginCalculator.maxThreshold

export default marginCalculatorSlice.reducer;