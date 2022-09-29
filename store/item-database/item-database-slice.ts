import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

export interface itemDatabaseWrapper {
    itemDatabase: itemDatabaseState
}

export interface itemDatabaseState {
    item: itemObject
}

export interface itemObject {
    AMZPRICEINCVAT: string,
    AMZPRIME: boolean,
    BRAND: string,
    BRANDLABEL: {
        image: string,
        path: string,
        brand: string,
        loc: string,
        title1: string,
        title2: string
    }
    CD: { [key: string]: [] },
    CHECK: {
        DONE: {
            AMAZON: boolean,
            EBAY: boolean,
            QS: boolean
        },
        READY: {
            AMAZON: boolean,
            EBAY: boolean,
            QS: boolean
        },
        NA: {
            AMAZON: boolean,
            EBAY: boolean,
            QS: boolean
        },
    }
    COMPDATA: [],
    CP: { AMAZON: {}, EBAY: {}, MAGENTO: {} },
    DESCRIPTION: string
    EAN: string,
    EBAYPRICEINCVAT: string,
    EXTENDEDPROPERTY: {}[],
    HIDE: boolean
    IDBEP: {
        AMZLATENCY: number
        BRAND: string
        COMISO2: string
        COMISO3: string
        TARIFFCODE: string
    },
    IDBFILTER: string,
    IMAGES: { [key: string]: { filename: string, id: string } }
    ISCOMPOSITE: boolean,
    INVCHECK: {}
    INVCHECKDATE: string
    LASTUPDATE: string
    LINKEDSKUS: string[]
    LINNID: string,
    LISTINGVARIATION: boolean,
    MARGINNOTE: string
    MCOVERRIDES: { EBAY: boolean, AMAZON: boolean, MAGENTO: boolean }
    MD: {},
    MINSTOCK: number
    MONTHSTOCKHIST: { [key: string]: { [key: string]: string } }
    ONORDER: []
    PACKAGING: { ITEMS: [] }
    PACKGROUP: string,
    POSTID: string
    POSTMODID: number,
    PURCHASEPRICE: number,
    QSPRICEINCVAT: string,
    RETAILPRICE: number,
    SHIPAMAZONEXP: string
    SHIPCOURIEREXP: string
    SHIPCOURIERSTD: string
    SHIPEBAYSTD: string
    SHIPFORMAT: string
    SHOP: { PRICE: string, STATUS: number },
    SHOPPRICEINCVAT: string,
    SKU: string,
    STOCKINFO: {
        YELLAND: number,
        WAREHOUSE: number
    }
    STOCKTOTAL: number
    STOCKVAL: number
    SUPPLIER: string,
    TITLE: string,
    TITLEWEBSITE: string
    WEIGHT: number,
    _id: string
}

const initialState: itemDatabaseState = {
    item: null
}

export const itemDatabaseSlice = createSlice({
        name: "itemDatabase",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.users
                }
            },
        },
        reducers: {
            setItem: (state, action) => {
                state.item = action.payload
            }
        },
    })
;

export const {setItem} = itemDatabaseSlice.actions

export const selectItem = (state: itemDatabaseWrapper) => state.itemDatabase.item

export default itemDatabaseSlice.reducer;