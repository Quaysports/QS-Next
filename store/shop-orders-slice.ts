import {createAction, createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {DeadStockReport} from "../server-modules/shop/shop";
import {orderObject, shopOrder} from "../server-modules/shop/shop-order-tool";
import {binarySearch} from "../server-modules/core/core";
import {linn, schema} from "../types";
import {RootState} from "./store";

export const hydrate = createAction<RootState>(HYDRATE);

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
    completedBy: string | null
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
    completedOrders: { [key: string]: OpenOrdersObject[] } [] | null
    orderContents: OpenOrdersObject | null
    orderSKUs: { [kay: string]: string[] }
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
        supplier: null,
        completedBy: null
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
    orderContents: null,
    orderSKUs: {}
};

export const shopOrdersSlice = createSlice({
        name: "shopOrders",
        initialState,
        extraReducers: (builder) => {
            builder
                .addCase(hydrate, (state, action) => {
                    return {
                        ...state,
                        ...action.payload.shopOrders
                    };
                })
                .addDefaultCase(() => {
                })
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
                    tempMap.has(item.SUPPLIER) ? tempMap.get(item.SUPPLIER)!.push(item) : tempMap.set(item.SUPPLIER, [item])
                }
                let sideBarArray: { [key: string]: number }[] = []
                tempMap.forEach((item, key) => {
                    deadStockArray.push({[key]: item})
                    sideBarArray.push({[key]: item.length})
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
            setArrivedHandler: (state, action: PayloadAction<{ order: string, index: number, value: number }>) => {
                state.openOrders![Number(action.payload.order)].order[action.payload.index].arrived = action.payload.value
            },
            setBookedInState: (state, action: PayloadAction<{ bookedIn: string, index: number, orderId: number }>) => {
                let {bookedIn, index, orderId} = action.payload
                let {order, arrived} = structuredClone(current(state.openOrders![action.payload.orderId]))
                if (bookedIn === "false") {
                    order[index].bookedIn = bookedIn
                    arrived.push(order[index])
                    order.splice(index, 1)
                }
                if (action.payload.bookedIn === "partial") {
                    let amount = state.openOrders![orderId].order[index].arrived!
                    let item = structuredClone(order[index])
                    order[index].quantity = (order[index].quantity - amount)
                    arrived.push(item)
                    arrived[(arrived.length - 1)] = {...arrived[(arrived.length - 1)], quantity: amount, arrived: amount}
                    order[index].arrived = 0
                }
                state.openOrders![orderId] = {...state.openOrders![orderId], order: order, arrived: arrived}
            },
            setRemoveFromBookedInState: (state, action: PayloadAction<{ index: number, SKU: string, order: string }>) => {
                let openOrder = state.openOrders![Number(action.payload.order)]
                const i = openOrder.order.map((item: orderObject) => item.SKU).indexOf(action.payload.SKU)
                if (i > -1) {
                    openOrder.order[i].quantity = (openOrder.order[i].quantity + openOrder.arrived[action.payload.index].arrived!)
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
                if (state.newOrderArray.order.length > 0) {
                    for (const product of state.newOrderArray.order) {
                        let index = action.payload.findIndex((item) => item.SKU === product.SKU)
                        action.payload.splice(index, 1)
                    }
                }
                if (state.orderSKUs[action.payload[0].supplier]) {
                    for (const item of state.orderSKUs[action.payload[0].supplier]) {
                        let obj = binarySearch<orderObject>(action.payload, "SKU", item)
                        obj ? obj.onOrder = true : null
                    }
                }
                state.supplierItems = action.payload
            },
            setChangeOrderQty: (state, action: PayloadAction<{ item: orderObject, index: number, value: string }>) => {
                state.newOrderArray.order[action.payload.index].quantity = parseFloat(action.payload.value)
                state.totalPrice = totalPriceCalc(state.newOrderArray)
                let date = new Date()
                state.newOrderArray.date ??= date.getTime()
                saveNewOrder(state.newOrderArray, state.totalPrice)
            },
            setChangeOrderArray: (state, action: PayloadAction<{ renderedIndex: number, type: string, fullStockIndex: number }>) => {
                const {renderedIndex, type, fullStockIndex} = action.payload
                const item = state.renderedArray[renderedIndex]
                if (type === "remove") {
                    let splicedItem = state.newOrderArray.order.splice(fullStockIndex, 1)
                    state.supplierItems.push(splicedItem[0])
                }
                if (type === "add") {
                    let newOrderItem = state.supplierItems.splice(fullStockIndex, 1)
                    newOrderItem[0].quantity = item.quantity
                    newOrderItem[0].stock.tradePack = item.stock.tradePack!
                    state.newOrderArray.supplier = newOrderItem[0].supplier
                    state.newOrderArray.order.push(newOrderItem[0])
                }
                state.totalPrice = totalPriceCalc(state.newOrderArray)
                let date = new Date()
                state.newOrderArray.date ??= date.getTime()
                saveNewOrder(state.newOrderArray, state.totalPrice)
            },
            setNewItem: (state, action: PayloadAction<orderObject>) => {
                state.newOrderArray.order.push(action.payload)
                let date = new Date()
                state.newOrderArray.date ??= date.getTime()
                saveNewOrder(state.newOrderArray, state.totalPrice)
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
            setQuantity: (state, action: PayloadAction<{ index: number, value: string }>) => {
                state.renderedArray[action.payload.index].quantity = Number(action.payload.value)
            },
            setTradePack: (state, action: PayloadAction<{ index: number, value: number }>) => {
                const {index, value} = action.payload
                let supplierItemIndex = state.supplierItems.findIndex(product => product.SKU === state.renderedArray[index].SKU)
                state.supplierItems[supplierItemIndex].stock.tradePack = value
                state.renderedArray[index].stock.tradePack = value
                databaseSave({SKU: state.renderedArray[index].SKU, stock: state.renderedArray[index].stock})
            },
            setCompletedOrders: (state, action: PayloadAction<{ [key: string]: shopOrder[] }[]>) => {
                state.completedOrders = action.payload
            },
            setOrderContents: (state, action: PayloadAction<{ index: string, id: string }>) => {
                Object.values(state.completedOrders![Number(action.payload.index)]).forEach((value) => {
                    for (let i = 0; i < value.length; i++) {
                        // added index - without index any duplicate dates would only show last element matching the id
                        if (`${i + 1} ${value[i].id}` === action.payload.id) state.orderContents = value[i]
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
                    supplier: null,
                    completedBy: null
                }
            },
            setCompleteOrder: (state, action: PayloadAction<{ index: string, user: string }>) => {
                const {index, user} = action.payload
                const openOrder = state.openOrders![Number(index)]
                openOrder.complete = true
                openOrder.completedBy = user
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
            setSubmittedOrder: (state, action: PayloadAction<{ res: linn.ItemStock[], order: string }>) => {
                const openOrder = state.openOrders![Number(action.payload.order)]
                for (const item of openOrder.arrived) {
                    if (item.newProduct) item.submitted = true
                }
                for (const item of action.payload.res) {
                    const indexes = openOrder.arrived.map((order, index) => {
                        if (order.SKU === item.SKU && order.submitted === false) {
                            return index
                        }
                        return -1
                    }).filter(index => index > -1)
                    indexes.forEach(index => {
                        if (Number(openOrder.arrived[index].quantity) <= Number(item["StockLevel"])) {
                            openOrder.arrived[index].submitted = true
                        }
                    })
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
                    state.totalPrice += (tempArray[i].prices.purchase * tempArray[i].tradePack * tempArray[i].quantity)
                    let index = state.supplierItems.findIndex(item => item.SKU === tempArray[i].SKU)
                    state.supplierItems.splice(index, 1)
                }
            },
            setOnOrderSKUs: (state, action: PayloadAction<shopOrder[]>) => {
                let ordersSKUs: { [key: string]: string[] } = {}
                for (const order of action.payload) {
                    for (const item of order.order) {
                        ordersSKUs[order.supplier] ??= []
                        ordersSKUs[order.supplier].push(item.SKU)
                    }
                }
                state.orderSKUs = ordersSKUs
            },
            setOpenOrderTradePack: (state, action:PayloadAction<{orderIndex:number, itemIndex:number, value:number}>) => {
                const {orderIndex, itemIndex, value} = action.payload
                console.log('orderIndex', orderIndex)
                console.log('itemIndex', itemIndex)
                console.log('value', value)
                state.openOrders![orderIndex].order[itemIndex].stock.tradePack = value
                const opts = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
                    },
                    body: JSON.stringify(state.openOrders![orderIndex])
                }
                fetch("/api/shop-orders/update-order", opts).then()
            }
        },
    })
;

function totalPriceCalc(order: OpenOrdersObject) {
    let totalPrice = 0
    if (order.arrived) {
        for (let i = 0; i < order.arrived.length; i++) {
            let price = order.arrived[i].prices.purchase * (order.arrived[i].quantity * order.arrived[i].stock.tradePack!)
            totalPrice += price
        }
    }
    for (let i = 0; i < order.order.length; i++) {
        let price = order.order[i].prices.purchase * (order.order[i].quantity * order.order[i].stock.tradePack!)
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
    setSupplierItems,
    setChangeOrderArray,
    setRadioButtons,
    setThreshold,
    setRenderedArray,
    setQuantity,
    setChangeOrderQty,
    setCompletedOrders,
    setOrderContents,
    setOrderInfoReset,
    setCompleteOrder,
    setRemoveFromBookedInState,
    setSubmittedOrder,
    setNewOrderArray,
    setOnOrderSKUs,
    setTradePack,
    setNewItem,
    setOpenOrderTradePack
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

function databaseSave(item: Partial<schema.Item> & Pick<schema.Item, "SKU">) {

    const opts = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item)
    }
    fetch('/api/items/update-item', opts).then(res => {
        console.log(res)
    })
}

function saveNewOrder(newOrderArray: OpenOrdersObject, totalPrice: number) {
    const date = new Date();

    let newOrder = {
        id: newOrderArray.id ? newOrderArray.id : `${date.getDate().toString()}-${(date.getMonth() + 1).toString()}-${date.getFullYear().toString()}`,
        supplier: newOrderArray.order[0].supplier ?? newOrderArray.supplier,
        date: newOrderArray.date ? newOrderArray.date : date.getTime(),
        complete: false,
        arrived: newOrderArray.arrived,
        price: totalPrice,
        order: newOrderArray.order,
    }

    const opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
        },
        body: JSON.stringify(newOrder)
    }
    fetch("/api/shop-orders/update-order", opts).then()
}