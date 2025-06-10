import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {rodLocationObject} from "../../pages/item-database";
import {schema} from "../../types";
import {RootState} from "../store";
import {HYDRATE} from "next-redux-wrapper";
import itemTemplate from "../../components/utils/item-template";

export const hydrate = createAction<RootState>(HYDRATE);

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
 * @property {schema.Item | null} item
 * @property {string[]} suppliers
 * @property {Array string} brands
 * @property {string} [currentSupplier]
 * @property {newItem[]} newItems
 */
export interface itemDatabaseState {
    item: schema.Item;
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
        extraReducers: (builder) => {
            builder
                .addCase(hydrate, (state, action) => {
                    return {
                        ...state,
                        ...action.payload.itemDatabase
                    };
                })
                .addDefaultCase(() => {
                })
        },
        reducers: {
            setItem: (state, action) => {
                state.item = action.payload
            },
            setItemBrand: (state, action: PayloadAction<string>) => {
                state.item.brand = action.payload
            },
            setItemSupplier: (state, action: PayloadAction<string>) => {
                state.item.supplier = action.payload
                databaseSave(state.item)
            },
            setItemLocation: (state, action: PayloadAction<{ value: string, key: keyof schema.ShelfLocation }>) => {
                const {key, value} = action.payload
                state.item.shelfLocation[key] = value
                databaseSave(state.item)
            },
            setItemTitle: (state, action: PayloadAction<string>) => {
                state.item.title = action.payload
            },
            setItemWebsiteTitle: (state, action: PayloadAction<string>) => {
                state.item.webTitle = action.payload
            },
            dataBaseSave: (state) => {
                databaseSave(state.item)
            },
            setItemStatusBoxes: (state, action: PayloadAction<{ checked: boolean, title: keyof schema.DoneStatus }>) => {
                const {title, checked} = action.payload
                state.item.checkboxStatus.done[title] = checked
                databaseSave(state.item)
            },
            setItemChannelStatus: (state, action: PayloadAction<{ channel: string, status: string }>) => {
                let {channel, status} = action.payload
                switch (status) {
                    case "done":
                        state.item.checkboxStatus.done[channel as keyof schema.DoneStatus] = true;
                        state.item.checkboxStatus.notApplicable[channel as keyof schema.NotApplicableStatus] = false;
                        state.item.checkboxStatus.ready[channel as keyof schema.ReadyStatus] = false;
                        break;
                    case "ready":
                        state.item.checkboxStatus.done[channel as keyof schema.DoneStatus] = false;
                        state.item.checkboxStatus.notApplicable[channel as keyof schema.NotApplicableStatus] = false;
                        state.item.checkboxStatus.ready[channel as keyof schema.ReadyStatus] = true;
                        break;
                    case "notApplicable":
                        state.item.checkboxStatus.done[channel as keyof schema.DoneStatus] = false;
                        state.item.checkboxStatus.notApplicable[channel as keyof schema.NotApplicableStatus] = true;
                        state.item.checkboxStatus.ready[channel as keyof schema.ReadyStatus] = false;
                        break;
                }
                databaseSave(state.item)
            },
            setItemAmazonBulletPoints: (state, action: PayloadAction<{ value: string, index: number }>) => {
                let {value, index} = action.payload;
                switch (index) {
                    case 1:
                        state.item.mappedExtendedProperties.bulletPoint1 = value
                        break;
                    case 2:
                        state.item.mappedExtendedProperties.bulletPoint2 = value
                        break;
                    case 3:
                        state.item.mappedExtendedProperties.bulletPoint3 = value
                        break;
                    case 4:
                        state.item.mappedExtendedProperties.bulletPoint4 = value
                        break;
                    case 5:
                        state.item.mappedExtendedProperties.bulletPoint5 = value
                        break;
                }
                databaseSave(state.item)
            },
            setItemAmazonCategories: (state, action: PayloadAction<{ categoryID: string, id: number }>) => {
                let {categoryID, id} = action.payload
                if (id === 1) {
                    state.item.mappedExtendedProperties.category1 = categoryID
                }
                if (id === 2) {
                    state.item.mappedExtendedProperties.category2 = categoryID
                }
                databaseSave(state.item)
            },
            setItemShortDescription: (state, action: PayloadAction<string>) => {
                state.item.shortDescription = action.payload
                databaseSave(state.item)
            },
            setItemLongDescription: (state, action: PayloadAction<string>) => {
                state.item.description = action.payload
                databaseSave(state.item)
            },
            setItemSearchTerms: (state, action: PayloadAction<{ value: string, index: number }>) => {
                let {index, value} = action.payload
                switch (index) {
                    case 1:
                        state.item.mappedExtendedProperties.searchTerm1 = value
                        break;
                    case 2:
                        state.item.mappedExtendedProperties.searchTerm2 = value
                        break;
                    case 3:
                        state.item.mappedExtendedProperties.searchTerm3 = value
                        break;
                    case 4:
                        state.item.mappedExtendedProperties.searchTerm4 = value
                        break;
                    case 5:
                        state.item.mappedExtendedProperties.searchTerm5 = value
                        break;
                }
                databaseSave(state.item)
            },
            setItemImportDetails: (state, action: PayloadAction<{ [key: string]: schema.MappedExtendedProperties | string }>) => {
                for (const key in action.payload) {
                    switch (key) {
                        case "mappedExtendedProperties":
                            state.item.mappedExtendedProperties = {...state.item.mappedExtendedProperties, ...action.payload.mappedExtendedProperties as schema.MappedExtendedProperties}
                            break;
                        case "description":
                            state.item.description = action.payload[key] as string
                            break;
                        case "shortDescription":
                            state.item.shortDescription = action.payload[key] as string
                            break;
                    }
                }
                databaseSave(state.item)
            },
            setItemImages: (state, action: PayloadAction<{ index: keyof schema.Images, filename: string, publicFilename?: string }>) => {
                let {index, filename, publicFilename} = action.payload
                state.item.images[index] = {
                    ...state.item.images[index],
                    ...{filename: filename},
                    ...(publicFilename && {publicFilename: publicFilename})
                }
            },
            setTags: (state, action: PayloadAction<string[]>) => {
                state.tags = action.payload
            },
            setItemTags: (state, action: PayloadAction<string[]>) => {
                state.item.tags = action.payload
                databaseSave(state.item)
            },
            setUpdateTags: (state, action: PayloadAction<string>) => {
                let tag = action.payload.trim().toLowerCase()
                let tagsCopy = state.tags
                tagsCopy.push(tag)
                tagsCopy.sort()
                state.tags = tagsCopy
                state.item.tags.push(tag)
                databaseSave(state.item)
            },
            setItemBrandLabel: (state, action: PayloadAction<schema.BrandLabel>) => {
                state.item.brandLabel = action.payload
                databaseSave(state.item)
            },
            setItemShipping: (state, action: PayloadAction<string>) => {
                state.item.mappedExtendedProperties.shippingFormat = action.payload
                databaseSave(state.item)
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
    setItemBrandLabel,
    setTags,
    setUpdateTags,
    setItemTags,
    setItemShipping,
    setItemImportDetails,
    dataBaseSave
} = itemDatabaseSlice.actions

export const selectItem = (state: itemDatabaseWrapper) => state.itemDatabase.item;
export const selectSuppliers = (state: itemDatabaseWrapper) => state.itemDatabase.suppliers;
export const selectCurrentSupplier = (state: itemDatabaseWrapper) => state.itemDatabase.currentSupplier;
export const selectTags = (state: itemDatabaseWrapper) => state.itemDatabase.tags;
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

function databaseSave(item: schema.Item) {
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