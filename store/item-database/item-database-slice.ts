import {createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {rodLocationObject} from "../../pages/item-database";
import {dispatchNotification} from "../../components/notification/dispatch-notification";

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
    item: sbt.Item;
    suppliers: string[];
    brands: string[];
    currentSupplier?: string;
    newItems: { [key: number]: newItem };
    rodLocations: rodLocationObject[];
    tags: string[];
}

const initialState: itemDatabaseState = {
    item: itemTemplate(),
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
                state.item = {...itemTemplate(), ...action.payload}
            },
            setItemBrand: (state, action: PayloadAction<string>) => {
                state.item!.IDBEP.BRAND = action.payload
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
            setItemChannelStatus: (state, action: PayloadAction<{ channel: string, status: string }>) => {
                switch (action.payload.status) {
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
            setItemAmazonBulletPoints: (state, action: PayloadAction<{ value: string, index: number }>) => {
                switch (action.payload.index) {
                    case 1:
                        state.item!.IDBEP.BULLETPOINT1 = action.payload.value
                        break;
                    case 2:
                        state.item!.IDBEP.BULLETPOINT2 = action.payload.value
                        break;
                    case 3:
                        state.item!.IDBEP.BULLETPOINT3 = action.payload.value
                        break;
                    case 4:
                        state.item!.IDBEP.BULLETPOINT4 = action.payload.value
                        break;
                    case 5:
                        state.item!.IDBEP.BULLETPOINT5 = action.payload.value
                        break;
                }
            },
            setItemAmazonCategories: (state, action: PayloadAction<{ categoryID: string, id: number }>) => {
                if (action.payload.id === 1) {
                    state.item!.IDBEP.CATEGORIE1 = action.payload.categoryID
                }
                if (action.payload.id === 2) {
                    state.item!.IDBEP.CATEGORIE2 = action.payload.categoryID
                }
                console.log(current(state.item!.IDBEP))
                console.log(current(state.item!.IDBEP))
            },
            setItemShortDescription: (state, action: PayloadAction<string>) => {
                state.item!.SHORTDESC = action.payload
            },
            setItemLongDescription: (state, action: PayloadAction<string>) => {
                state.item!.DESCRIPTION = action.payload
            },
            setItemSearchTerms: (state, action: PayloadAction<{ value: string, index: number }>) => {
                switch (action.payload.index) {
                    case 1:
                        state.item!.IDBEP.SEARCHTERM1 = action.payload.value
                        break;
                    case 2:
                        state.item!.IDBEP.SEARCHTERM2 = action.payload.value
                        break;
                    case 3:
                        state.item!.IDBEP.SEARCHTERM3 = action.payload.value
                        break;
                    case 4:
                        state.item!.IDBEP.SEARCHTERM4 = action.payload.value
                        break;
                    case 5:
                        state.item!.IDBEP.SEARCHTERM5 = action.payload.value
                        break;
                }
            },
            setItemImages: (state, action: PayloadAction<{ image: string, index: string, extension: string }>) => {
                let {image, index, extension} = action.payload
                state.item!.IMAGES ??= {}
                state.item!.IMAGES[index] = {
                    filename: `${index === "main" ? "0" : index}.${extension}`
                }
                let body = {
                    _id: state.item!._id,
                    SKU: state.item!.SKU,
                    id: index === "main" ? "main" : "image" + index,
                    filename: `${index}.${extension}`,
                    image: image
                }
                const opts = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: 'POST',
                    body: JSON.stringify(body)
                }
                fetch("api/item-database/upload-image", opts).then(res => {
                    console.log(res)
                    if (res.ok) {
                        console.log("Uploaded image")
                    } else {
                        throw new Error(`Status: ${res.status}, ${res.statusText}`)
                    }
                })
                    .catch((error) => {
                        dispatchNotification({type: "alert", content: error.message, title: "Upload Failed"})
                        console.log(error.message)
                    })
            },
            setItemBrandLabel: (state, action:PayloadAction<{value:string, key: keyof sbt.brandLabel}>) => {
                let {value, key} = action.payload
                state.item!.BRANDLABEL[key] = value
            },
            setSuppliers: (state, action) => {
                state.suppliers = action.payload
            },
            setCurrentSupplier: (state, action) => {
                state.currentSupplier = action.payload
            },
            setNewItemValues: (state, action: PayloadAction<{ key: number, nestedKey: keyof newItem, value: string }>) => {
                const {key, nestedKey, value} = action.payload;
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
    setItemAmazonBulletPoints,
    setItemShortDescription,
    setItemLongDescription,
    setItemSearchTerms,
    setItemImages,
    setItemBrandLabel
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

function itemTemplate():sbt.Item {
    return {
            _id: "",
            AMZPRICEINCVAT: "",
            AMZPRIME: false,
            BRAND: "",
            BRANDLABEL: {brand: "", image: "", loc: "", path: "", price: "", title1: "", title2: ""},
            CD: {},
            CHECK: {
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
                }, READY: {AMAZON: false, AMAZONSTORE: false, EBAY: false, FBA: false, QS: false, ZEN: false},
                SF: {HIDE: false, LIST: false},
                NA: {AMAZON: false, AMAZONSTORE: false, EBAY: false, FBA: false, QS: false, ZEN: false}
            },
            COMPDATA: [],
            CP: {},
            DESCRIPTION: "",
            EAN: "",
            EBAYPRICEINCVAT: "",
            EXTENDEDPROPERTY: [],
            HIDE: false,
            IDBEP: {
                AMAZSPORT: "",
                AMZDEPARTMENT: "",
                AMZLATENCY: 0,
                BRAND: "",
                BULLETPOINT1: "",
                BULLETPOINT2: "",
                BULLETPOINT3: "",
                BULLETPOINT4: "",
                BULLETPOINT5: "",
                CATEGORIE1: "",
                CATEGORIE2: "",
                COMISO2: "",
                COMISO3: "",
                QSCAT1: "",
                QSCAT2: "",
                SEARCHTERM1: "",
                SEARCHTERM2: "",
                SEARCHTERM3: "",
                SEARCHTERM4: "",
                SEARCHTERM5: "",
                TARIFFCODE: "",
                TRADEPACK: ""
            },
            IDBFILTER: "",
            IMAGES: {},
            INVCHECK: {DATE: "", DONE: false},
            INVCHECKDATE: "",
            ISCOMPOSITE: false,
            LASTUPDATE: "",
            LINKEDSKUS: [],
            LINNID: "",
            LISTINGVARIATION: false,
            MARGINNOTE: "",
            MCOVERRIDES: {},
            MD: {
                AMAZONFEES: 0,
                AMAZPAVC: 0,
                AMAZPROFITLY: 0,
                AMAZSALESVAT: 0,
                EBAYFEES: 0,
                EBAYPROFITLY: 0,
                EBAYUKPAVC: 0,
                EBAYUKSALESVAT: 0,
                PACKAGING: 0,
                POSTALPRICEUK: 0,
                PRIMEPAVC: 0,
                PRIMEPOSTAGEUK: 0,
                QSFEES: 0,
                QSPAVC: 0,
                QSPROFITLY: 0,
                QSUKSALESVAT: 0,
                SHOPFEES: 0,
                SHOPPAVC: 0,
                SHOPUKSALESVAT: 0,
                TOTALPROFITLY: 0
            },
            MINSTOCK: 0,
            MONTHSTOCKHIST: {},
            ONORDER: [],
            PACKAGING: {EDITABLE: false, ITEMS: "", LOCK: false},
            PACKGROUP: "",
            PICKLIST: [],
            POSTID: "",
            POSTMODID: 0,
            PURCHASEPRICE: 0,
            QSPRICEINCVAT: "",
            RETAILPRICE: 0,
            SHELFLOCATION: {LETTER: "", NUMBER: "", PREFIX: ""},
            SHIPAMAZONEXP: "",
            SHIPCOURIEREXP: "",
            SHIPCOURIERSTD: "",
            SHIPEBAYSTD: "",
            SHIPFORMAT: "",
            SHOP: {PRICE: "", STATUS: 0},
            SHOPPRICEINCVAT: "",
            SHORTDESC: "",
            SKU: "",
            STOCKINFO: {WAREHOUSE: 0, YELLAND: 0},
            STOCKTOTAL: 0,
            STOCKVAL: 0,
            SUPPLIER: "",
            TILLFILTER: "",
            TITLE: "", QSDISCOUNT: 0, SHOPDISCOUNT: 0,
        TITLEWEBSITE: "",
            WEIGHT: 0
        }
}