import {createSlice, current, PayloadAction} from "@reduxjs/toolkit";
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
    bookedIn?: string
    qty: number
    tradePack: number
    arrived?: number
    PURCHASEPRICE: number
    deadStock?: boolean
    newProduct?: boolean
    lowStock?: boolean
}

interface ShopOrdersState {
    deadStock: { [key: string]: { SUPPLIER: string, SKU: string, TITLE: string }[] };
    sideBarContent: { [key: string]: string }
    sideBarTitle: string
    supplierFilter: string
    loadedOrder: OpenOrdersObject
    openOrders: { [key: string]: OpenOrdersObject }
    editOrder: OpenOrdersObject
    newOrderArray: orderObject[]
    totalPrice: number
    supplierItems: orderObject[]
    radioButtons: {
        lowStock: boolean,
        allItems: boolean
    }
    renderedArray: orderObject[]
    lowStockArray: orderObject[]
    threshold: number
    completedOrders: {[key:string]:OpenOrdersObject[]}
    orderContents: OpenOrdersObject
}

export interface ShopOrdersWrapper {
    shopOrders: ShopOrdersState
}

const initialState: ShopOrdersState = {
    deadStock: {},
    sideBarContent: {},
    sideBarTitle: "",
    supplierFilter: "",
    loadedOrder: null,
    openOrders: null,
    editOrder: null,
    newOrderArray: [],
    totalPrice: 0,
    supplierItems: [],
    radioButtons: {
        lowStock: true,
        allItems: false
    },
    renderedArray: [],
    lowStockArray: [],
    threshold: 50,
    completedOrders: null,
    orderContents: null

};

export const shopOrdersSlice = createSlice({
        name: "shopOrders",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.shopOrders,
                };
            },
        },
        reducers: {
            setDeadStock: (state, action) => {
                state.deadStock = action.payload
            },
            setSideBarContent: (state, action: PayloadAction<{ content: { [key: string]: string }, title: string }>) => {
                state.sideBarContent = action.payload.content;
                state.sideBarTitle = action.payload.title
            },
            setSupplierFilter: (state, action) => {
                state.newOrderArray = []
                state.supplierFilter = action.payload
            },
            setLoadedOrder: (state, action) => {
                state.loadedOrder = action.payload
            },
            setOpenOrders: (state, action) => {
                state.openOrders = action.payload
            },
            setEditOrder: (state, action:PayloadAction<OpenOrdersObject>) => {
                state.editOrder = action.payload
                state.newOrderArray = action.payload.order
                state.supplierFilter = action.payload.supplier
            },
            setArrivedHandler: (state, action) => {
                state.loadedOrder.order[action.payload.index].arrived = action.payload.value
            },
            setBookedInState: (state, action) => {
                if (action.payload.bookedIn === "false") {
                    state.loadedOrder.order[action.payload.index].bookedIn = action.payload.bookedIn
                    state.loadedOrder.arrived.push(state.loadedOrder.order[action.payload.index])
                    state.loadedOrder.order.splice(action.payload.index, 1)
                }
                if (action.payload.bookedIn === "partial") {
                    state.loadedOrder.order[action.payload.index].qty = (state.loadedOrder.order[action.payload.index].qty - state.loadedOrder.order[action.payload.index].arrived)
                    state.loadedOrder.arrived.push(state.loadedOrder.order[action.payload.index])
                    state.loadedOrder.arrived[(state.loadedOrder.arrived.length - 1)].qty = state.loadedOrder.order[action.payload.index].arrived
                    state.loadedOrder.order[action.payload.index].arrived = 0
                }
            },
            setNewOrderArray: (state, action) => {
                state.newOrderArray.push(action.payload)
            },
            setTotalPrice: (state, action) => {
                state.totalPrice = action.payload
            },
            setSupplierItems: (state, action) => {
                state.supplierItems = action.payload
            },
            setChangeOrderQty:(state, action:PayloadAction<{item: orderObject, type:string, index:number, value:string}>) => {
                if (action.payload.type === "qty") state.newOrderArray[action.payload.index].qty = parseFloat(action.payload.value)
                if (action.payload.type === "tradePack") state.newOrderArray[action.payload.index].tradePack = parseFloat(action.payload.value)
                state.totalPrice = totalPriceCalc(state.newOrderArray)
            },
            setChangeOrderArray: (state, action: PayloadAction<{ item: orderObject, type: string, index: number}>) => {
                if (action.payload.type === "remove") {
                    state.newOrderArray.splice(action.payload.index, 1)
                    state.supplierItems.push(action.payload.item)
                }
                if (action.payload.type === "add") {
                    state.newOrderArray.push(action.payload.item)
                    if (action.payload.index >= 0) state.supplierItems.splice(action.payload.index, 1)
                }
                state.totalPrice = totalPriceCalc(state.newOrderArray)
            },
            setRadioButtons: (state, action: PayloadAction<{ lowStock: boolean, allItems: boolean }>) => {
                state.radioButtons.lowStock = action.payload.lowStock
                state.radioButtons.allItems = action.payload.allItems
            },
            setThreshold: (state, action) => {
                state.threshold = action.payload
            },
            setLowStockArray: (state, action) => {
                state.lowStockArray = action.payload
            },
            setRenderedArray: (state, action) => {
                state.renderedArray = action.payload
            },
            setInputChange: (state, action: PayloadAction<{ key: string, index: number, value: string }>) => {
                if (state.radioButtons.lowStock) {
                    console.log("lowStock")
                    if (action.payload.key === "qty") state.lowStockArray[action.payload.index].qty = Number(action.payload.value)
                    if (action.payload.key === "tradePack") state.lowStockArray[action.payload.index].tradePack = Number(action.payload.value)
                    console.log(current(state))
                }
                if (state.radioButtons.allItems) {
                    console.log("allItems")
                    if (action.payload.key === "qty") state.renderedArray[action.payload.index].qty = Number(action.payload.value)
                    if (action.payload.key === "tradePack") state.renderedArray[action.payload.index].tradePack = Number(action.payload.value)
                }
                console.log(action.payload.key)
            },
            setChangeLowStockArray: (state, action) => {state.lowStockArray.splice(action.payload, 1)},
            setCompletedOrders: (state, action) => {state.completedOrders = action.payload},
            setOrderContents: (state, action) => {state.orderContents = action.payload},
            setOrderInfoReset:(state, action) => {
                state.editOrder = null
                state.totalPrice = 0
                state.supplierFilter= ""
            }
        },
    })
;

function totalPriceCalc(array){
    let totalPrice = 0
    for(let i = 0; i < array.length; i ++){
        let price = array[i].PURCHASEPRICE * (array[i].qty * array[i].tradePack)
        totalPrice += price
    }
    return parseFloat(totalPrice.toFixed(2))
}

export const {
    setDeadStock,
    setSideBarContent,
    setSupplierFilter,
    setLoadedOrder,
    setOpenOrders,
    setEditOrder,
    setArrivedHandler,
    setBookedInState,
    setNewOrderArray,
    setTotalPrice,
    setSupplierItems,
    setChangeOrderArray,
    setRadioButtons,
    setThreshold,
    setLowStockArray,
    setRenderedArray,
    setInputChange,
    setChangeLowStockArray,
    setChangeOrderQty,
    setCompletedOrders,
    setOrderContents,
    setOrderInfoReset
} = shopOrdersSlice.actions


export const selectDeadStock = (state: ShopOrdersWrapper) => state.shopOrders.deadStock
export const selectSideBarContent = (state: ShopOrdersWrapper) => {
    return {content: state.shopOrders.sideBarContent, title: state.shopOrders.sideBarTitle}
}
export const selectSupplierFilter = (state: ShopOrdersWrapper) => state.shopOrders.supplierFilter
export const selectLoadedOrder = (state: ShopOrdersWrapper) => state.shopOrders.loadedOrder
export const selectOpenOrders = (state: ShopOrdersWrapper) => state.shopOrders.openOrders
export const selectEditOrder = (state: ShopOrdersWrapper) => state.shopOrders.editOrder
export const selectNewOrderArray = (state: ShopOrdersWrapper) => state.shopOrders.newOrderArray
export const selectTotalPrice = (state: ShopOrdersWrapper) => state.shopOrders.totalPrice
export const selectSupplierItems = (state: ShopOrdersWrapper) => state.shopOrders.supplierItems
export const selectRadioButtons = (state: ShopOrdersWrapper) => state.shopOrders.radioButtons
export const selectThreshold = (state: ShopOrdersWrapper) => state.shopOrders.threshold
export const selectLowStockArray = (state: ShopOrdersWrapper) => state.shopOrders.lowStockArray
export const selectRenderedArray = (state: ShopOrdersWrapper) => state.shopOrders.renderedArray
export const selectCompletedOrders = (state: ShopOrdersWrapper) => state.shopOrders.completedOrders
export const selectOrderContents = (state: ShopOrdersWrapper) => state.shopOrders.orderContents


export default shopOrdersSlice.reducer;