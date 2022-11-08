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
    MCOVERRIDES: { AMAZON: boolean, EBAY: boolean, MAGENTO: boolean }
}

export interface marginCalculatorWrapper {
    marginCalculator: marginCalculatorState
}

export interface marginCalculatorState {
    marginData: MarginItem[]
    tables:MarginTables
}

export interface MarginTables {
    InfoTable: boolean,
    CostsTable: boolean,
    EbayTable: boolean,
    AmazonTable: boolean,
    MagentoTable: boolean,
    ShopTable: boolean,
    MiscTable: boolean,
}

const initialState: marginCalculatorState = {
    marginData: [],
    tables: {
        InfoTable: true,
        CostsTable: true,
        EbayTable: true,
        AmazonTable: true,
        MagentoTable: true,
        ShopTable: true,
        MiscTable: true,
    }
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
            },
            toggleTable: (state, action: PayloadAction<keyof MarginTables>) => {
                state.tables[action.payload] = !state.tables[action.payload]
            },
        },
    })
;

export const {setMarginData, toggleTable} = marginCalculatorSlice.actions

export const selectMarginData = (state: marginCalculatorWrapper) => state.marginCalculator.marginData
export const selectTableToggles = (state: marginCalculatorWrapper) => state.marginCalculator.tables

export default marginCalculatorSlice.reducer;