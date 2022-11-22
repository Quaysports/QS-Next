import {createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {rodLocationObject} from "../../pages/item-database";
import {WritableDraft} from "immer/dist/types/types-external";

/**
 * @property {itemDatabaseState} itemDatabase
 */
export interface itemDatabaseWrapper {
    itemDatabase: itemDatabaseState
}

/**
 * @property {string} brand
 * @property {string} sku
 * @property {string} supplier
 * @property {string} barcode
 * @property {string} filter
 * @property {string} title
 * @property {string} weight
 * @property {string} retailPrice
 * @property {string} costPrice
 * @property {string} shipping
 * @property {string} minimum
 * @property {string} quantity
 */
export interface newItem {
    brand: string;
    sku: string;
    supplier: string;
    barcode: string;
    filter: string;
    title: string;
    weight: string;
    retailPrice: string;
    costPrice: string;
    shipping: string;
    minimum: string;
    quantity: string;
    tags: string[];
}


/**
 * @property {sbt.Item | null} item
 * @property {string[]} suppliers
 * @property {Array string} brands
 * @property {string} [currentSupplier]
 * @property {newItem[]} newItems
 */
export interface itemDatabaseState {
    item: sbt.Item | null;
    suppliers: string[];
    brands: string[];
    currentSupplier?: string;
    newItems: { [key: number]: newItem };
    rodLocations: rodLocationObject[];
    tags: string[];
}

const initialState: itemDatabaseState = {
    item: null,
    suppliers: [],
    brands: [],
    currentSupplier: "",
    newItems: {},
    rodLocations: [],
    tags: []
}

const newItem: newItem = {
    brand: "",
    sku: "",
    supplier: "",
    barcode: "",
    filter: "domestic",
    title: "",
    weight: "",
    retailPrice: "0",
    costPrice: "0",
    shipping: "",
    minimum: "2",
    quantity: "0",
    tags: []
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
            setItemBrand: (state, action: PayloadAction<string>) => {
                state.item!.IDBEP ? state.item!.IDBEP.BRAND = action.payload : state.item!.IDBEP = {BRAND: action.payload}
            },
            setItemSupplier: (state, action: PayloadAction<string>) => {
                state.item!.SUPPLIER = action.payload
            },
            setItemLocation: (state, action: PayloadAction<{ value: string, key: keyof sbt.shelfLocation }>) => {
                if (!state.item!.SHELFLOCATION) state.item!.SHELFLOCATION = {PREFIX: "", LETTER: "", NUMBER: ""}
                state.item!.SHELFLOCATION[action.payload.key] = action.payload.value
            },
            setItemTitle: (state, action: PayloadAction<string>) => {
                state.item!.TITLE = action.payload
            },
            setItemWebsiteTitle: (state, action: PayloadAction<string>) => {
                state.item!.TITLEWEBSITE = action.payload
            },
            setItemStatusBoxes: (state, action: PayloadAction<{ checked: boolean, title: keyof sbt.statusChecks["DONE"] }>) => {
                if (!state.item?.CHECK) state.item!.CHECK = statusCheckboxes()
                state.item!.CHECK.DONE[action.payload.title] = action.payload.checked
            },
            setItemChannelStatus: (state, action:PayloadAction<{channel:string, status:string}>) => {
                switch(action.payload.status){
                    case "DONE":
                        state.item!.CHECK!.DONE[action.payload.channel as keyof sbt.statusChecks["DONE"]] = true;
                        state.item!.CHECK!.NA[action.payload.channel as keyof sbt.statusChecks["NA"]] = false;
                        state.item!.CHECK!.READY[action.payload.channel as keyof sbt.statusChecks["READY"]] = false;
                        break;
                    case "READY":
                        state.item!.CHECK!.DONE[action.payload.channel as keyof sbt.statusChecks["DONE"]] = false;
                        state.item!.CHECK!.NA[action.payload.channel as keyof sbt.statusChecks["NA"]] = false;
                        state.item!.CHECK!.READY[action.payload.channel as keyof sbt.statusChecks["READY"]] = true;
                        break;
                    case "NA":
                        state.item!.CHECK!.DONE[action.payload.channel as keyof sbt.statusChecks["DONE"]] = false;
                        state.item!.CHECK!.NA[action.payload.channel as keyof sbt.statusChecks["NA"]] = true;
                        state.item!.CHECK!.READY[action.payload.channel as keyof sbt.statusChecks["READY"]] = false;
                        break;
                }
            },
            setItemAmazonBulletPoints: (state, action:PayloadAction<{value:string, index:number}>) => {
                state.item!.IDBEP ??= {BULLETPOINT1:"",BULLETPOINT2:"",BULLETPOINT3:"",BULLETPOINT4:"",BULLETPOINT5:""}
                switch(action.payload.index){
                    case 1: state.item!.IDBEP.BULLETPOINT1 = action.payload.value
                        break;
                    case 2: state.item!.IDBEP.BULLETPOINT2 = action.payload.value
                        break;
                    case 3: state.item!.IDBEP.BULLETPOINT3 = action.payload.value
                        break;
                    case 4: state.item!.IDBEP.BULLETPOINT4 = action.payload.value
                        break;
                    case 5: state.item!.IDBEP.BULLETPOINT5 = action.payload.value
                        break;
                }
            },
            setItemAmazonCategories: (state, action:PayloadAction<{categoryID:string, id: number}>) => {
                state.item!.IDBEP  ??= {CATEGORIE1:"", CATEGORIE2:""}
                if(action.payload.id === 1) {
                    state.item!.IDBEP.CATEGORIE1 = action.payload.categoryID
                }
                if(action.payload.id === 2) {
                    state.item!.IDBEP.CATEGORIE1 = action.payload.categoryID
                }
            },
            setSuppliers: (state, action) => {
                state.suppliers = action.payload
            },
            setCurrentSupplier: (state, action) => {
                state.currentSupplier = action.payload
            },
            setNewItemValues: (state, action: PayloadAction<{ key: number, nestedKey: keyof newItem, value: string }>) => {
                const key = action.payload.key;
                const nestedKey = action.payload.nestedKey;
                const value = action.payload.value;
                state.newItems[key] ?
                    nestedKey === "tags" ? state.newItems[key][nestedKey] = tagsArray(state.newItems[key][nestedKey], value) : state.newItems[key][nestedKey] = value
                    : state.newItems[key] = newProducts(nestedKey, value);
            },
            setRodLocations: (state, action) => {
                state.rodLocations = action.payload;
            },
        },
    })
;

export const {
    setItem,
    setSuppliers,
    setCurrentSupplier,
    setNewItemValues,
    setItemBrand,
    setRodLocations,
    setItemSupplier,
    setItemLocation,
    setItemWebsiteTitle,
    setItemTitle,
    setItemStatusBoxes,
    setItemChannelStatus,
    setItemAmazonCategories,
    setItemAmazonBulletPoints
} = itemDatabaseSlice.actions

export const selectItem = (state: itemDatabaseWrapper) => state.itemDatabase.item;
export const selectSuppliers = (state: itemDatabaseWrapper) => state.itemDatabase.suppliers;
export const selectCurrentSupplier = (state: itemDatabaseWrapper) => state.itemDatabase.currentSupplier;
export const selectRodLocations = (state: itemDatabaseWrapper) => state.itemDatabase.rodLocations;
export const selectNewItems = (state: itemDatabaseWrapper) => state.itemDatabase.newItems;

export default itemDatabaseSlice.reducer;

function tagsArray(tags: string[], value: string) {
    let newTags = [...tags]
    let index = newTags.findIndex(tag => tag === value)
    index === -1 ? newTags.push(value) : newTags.splice(index, 1)
    return newTags
}

function newProducts(key: keyof newItem, value: string) {
    let newProduct: newItem = {
        brand: "",
        sku: "",
        supplier: "",
        barcode: "",
        filter: "",
        title: "",
        weight: "",
        retailPrice: "",
        costPrice: "",
        shipping: "",
        minimum: "",
        quantity: "",
        tags: []
    }
    key === "tags" ? newProduct[key].push(value) : newProduct[key] = value
    return newProduct
}

function statusCheckboxes() {
    return (
        {
            DONE: {
                ADDINV: false,
                AMAZON: false,
                AMAZONSTORE: false,
                EAN: false,
                EBAY: false,
                EBAYDRAFT: false,
                FBA: false,
                GOODRCVD: false,
                INVLINK: false,
                JARILO: false,
                MARGIN: false,
                PHOTO: false,
                PHOTOS: false,
                QS: false,
                ZEN: false
            },
            NA: {
                AMAZON: true,
                AMAZONSTORE: true,
                EBAY: true,
                FBA: true,
                QS: true,
                ZEN: true
            },
            READY: {
                AMAZON: false,
                AMAZONSTORE: false,
                EBAY: false,
                FBA: false,
                QS: false,
                ZEN: false
            },
            SF: {
                HIDE: false,
                LIST: false
            }
        }
    )
}