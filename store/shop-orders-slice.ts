import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

export interface OpenOrdersObject {
    _id: string
    arrived: orderObject[] | []
    complete: boolean
    date: number
    id: string
    price: number
    order: orderObject[]
    supplier: string
}

interface orderObject {
    IDBEP: { BRAND: string }
    MINSTOCK: number
    SKU: string
    STOCKTOTAL: string
    TITLE: string
    SUPPLIER: string
    _id: string
    bookedIn: string
    qty: number
    tradePack: number
    arrived: number
    PURCHASEPRICE: number
    deadStock: boolean
    newProduct: boolean
}
interface ShopOrdersState {
    deadStock: {[key:string]:{SUPPLIER: string, SKU:string, TITLE:string}[]};
    sideBarContent: {[key:string] : string}
    sideBarTitle: string
    supplierFilter: string
    loadedOrder: OpenOrdersObject
    openOrders: {[key:string]:OpenOrdersObject}
}

export interface ShopOrdersWrapper {
    [key: string]: ShopOrdersState
}

const initialState: ShopOrdersState = {
    deadStock: {},
    sideBarContent: {},
    sideBarTitle: "",
    supplierFilter: "",
    loadedOrder: null,
    openOrders: null
};

export const shopOrdersSlice = createSlice({
        name: "shopOrders",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload,
                };
            },
        },
        reducers:{
            setDeadStock: (state, action) => {state.deadStock = action.payload},
            setSideBarContent: (state, action) => {state.sideBarContent = action.payload.content; state.sideBarTitle = action.payload.title},
            setSupplierFilter: (state, action) => {state.supplierFilter = action.payload},
            setLoadedOrder: (state, action) => {state.loadedOrder = action.payload},
            setOpenOrders: (state, action) => {state.openOrders = action.payload}
        },
    })
;

export const {setDeadStock} = shopOrdersSlice.actions
export const {setSideBarContent} = shopOrdersSlice.actions
export const {setSupplierFilter} = shopOrdersSlice.actions
export const {setLoadedOrder} = shopOrdersSlice.actions
export const {setOpenOrders} = shopOrdersSlice.actions

export const selectDeadStock = (state: ShopOrdersWrapper) => state.shopOrders.deadStock
export const selectSideBarContent = (state: ShopOrdersWrapper) => {return {content:state.shopOrders.sideBarContent, title: state.shopOrders.sideBarTitle}}
export const selectSupplierFilter = (state: ShopOrdersWrapper) => state.shopOrders.supplierFilter
export const selectLoadedOrder = (state: ShopOrdersWrapper) => state.shopOrders.loadedOrder
export const selectOpenOrders = (state: ShopOrdersWrapper) => state.shopOrders.openOrders

export default shopOrdersSlice.reducer;