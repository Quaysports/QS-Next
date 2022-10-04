import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

/**
 * @property {itemDatabaseState} itemDatabase
 */
export interface itemDatabaseWrapper {
    itemDatabase: itemDatabaseState
}

/**
 * @property {sbt.Item | null} item
 * @property {string[]} suppliers
 * @property {Array string} brands
 * @property {string} [currentSupplier]
 */
export interface itemDatabaseState {
    item: sbt.Item | null
    suppliers: string[]
    brands: string[]
    currentSupplier?: string
}

const initialState: itemDatabaseState = {
    item: null,
    suppliers: [],
    brands: [],
    currentSupplier: ""
}

export const itemDatabaseSlice = createSlice({
        name: "itemDatabase",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.itemDatabase
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