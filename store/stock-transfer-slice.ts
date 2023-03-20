import {createAction, createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {RootState} from "./store";
import {forecastState} from "./stock-forecast-slice";
import {TransferObject} from "../server-modules/stock-transfer/stock-transfer";
import {schema} from "../types";

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
    stockIn: number
}

export type TransferData = {
    PkTransferId:string
    ReferenceNumber: string
    OrderDate : string
}

export interface stockTransferWrapper {
    stockTransfer: stockTransferState
}

export interface stockTransferState {
    openTransfer: TransferObject
}

const initialState: stockTransferState = {
    openTransfer: {
        items: [],
        transferID: "",
        transferRef:"",
        complete:false,
        date:""
    }
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
            newOpenTransfer: (state, action:PayloadAction<LowStockItem[]>) => {
                state.openTransfer.items = action.payload
            },
            setStockIn: (state, action:PayloadAction<{index:number, amount:number}>) => {
                const {index, amount} = action.payload
                state.openTransfer.items[index].stockIn = amount
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
            completeTransfer: (state, action:PayloadAction<TransferData>) => {
                const {PkTransferId, OrderDate, ReferenceNumber} = action.payload
                state.openTransfer.transferID = PkTransferId
                state.openTransfer.transferRef = ReferenceNumber
                state.openTransfer.date = OrderDate
                state.openTransfer.complete = true
                databaseSave(JSON.stringify(state.openTransfer))
                state.openTransfer = {
                    items: [],
                    transferID: "",
                    transferRef:"",
                    complete:false,
                    date:""
                }
            }
        },
    })
;

export const {
    setOpenTransfer,
    newOpenTransfer,
    setStockIn,
    saveTransfer,
    deleteTransfer,
    removeSKU,
    addNewItem,
    completeTransfer
} = stockTransferStore.actions

export const selectOpenTransfer = (state: stockTransferWrapper) => state.stockTransfer.openTransfer
export default stockTransferStore.reducer;

function databaseSave(state:string) {
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