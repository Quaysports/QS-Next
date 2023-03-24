import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {RootState} from "./store";
import {TransferObject} from "../server-modules/stock-transfer/stock-transfer";

export const hydrate = createAction<RootState>(HYDRATE);

export type LowStockItem = {
    SKU: string,
    title: string,
    linnId: string
    stock: {
        warehouse: number,
        minimum: number,
        default: number
    }
    transfer: number
    newStockLevels: {
        warehouse:number
        default:number
    }
}

export type CompletedTransferType = {
    items:LowStockItem[],
    completedDate:string,
    transferId:string,
    transferRef: string
}
export interface stockTransferWrapper {
    stockTransfer: stockTransferState
}

export interface stockTransferState {
    openTransfer: TransferObject
    completedTransfers: TransferObject[]
    warehouseList: LowStockItem[]
}

const initialState: stockTransferState = {
    openTransfer: {
        items: [],
        transferID: "",
        transferRef:"",
        complete:false,
        createdDate:"",
        completedDate:""
    },
    completedTransfers:[],
    warehouseList:[]
}

export const stockTransferStore = createSlice({
        name: "stockTransfer",
        initialState,
        extraReducers: (builder) => {
            builder
                .addCase(hydrate, (state, action) => {
                    return {
                        ...state,
                        ...action.payload.stockTransfer
                    };
                })
                .addDefaultCase(() => {
                })
        },
        reducers: {
            setOpenTransfer: (state, action:PayloadAction<TransferObject>) => {
                state.openTransfer = action.payload
            },
            newOpenTransfer: (state, action:PayloadAction<{items:LowStockItem[], date:string}>) => {
                const {items, date} = action.payload
                state.openTransfer.items = items
                state.openTransfer.createdDate = date
            },
            setTransfer: (state, action:PayloadAction<{index:number, amount:number}>) => {
                const {index, amount} = action.payload
                state.openTransfer.items[index].transfer = amount
            },
            saveTransfer:(state) => {
                databaseSave(JSON.stringify(state.openTransfer))
            },
            deleteTransfer: () => {
                fetch('/api/stock-transfer/delete-open-transfer').then(res => res.json().then(console.log))
            },
            removeSKU: (state, action:PayloadAction<number>) => {
                let tempObjects = [...state.openTransfer.items]
                tempObjects.splice(action.payload, 1)
                state.openTransfer.items = tempObjects
                databaseSave(JSON.stringify(state.openTransfer))
            },
            addNewItem: (state, action:PayloadAction<LowStockItem>) => {
                let tempItems = [...state.openTransfer.items]
                tempItems.push(action.payload)
                state.openTransfer.items = tempItems
                databaseSave(JSON.stringify(state.openTransfer))
            },
            completeTransfer: (state, action:PayloadAction<CompletedTransferType>) => {
                const {items, transferRef, transferId, completedDate} = action.payload
                state.openTransfer.transferID = transferId
                state.openTransfer.transferRef = transferRef
                state.openTransfer.completedDate = completedDate
                state.openTransfer.complete = true
                state.openTransfer.items = items
                saveCompleteTransfer(JSON.stringify(state.openTransfer))
                state.openTransfer = {
                    items: [],
                    transferID: "",
                    transferRef:"",
                    complete:false,
                    createdDate:"",
                    completedDate:""
                }
            },
            setCompletedTransfers:(state, action:PayloadAction<TransferObject[]>) => {
                state.completedTransfers = action.payload
            },
            setWarehouseList:(state, action:PayloadAction<LowStockItem[]>) => {
                state.warehouseList = action.payload
            },
            addItemFromWarehouseList: (state, action:PayloadAction<string>) => {
                const warehouseListCopy = [...state.warehouseList]
                const index = warehouseListCopy.findIndex(item => item.SKU === action.payload)
                state.openTransfer.items = [...state.openTransfer.items, warehouseListCopy[index]]
                warehouseListCopy.splice(index, 1)
                state.warehouseList = warehouseListCopy
                databaseSave(JSON.stringify(state.openTransfer))
            }
        },
    })
;

export const {
    setOpenTransfer,
    newOpenTransfer,
    setTransfer,
    saveTransfer,
    deleteTransfer,
    removeSKU,
    addNewItem,
    completeTransfer,
    setCompletedTransfers,
    setWarehouseList,
    addItemFromWarehouseList
} = stockTransferStore.actions

export const selectOpenTransfer = (state: stockTransferWrapper) => state.stockTransfer.openTransfer
export const selectTransfer = (index:number) => (state:stockTransferWrapper) => state.stockTransfer.completedTransfers[index]
export const selectAllCompletedTransfers = (state: stockTransferWrapper) => state.stockTransfer.completedTransfers
export const selectWarehouseItems = (state: stockTransferWrapper) => state.stockTransfer.warehouseList
export default stockTransferStore.reducer;

function databaseSave(state:string) {
    console.log(state)
    const opts = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: state
    }
    fetch('/api/stock-transfer/save-open-transfer', opts).then(res => {
        console.log(res)
    })
}

function saveCompleteTransfer(state:string) {
    const opts = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: state
    }
    fetch('/api/stock-transfer/save-complete-transfer', opts).then(res => {
        console.log(res)
    })
}