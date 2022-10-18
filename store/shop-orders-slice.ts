import {createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {DeadStockReport} from "../server-modules/shop/shop";
import {orderObject, shopOrder} from "../server-modules/shop/shop-order-tool";

/**
 * @property {string} _id
 * @property {orderObject[]} arrived
 * @property {string} complete
 * @property {number} date
 * @property {string} id
 * @property {number} price
 * @property {orderObject[]} order
 * @property {string} supplier
 *
 */
export interface OpenOrdersObject {
    _id?: string | null
    arrived: orderObject[]
    complete: boolean
    date: number | null
    id: string | null
    price: number | null
    order: orderObject[]
    supplier: string | null
}

/**
 * Shop Orders State
 * @property {Object<string, DeadStockReport[]>} deadStock
 * @property {Object<string, string | number> } sideBarContent
 * @property {string} sideBarTitle
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
    deadStock: { [key: string]: DeadStockReport[] }[];
    sideBarContent: { [key: string]: string | number }[]
    sideBarTitle: string
    openOrders: shopOrder[] | null
    newOrderArray: OpenOrdersObject
    totalPrice: number
    supplierItems: orderObject[]
    radioButtons: radioButtonsObject
    renderedArray: orderObject[]
    threshold: number
    completedOrders: {[key: string]: OpenOrdersObject[]} [] | null
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
    deadStock: [],
    sideBarContent: [],
    sideBarTitle: "",
    openOrders: null,
    newOrderArray: {
        _id: null,
        arrived: [],
        complete: false,
        date: null,
        id: null,
        price: null,
        order: [],
        supplier: null
    },
    totalPrice: 0,
    supplierItems: [],
    radioButtons: {
        lowStock: true,
        allItems: false
    },
    renderedArray: [],
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
            setDeadStock: (state, action: PayloadAction<DeadStockReport[]>) => {
                function compare(a: DeadStockReport, b: DeadStockReport) {
                    if (a.SOLDFLAG < b.SOLDFLAG) {
                        return 1;
                    }
                    if (a.SOLDFLAG > b.SOLDFLAG) {
                        return -1;
                    }
                    return 0;
                }

                action.payload.sort(compare);
                let deadStockArray: { [key: string]: DeadStockReport[] }[] = []
                const tempMap: Map<string, DeadStockReport[]> = new Map()
                for (const item of action.payload) {
                    tempMap.has(item.SUPPLIER) ? tempMap.get(item.SUPPLIER)!.push(item): tempMap.set(item.SUPPLIER, [item])
                }
                let sideBarArray: {[key:string]:number}[] = []
                tempMap.forEach((item, key) => {
                    deadStockArray.push({[key]: item})
                    sideBarArray.push({[key] : item.length})
                })

                state.sideBarContent = sideBarArray
                state.sideBarTitle = "Suppliers"
                state.deadStock = deadStockArray
            },
            setSideBarContent: (state, action: PayloadAction<{ content: { [key: string]: string | number }[], title: string }>) => {
                state.sideBarContent = action.payload.content;
                state.sideBarTitle = action.payload.title
            },
            setOpenOrders: (state, action: PayloadAction<shopOrder[] | null>) => {
                state.openOrders = action.payload
            },
            setArrivedHandler: (state, action: PayloadAction<{order:string, index: number, value: number }>) => {
                state.openOrders![Number(action.payload.order)].order[action.payload.index].arrived = action.payload.value
            },
            setBookedInState: (state, action: PayloadAction<{ bookedIn: string, index: number, order: string}>) => {
                let openOrder = state.openOrders![Number(action.payload.order)]
                if (action.payload.bookedIn === "false") {
                    openOrder.order[action.payload.index].bookedIn = action.payload.bookedIn
                    openOrder.arrived.push(openOrder.order[action.payload.index])
                    openOrder.order.splice(action.payload.index, 1)
                }
                if (action.payload.bookedIn === "partial") {
                    openOrder.order[action.payload.index].qty = (openOrder.order[action.payload.index].qty - openOrder.order[action.payload.index].arrived!)
                    openOrder.arrived.push(openOrder.order[action.payload.index])
                    openOrder.arrived[(openOrder.arrived.length - 1)].qty = openOrder.order[action.payload.index].arrived!
                    openOrder.order[action.payload.index].arrived = 0
                }
            },
            setRemoveFromBookedInState: (state, action: PayloadAction<{ index: number, SKU: string, order: string}>) => {
                let openOrder =  state.openOrders![Number(action.payload.order)]
                const i = openOrder.order.map((item: orderObject) => item.SKU).indexOf(action.payload.SKU)
                if (i > -1) {
                    openOrder.order[i].qty = (openOrder.order[i].qty + openOrder.arrived[action.payload.index].arrived!)
                    openOrder.order[i].arrived = 0
                    openOrder.arrived.splice(action.payload.index, 1)
                } else {
                    openOrder.arrived[action.payload.index].arrived = 0
                    openOrder.order.push(openOrder.arrived[action.payload.index])
                    openOrder.arrived.splice(action.payload.index, 1)
                }
                const opts = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
                    },
                    body: JSON.stringify(openOrder)
                }
                fetch("/api/shop-orders/update-order", opts).then()
            },
            setTotalPrice: (state, action: PayloadAction<number>) => {
                state.totalPrice = action.payload
            },
            setSupplierItems: (state, action: PayloadAction<orderObject[]>) => {
                if(state.newOrderArray.order.length > 0){
                    for(const product of state.newOrderArray.order){
                        let index = action.payload.findIndex((item) => item.SKU === product.SKU)
                        action.payload.splice(index, 1)
                    }
                }
                state.supplierItems = action.payload
            },
            setChangeOrderQty: (state, action: PayloadAction<{ item: orderObject, type: string, index: number, value: string }>) => {
                if (action.payload.type === "qty") state.newOrderArray.order[action.payload.index].qty = parseFloat(action.payload.value)
                if (action.payload.type === "tradePack") state.newOrderArray.order[action.payload.index].tradePack = parseFloat(action.payload.value)
                state.totalPrice = totalPriceCalc(state.newOrderArray)
            },
            setChangeOrderArray: (state, action: PayloadAction<{ item?: orderObject, type: string, index?: number }>) => {
                if (action.payload.type === "remove") {
                    state.newOrderArray.order.splice(action.payload.index!, 1)
                    state.supplierItems.push(action.payload.item!)
                }
                if (action.payload.type === "add") {
                    let item = state.supplierItems.splice(action.payload.index!, 1)
                    item[0].qty = action.payload.item!.qty
                    item[0].tradePack = action.payload.item!.tradePack
                    state.newOrderArray.order.push(item[0])
                }
                if (action.payload.type === "new") {
                    state.newOrderArray.order.push(action.payload.item!)
                }
                state.totalPrice = totalPriceCalc(state.newOrderArray)
            },
            setRadioButtons: (state, action: PayloadAction<{ lowStock: boolean, allItems: boolean }>) => {
                state.radioButtons.lowStock = action.payload.lowStock
                state.radioButtons.allItems = action.payload.allItems
            },
            setThreshold: (state, action: PayloadAction<number>) => {
                state.threshold = action.payload
            },
            setRenderedArray: (state, action: PayloadAction<orderObject[]>) => {
                state.renderedArray = action.payload
            },
            setInputChange: (state, action: PayloadAction<{ key: string, index: number, value: string }>) => {
                    if (action.payload.key === "qty") state.renderedArray[action.payload.index].qty = Number(action.payload.value)
                    if (action.payload.key === "tradePack") state.renderedArray[action.payload.index].tradePack = Number(action.payload.value)
            },
            setCompletedOrders: (state, action: PayloadAction<{[key: string]: shopOrder[]}[]>) => {
                state.completedOrders = action.payload
            },
            setOrderContents: (state, action: PayloadAction<{index: string, id:string}>) => {
                Object.values(state.completedOrders![Number(action.payload.index)]).forEach((value) => {
                    for (let i = 0; i < value.length; i++) {
                        if(value[i].id === action.payload.id) state.orderContents = value[i]
                    }
                })
            },
            setOrderInfoReset: (state) => {
                state.totalPrice = 0
                state.newOrderArray = {
                    _id: null,
                    arrived: [],
                    complete: false,
                    date: null,
                    id: null,
                    price: null,
                    order: [],
                    supplier: null
                }
            },
            setCompleteOrder: (state, action:PayloadAction<string>) => {
                const openOrder = state.openOrders![Number(action.payload)]
                openOrder.complete = true
                const opts = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
                    },
                    body: JSON.stringify(current(openOrder))
                }
                fetch("/api/shop-orders/shop-stock-order", opts)
                    .then()
            },
            setSubmittedOrder: (state, action: PayloadAction<{res:linn.ItemStock[], order: string}>) => {
                const openOrder = state.openOrders![Number(action.payload.order)]
                for (const item of action.payload.res) {
                    let posNew = openOrder.arrived.map(order => order.SKU).indexOf(item.SKU)
                    if (Number(openOrder.arrived[posNew].qty) <= Number(item["StockLevel"])) {
                        openOrder.arrived[posNew].submitted = true
                    }
                }
                const opts = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
                    },
                    body: JSON.stringify(current(openOrder))
                }
                fetch('/api/shop-orders/shop-stock-order', opts)
                    .then()
            },
            setNewOrderArray: (state, action: PayloadAction<shopOrder>) => {
                state.newOrderArray = action.payload
                const tempArray = [...state.newOrderArray.order, ...state.newOrderArray.arrived]
                for (let i = 0; i < tempArray.length; i++) {
                    state.totalPrice += (tempArray[i].PURCHASEPRICE * tempArray[i].tradePack * tempArray[i].qty)
                    let index = state.supplierItems.findIndex(item => item.SKU === tempArray[i].SKU)
                    state.supplierItems.splice(index, 1)
                }
            }
        },
    })
;

function totalPriceCalc(order: OpenOrdersObject) {
    let totalPrice = 0
    if(order.arrived){
        for (let i = 0; i < order.arrived.length; i++) {
            let price = order.arrived[i].PURCHASEPRICE * (order.arrived[i].qty * order.arrived[i].tradePack)
            totalPrice += price
        }
    }
    for (let i = 0; i < order.order.length; i++) {
        let price = order.order[i].PURCHASEPRICE * (order.order[i].qty * order.order[i].tradePack)
        totalPrice += price
    }
    return parseFloat(totalPrice.toFixed(2))
}

export const {
    setDeadStock,
    setSideBarContent,
    setOpenOrders,
    setArrivedHandler,
    setBookedInState,
    setTotalPrice,
    setSupplierItems,
    setChangeOrderArray,
    setRadioButtons,
    setThreshold,
    setRenderedArray,
    setInputChange,
    setChangeOrderQty,
    setCompletedOrders,
    setOrderContents,
    setOrderInfoReset,
    setCompleteOrder,
    setRemoveFromBookedInState,
    setSubmittedOrder,
    setNewOrderArray
} = shopOrdersSlice.actions


export const selectDeadStock = (state: ShopOrdersWrapper) => state.shopOrders.deadStock
export const selectSideBarContent = (state: ShopOrdersWrapper) => {
    return {content: state.shopOrders.sideBarContent, title: state.shopOrders.sideBarTitle}
}
export const selectOpenOrders = (state: ShopOrdersWrapper) => state.shopOrders.openOrders
export const selectNewOrderArray = (state: ShopOrdersWrapper) => state.shopOrders.newOrderArray
export const selectTotalPrice = (state: ShopOrdersWrapper) => state.shopOrders.totalPrice
export const selectSupplierItems = (state: ShopOrdersWrapper) => state.shopOrders.supplierItems
export const selectRadioButtons = (state: ShopOrdersWrapper) => state.shopOrders.radioButtons
export const selectThreshold = (state: ShopOrdersWrapper) => state.shopOrders.threshold
export const selectRenderedArray = (state: ShopOrdersWrapper) => state.shopOrders.renderedArray
export const selectCompletedOrders = (state: ShopOrdersWrapper) => state.shopOrders.completedOrders
export const selectOrderContents = (state: ShopOrdersWrapper) => state.shopOrders.orderContents


export default shopOrdersSlice.reducer;