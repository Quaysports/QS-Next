import {createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {DeadStockReport} from "../server-modules/shop/shop";

/**
 * @property {string} _id
 * @property {string} arrived
 * @property {orderObject[]} complete
 * @property {number} date
 * @property {string} id
 * @property {number} price
 * @property {string} order
 * @property {orderObject[]} supplier
 *
 */
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

/**
 * @property {{BRAND: string}} IDBEP
 * @property {number} MINSTOCK
 * @property {string} SKU
 * @property {string} STOCKTOTAL
 * @property {string} TITLE
 * @property {string} SUPPLIER
 * @property {string} _id
 * @property {string} [bookedIn]
 * @property {number} qty
 * @property {number} tradePack
 * @property {number} [arrived]
 * @property {number} PURCHASEPRICE
 * @property {boolean} [deadStock]
 * @property {boolean} [newProduct]
 * @property {boolean} [lowStock]
 * @property {boolean} submitted
 * @property {number} SOLDFLAG
 */
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
    submitted: boolean
    SOLDFLAG: number
}

/**
 * Shop Orders State
 * @property {Object<string, DeadStockReport[]>} deadStock
 * @property {Object<string, string | number> } sideBarContent
 * @property {string} sideBarTitle
 * @property {OpenOrdersObject} loadedOrder
 * @property {Object<string, OpenOrdersObject>} openOrders
 * @property {OpenOrdersObject} editOrder
 * @property {orderObject[]} newOrderArray
 * @property {number} totalPrice
 * @property {orderObject[]} supplierItems
 * @property {radioButtonsObject} radioButtons
 * @property {orderObject[]} renderedArray
 * @property {orderObject[]} lowStockArray
 * @property {number} threshold
 * @property {Object<string, OpenOrdersObject[]>} completedOrders
 * @property {OpenOrdersObject} orderContents
 * </ul>
 */
export interface ShopOrdersState {
    deadStock: { [key: string]: DeadStockReport[] };
    sideBarContent: { [key: string]: string | number }
    sideBarTitle: string
    loadedOrder: OpenOrdersObject | null
    openOrders: { [key: string]: OpenOrdersObject } | null
    editOrder: OpenOrdersObject | null
    newOrderArray: orderObject[]
    totalPrice: number
    supplierItems: orderObject[]
    radioButtons: radioButtonsObject
    renderedArray: orderObject[]
    lowStockArray: orderObject[]
    threshold: number
    completedOrders: { [key: string]: OpenOrdersObject[] } | null
    orderContents: OpenOrdersObject | null
}


/**
 * Radio Buttons Object
 * @property {boolean} lowStock
 * @property {boolean} allItems
 */

export interface radioButtonsObject {
    lowStock: boolean
    allItems: boolean
}

/**
 * @property {ShopOrdersState} shopOrders
 */
export interface ShopOrdersWrapper {
    shopOrders: ShopOrdersState
}

const initialState: ShopOrdersState = {
    deadStock: {},
    sideBarContent: {},
    sideBarTitle: "",
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
            setDeadStock: (state, action: PayloadAction<ShopOrdersState["deadStock"]>) => {
                state.deadStock = action.payload
            },
            setSideBarContent: (state, action: PayloadAction<{ content: { [key: string]: string | number }, title: string }>) => {
                state.sideBarContent = action.payload.content;
                state.sideBarTitle = action.payload.title
            },
            setLoadedOrder: (state, action:PayloadAction<OpenOrdersObject | null>) => {
                state.loadedOrder = action.payload
            },
            setOpenOrders: (state, action:PayloadAction<{[key:string]:OpenOrdersObject}>) => {
                state.openOrders = action.payload
            },
            setEditOrder: (state, action: PayloadAction<OpenOrdersObject>) => {
                state.editOrder = action.payload
                state.newOrderArray = action.payload.order
            },
            setArrivedHandler: (state, action:PayloadAction<{ index: number, value:number }>) => {
                state.loadedOrder!.order[action.payload.index].arrived = action.payload.value
            },
            setBookedInState: (state, action:PayloadAction<{ bookedIn:string, index:number }>) => {
                if (action.payload.bookedIn === "false") {
                    state.loadedOrder!.order[action.payload.index].bookedIn = action.payload.bookedIn
                    state.loadedOrder!.arrived.push(state.loadedOrder!.order[action.payload.index])
                    state.loadedOrder!.order.splice(action.payload.index, 1)
                }
                if (action.payload.bookedIn === "partial") {
                    state.loadedOrder!.order[action.payload.index].qty = (state.loadedOrder!.order[action.payload.index].qty - state.loadedOrder!.order[action.payload.index].arrived!)
                    state.loadedOrder!.arrived.push(state.loadedOrder!.order[action.payload.index])
                    state.loadedOrder!.arrived[(state.loadedOrder!.arrived.length - 1)].qty = state.loadedOrder!.order[action.payload.index].arrived!
                    state.loadedOrder!.order[action.payload.index].arrived = 0
                }
            },
            setRemoveFromBookedInState: (state, action: PayloadAction<{ index: number, SKU: string }>) => {
                let order = state.loadedOrder!
                const i = order.order.map((item: orderObject) => item.SKU).indexOf(action.payload.SKU)
                if (i > -1) {
                    order.order[i].qty = (order.order[i].qty + order.arrived[action.payload.index].arrived!)
                    order.order[i].arrived = 0
                    order.arrived.splice(action.payload.index, 1)
                } else {
                    order.arrived[action.payload.index].arrived = 0
                    order.order.push(order.arrived[action.payload.index])
                    order.arrived.splice(action.payload.index, 1)
                }
                const opts = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
                    },
                    body: JSON.stringify(state.loadedOrder)
                }
                fetch("/api/shop-orders/update-order", opts).then()
            },
            setTotalPrice: (state, action:PayloadAction<number>) => {
                state.totalPrice = action.payload
            },
            setSupplierItems: (state, action:PayloadAction<orderObject[]>) => {
                state.supplierItems = action.payload
            },
            setChangeOrderQty: (state, action: PayloadAction<{ item: orderObject, type: string, index: number, value: string }>) => {
                if (action.payload.type === "qty") state.newOrderArray[action.payload.index].qty = parseFloat(action.payload.value)
                if (action.payload.type === "tradePack") state.newOrderArray[action.payload.index].tradePack = parseFloat(action.payload.value)
                state.totalPrice = totalPriceCalc(state.newOrderArray)
            },
            setChangeOrderArray: (state, action: PayloadAction<{ item: orderObject, type: string, index?: number }>) => {
                if (action.payload.type === "remove") {
                    state.newOrderArray.splice(action.payload.index!, 1)
                    state.supplierItems.push(action.payload.item)
                }
                if (action.payload.type === "add") {
                    state.newOrderArray.push(action.payload.item)
                    if (action.payload.index) state.supplierItems.splice(action.payload.index, 1)
                }
                state.totalPrice = totalPriceCalc(state.newOrderArray)
            },
            setRadioButtons: (state, action: PayloadAction<{ lowStock: boolean, allItems: boolean }>) => {
                state.radioButtons.lowStock = action.payload.lowStock
                state.radioButtons.allItems = action.payload.allItems
            },
            setThreshold: (state, action:PayloadAction<number>) => {
                state.threshold = action.payload
            },
            setLowStockArray: (state, action:PayloadAction<orderObject[]>) => {
                state.lowStockArray = action.payload
            },
            setRenderedArray: (state, action:PayloadAction<orderObject[]>) => {
                state.renderedArray = action.payload
            },
            setInputChange: (state, action: PayloadAction<{ key: string, index: number, value: string }>) => {
                if (state.radioButtons.lowStock) {
                    if (action.payload.key === "qty") state.lowStockArray[action.payload.index].qty = Number(action.payload.value)
                    if (action.payload.key === "tradePack") state.lowStockArray[action.payload.index].tradePack = Number(action.payload.value)
                }
                if (state.radioButtons.allItems) {
                    if (action.payload.key === "qty") state.renderedArray[action.payload.index].qty = Number(action.payload.value)
                    if (action.payload.key === "tradePack") state.renderedArray[action.payload.index].tradePack = Number(action.payload.value)
                }
            },
            setChangeLowStockArray: (state, action:PayloadAction<number>) => {
                state.lowStockArray.splice(action.payload, 1)
            },
            setCompletedOrders: (state, action:PayloadAction<{[key:string]:OpenOrdersObject[]}>) => {
                state.completedOrders = action.payload
            },
            setOrderContents: (state, action:PayloadAction<OpenOrdersObject | null>) => {
                state.orderContents = action.payload
            },
            setOrderInfoReset: (state) => {
                state.editOrder = null
                state.totalPrice = 0
                state.newOrderArray = []
            },
            setCompleteOrder: (state) => {
                state.loadedOrder!.complete = true
                const opts = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
                    },
                    body: JSON.stringify(current(state.loadedOrder))
                }
                fetch("/api/shop-orders/shop-stock-order", opts)
                    .then()
            },
            setSubmittedOrder: (state, action:PayloadAction<linn.ItemStock[]>) => {
                for (const item of action.payload) {
                    let posNew = state.loadedOrder!.arrived.map(order => order.SKU).indexOf(item.SKU)
                    if (Number(state.loadedOrder!.arrived[posNew].qty) <= Number(item["StockLevel"])) {
                        state.loadedOrder!.arrived[posNew].submitted = true
                    }
                }
                const opts = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
                    },
                    body: JSON.stringify(current(state.loadedOrder))
                }
                fetch('/api/shop-orders/shop-stock-order', opts)
                    .then()
            }
        },
    })
;

function totalPriceCalc(array:orderObject[]) {
    let totalPrice = 0
    for (let i = 0; i < array.length; i++) {
        let price = array[i].PURCHASEPRICE * (array[i].qty * array[i].tradePack)
        totalPrice += price
    }
    return parseFloat(totalPrice.toFixed(2))
}

export const {
    setDeadStock,
    setSideBarContent,
    setLoadedOrder,
    setOpenOrders,
    setEditOrder,
    setArrivedHandler,
    setBookedInState,
    setTotalPrice,
    setSupplierItems,
    setChangeOrderArray,
    setRadioButtons,
    setThreshold,
    setLowStockArray,
    setRenderedArray,
    setInputChange,
    setChangeOrderQty,
    setCompletedOrders,
    setOrderContents,
    setOrderInfoReset,
    setCompleteOrder,
    setRemoveFromBookedInState,
    setSubmittedOrder
} = shopOrdersSlice.actions


export const selectDeadStock = (state: ShopOrdersWrapper) => state.shopOrders.deadStock
export const selectSideBarContent = (state: ShopOrdersWrapper) => {
    return {content: state.shopOrders.sideBarContent, title: state.shopOrders.sideBarTitle}
}
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