import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

export interface itemDatabaseWrapper {
    itemDatabase: itemDatabaseState
}

export interface itemDatabaseState {
    item: sbt.Item
    suppliers: string[]
    brands: string[]
    currentSupplier: string
}

const initialState: itemDatabaseState = {
    item: null,
    suppliers: null,
    brands: [],
    currentSupplier: null
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
            },
            setSuppliers: (state, action) => {
                state.suppliers = action.payload
            },
            setBrands: (state, action) => {
                state.brands = action.payload
            },
            setCurrentSupplier: (state, action) => {
                console.log(action.payload)
                state.currentSupplier = action.payload
            }
        },
    })
;

export const {
    setItem,
    setSuppliers,
    setBrands,
    setCurrentSupplier
} = itemDatabaseSlice.actions

export const selectItem = (state: itemDatabaseWrapper) => state.itemDatabase.item
export const selectSuppliers = (state: itemDatabaseWrapper) => state.itemDatabase.suppliers
export const selectBrands = (state: itemDatabaseWrapper) => state.itemDatabase.brands
export const selectCurrentSupplier = (state: itemDatabaseWrapper) => state.itemDatabase.currentSupplier

export default itemDatabaseSlice.reducer;