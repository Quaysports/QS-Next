import {createSlice, current} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

export interface OpenOrdersObject {
    _id: string
    arrived: orderObject[]
    complete: boolean
    date: number
    id: string
    price: number
    order: orderObject[]
    supplier: string
}

export interface orderObject {
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
    editOrder: OpenOrdersObject
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
    openOrders: null,
    editOrder: null
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
            setOpenOrders: (state, action) => {state.openOrders = action.payload},
            setEditOrder: (state, action) => {state.editOrder = action.payload},
            setArrivedHandler:(state, action) => {state.loadedOrder.order[action.payload.index].arrived = action.payload.value},
            setBookedInState: (state,action) => {
                if(action.payload.bookedIn === "false") {
                    state.loadedOrder.order[action.payload.index].bookedIn = action.payload.bookedIn
                    state.loadedOrder.arrived.push(state.loadedOrder.order[action.payload.index])
                    state.loadedOrder.order.splice(action.payload.index, 1)
                }
                if(action.payload.bookedIn === "partial"){
                    state.loadedOrder.order[action.payload.index].qty = (state.loadedOrder.order[action.payload.index].qty - state.loadedOrder.order[action.payload.index].arrived)
                    state.loadedOrder.arrived.push(state.loadedOrder.order[action.payload.index])
                    state.loadedOrder.arrived[(state.loadedOrder.arrived.length - 1)].qty = state.loadedOrder.order[action.payload.index].arrived
                    state.loadedOrder.order[action.payload.index].arrived = 0
                }
            }

        },
    })
;

export const {setDeadStock} = shopOrdersSlice.actions
export const {setSideBarContent} = shopOrdersSlice.actions
export const {setSupplierFilter} = shopOrdersSlice.actions
export const {setLoadedOrder} = shopOrdersSlice.actions
export const {setOpenOrders} = shopOrdersSlice.actions
export const {setEditOrder} = shopOrdersSlice.actions
export const {setArrivedHandler} = shopOrdersSlice.actions
export const {setBookedInState} = shopOrdersSlice.actions

export const selectDeadStock = (state: ShopOrdersWrapper) => state.shopOrders.deadStock
export const selectSideBarContent = (state: ShopOrdersWrapper) => {return {content:state.shopOrders.sideBarContent, title: state.shopOrders.sideBarTitle}}
export const selectSupplierFilter = (state: ShopOrdersWrapper) => state.shopOrders.supplierFilter
export const selectLoadedOrder = (state: ShopOrdersWrapper) => state.shopOrders.loadedOrder
export const selectOpenOrders = (state: ShopOrdersWrapper) => state.shopOrders.openOrders
export const selectEditOrder = (state: ShopOrdersWrapper) => state.shopOrders.editOrder

export default shopOrdersSlice.reducer;