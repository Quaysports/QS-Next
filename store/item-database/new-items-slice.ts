import {createAction, createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {RootState} from "../store";
import {schema} from "../../types";
import itemTemplate from "../../components/utils/item-template";

export const hydrate = createAction<RootState>(HYDRATE);

export interface NewItemsWrapper {
    newItems: newItemsState
}

export interface newItemsState {
    suppliers: string[]
    brands: string[]
    items: schema.Item[]
    allTags: string[]
}

const initialState = ():newItemsState =>  {
    return {
        suppliers: [],
        brands: [],
        items: [],
        allTags: []
    }
}

export const newItemsSlice = createSlice({
    name: "newItems",
    initialState: initialState(),
    extraReducers: (builder) => {
        builder
            .addCase(hydrate, (state, action) => {
                return {
                    ...state,
                    ...action.payload.newItems
                };
            })
            .addDefaultCase(() => {
            })
    },
    reducers: {
        addNewItem: (state, action:PayloadAction<string>) => {
            state.items.push(itemTemplate())
            state.items[state.items.length - 1].supplier = action.payload
        },
        setNewItemSuppliers: (state, action: PayloadAction<string[]>) => {
            state.suppliers = action.payload
        },
        setNewItemsBrands: (state, action: PayloadAction<string[]>) => {
            state.brands = action.payload
        },
        setNewItemBarcode: (state, action: PayloadAction<{ index: number, barcode: string }>) => {
            const {index, barcode} = action.payload
            state.items[index].EAN = barcode
        },
        setNewItemPurchasePrice: (state, action: PayloadAction<{ index: number, purchasePrice: number }>) => {
            const {index, purchasePrice} = action.payload
            state.items[index].prices.purchase = purchasePrice
        },
        setNewItemQuantity: (state, action: PayloadAction<{ index: number, quantity: number }>) => {
            const {index, quantity} = action.payload
            state.items[index].stock.total = quantity
        },
        setNewItemRetailPrice: (state, action: PayloadAction<{ index: number, retailPrice: number }>) => {
            const {index, retailPrice} = action.payload
            state.items[index].prices.retail = retailPrice
        },
        setNewItemShippingFormat: (state, action: PayloadAction<{ index: number, shippingFormat: string }>) => {
            const {index, shippingFormat} = action.payload
            state.items[index].mappedExtendedProperties.shippingFormat = shippingFormat
        },
        setNewItemSKU: (state, action: PayloadAction<{ index: number, SKU: string }>) => {
            const {index, SKU} = action.payload
            state.items[index].SKU = SKU
        },
        setNewItemTitle: (state, action: PayloadAction<{ index: number, title: string }>) => {
            const {index, title} = action.payload
            state.items[index].title = title
        },
        setNewItemAllTags: (state, action: PayloadAction<string[]>) => {
            state.allTags = action.payload
        },
        setNewItemTags: (state, action: PayloadAction<{ index: number, tags:string[] }>) => {
            const {index, tags} = action.payload
            state.items[index].tags = tags
        },
        setNewItemBrand: (state, action:PayloadAction<{index:number, brand:string}>) => {
            const {index, brand} = action.payload
            state.items[index].brand = brand
        },
        addNewBrandToList: (state,action:PayloadAction<string>) => {
            const brandsCopy = [...state.brands]
            brandsCopy.push(action.payload)
            state.brands = brandsCopy.sort()
        },
        addNewSupplierToList:(state, action:PayloadAction<string>) => {
            const supplierCopy = [...state.suppliers]
            supplierCopy.push(action.payload)
            console.log(supplierCopy)
            state.suppliers = supplierCopy.sort()
        },
        deleteNewItem: (state, action:PayloadAction<number>) => {
            state.items.splice(action.payload, 1)
        },
        copyItem: (state, action:PayloadAction<schema.Item>) => {
            state.items.push(action.payload)
        },
        resetSlice: (state) => {
            state.items = []
        }
    },
});

export const {
    setNewItemSuppliers,
    setNewItemsBrands,
    setNewItemBarcode,
    setNewItemPurchasePrice,
    addNewItem,
    setNewItemQuantity,
    setNewItemRetailPrice,
    setNewItemShippingFormat,
    setNewItemSKU,
    setNewItemTitle,
    setNewItemAllTags,
    setNewItemTags,
    setNewItemBrand,
    deleteNewItem,
    copyItem,
    resetSlice,
    addNewBrandToList,
    addNewSupplierToList
} = newItemsSlice.actions

export const selectSuppliers = (state: NewItemsWrapper) => state.newItems.suppliers
export const selectBrands = (state: NewItemsWrapper) => state.newItems.brands
export const selectItem = (index: number) => (state: NewItemsWrapper) => state.newItems.items[index]
export const getNewItemAllTags = (state: NewItemsWrapper) => state.newItems.allTags
export const getNewItems = (state:NewItemsWrapper) => state.newItems.items

export default newItemsSlice.reducer;

